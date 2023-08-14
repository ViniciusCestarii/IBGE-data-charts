import axios from 'axios';

const IBGE_API_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/';

export type dataVariable = {
  value: string
  name: string
}

export type dataReturn = {
  data: dataVariable[]
  name: string
}

export const dataInfo = {
  'Ovos': {type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/915/periodos/201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/29'},
  'Expectativa de Vida': {type: 'Dados Demográficos', link: ''},
  'População residente estimada': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2001|2002|2003|2004|2005|2006|2008|2009|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021/variaveis/9324'},
  'PIB': {type: 'Dados Econômicos', link: ''},
}

export const dataLocation = {
  'Santa Catarina': 'N3[42]',
  'Brusque': 'N6[4202909]',
}

const getInfoByear = (data: object, years: string[]) => {
  return years.map((year) => ({
    value: data.resultados[0].series[0].serie[year],
    name: year.length > 4 ? `${year.substring(0, 4)} ${year.substring(5, 6)}° trimestre` : year,
  }));
}

export const getDadoIbgeByFullURL = async (url: string, location: string): dataReturn => {
  //https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2001|2002|2003|2004|2005|2006|2008|2009|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021/variaveis/9324?localidades=N6[4202909]

  console.log(location)
  console.log(dataLocation[location])
  url += "?localidades=" + dataLocation[location]
  console.log(url)
  
  try {
    const response = await axios.get(url);
    const start = url.indexOf("periodos/") + "periodos/".length;
    const end = url.indexOf("/variaveis");
    const numbersStr = url.slice(start, end);
    let years = numbersStr.split("|");

    const data: dataReturn = {
      data: getInfoByear(response.data[0], years),
      name: response.data[0].variavel
    }
    return data
  } catch (error) {
    console.error('Error fetching:', error);
    return null;
  }
}

export const createChartData = (data: dataReturn, axis?: boolean) => {
  const chartData = {
    labels: data.data.map((item) => item.name),
    datasets: [
      {
        data: axis ? data.data.map((item, index) => {return { x: index + 1, y: item.value  }}) : data.data.map((item) => item.value),
        pointBorderColor: "rgba(150, 150, 200, 0.7)",
        pointBackgroundColor: "rgba(150, 150, 200, 0.7)",
        ticks: {
          color: "white",
        },
        backgroundColor: [
          'rgba(60, 60, 80, 0.7)',    // Azul escuro
          'rgba(90, 90, 120, 0.7)',   // Azul médio-escuro
          'rgba(120, 120, 160, 0.7)', // Azul médio
          'rgba(150, 150, 200, 0.7)', // Azul médio-claro
          'rgba(180, 180, 240, 0.7)', // Azul claro
        ],
        borderColor: [
          'rgba(60, 60, 80, 0.7)',    // Azul escuro
          'rgba(90, 90, 120, 0.7)',   // Azul médio-escuro
          'rgba(120, 120, 160, 0.7)', // Azul médio
          'rgba(150, 150, 200, 0.7)', // Azul médio-claro
          'rgba(180, 180, 240, 0.7)', // Azul claro
        ],
      }
    ]
  }
  return chartData
}

export const createOptions = (data: dataReturn, showY?: boolean, showX?: boolean) => {
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: data.name,
        color: "white",
        font: {
          size: 18,
        }
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 1,
        borerColor: "lightblue",
        fill: "start",
        backgroundColor: "lightblue",
      },
      point: {
        radius: 4,
        hitRadius: 4,

      }
    },
    scales: {
    },
  }

  if (showY) {
    options.scales.y = {
      ticks: {
        color: "white",
      }
    }
  }
  if (showX) {
    options.scales.x = {
      ticks: {
        color: "white",
      }
    }
  }
  return options
}