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

const getInfoByear = (data: object, years: string[]) => {
  return years.map((year) => ({
    value: data.resultados[0].series[0].serie[year],
    name: year.length > 4 ? `${year.substring(0, 4)} ${year.substring(5, 6)}° trimestre` : year,
  }));
}

export const getDadoIbgeByFullURL = async (url: string): dataReturn => {
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