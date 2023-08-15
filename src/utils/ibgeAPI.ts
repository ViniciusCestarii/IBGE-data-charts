import axios from 'axios';

const IBGE_API_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/';

export type dataVariable = {
  value: string
  name: string
}

export type dataReturn = {
  data: dataVariable[]
  name: string
  unit: string
}

export const dataInfo: {
  [key: string]: {
    type: string;
    link: string;
  };
} = {
  'Produção de Leite': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1086/periodos/199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/282?localidades=&classificacao=12716[115236]' },
  'Produção de Ovo': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/915/periodos/201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/29?localidades=' },
  'Produção de Banana': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4930]' },
  'Produção de Laranja': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4961]' },
  'Produção de Limão': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4963]' },
  'Produção de Manga': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4968]' },
  'Produção de Batata-doce': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4853]' },
  'Produção de Cana-de-áçucar': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4857]' },
  'Produção de Mandioca': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4885]' },
  'Produção de Milho': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4888]' },
  'Produção de Soja': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4896]' },
  'Produção de Tomate': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4899]' },
  'Área dos estabelecimentos agropecuários utilizada para pastagem': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1031/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/184?localidades=&classificacao=12777[118269]' },
  'Área dos estabelecimentos agropecuários utilizada para lavouras': { type: 'Dados Agropecuário', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1031/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/184?localidades=&classificacao=12777[118268]' },
  'Número total de brasileiros natos': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/617/periodos/1991|2000|2010/variaveis/289?localidades=' },
  'Número de brasileiros natos com 80 anos ou mais': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/617/periodos/1991|2000|2010/variaveis/289?localidades=&classificacao=58[2503]' },
  'População residente': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/93?localidades=&classificacao=86[0]|133[0]'},
  'População residente estimada': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2001|2002|2003|2004|2005|2006|2008|2009|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021/variaveis/9324?localidades='},
  'População católica apostólica romana residente': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/93?localidades=&classificacao=86[0]|133[95263]'},
  'Porcentagem da população católica apostólica romana residente': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/1000093?localidades=&classificacao=86[0]|133[95263]'},
  'População evangélica residente': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/93?localidades=&classificacao=86[0]|133[95277]'},
  'Porcentagem da população evangélica residente': {type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/1000093?localidades=&classificacao=86[0]|133[95277]'},
  'Massa de rendimento mensal das pessoas de 14 anos ou mais de idade com rendimento de trabalho, habitualmente recebido em todos os trabalhos': {type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/5606/periodos/201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301|202302/variaveis/6293?localidades='},
  'PIB': { type: 'Dados Econômicos', link: '' },
}

const getInfoByear = (data: any, years: string[]) => {
  return years.map((year) => ({
    value: data.resultados[0].series[0].serie[year],
    name: year.length > 4 ? `${year.substring(0, 4)} ${year.substring(5, 6)}° trimestre` : year,
  }));
}

export const getAllLocalities = async () => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const states = response.data;

    const allLocalities: { [key: string]: string } = { "Brasil": "N1[1]" };

    for (const state of states.sort((a: any, b: any) => a.nome.localeCompare(b.nome))) {
      allLocalities[state.nome] = `N3[${state.id}]`;
    }

    let municipalities = [];

    for (const state of states) {
      const municipalitiesResponse = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.sigla}/municipios`);
      municipalities.push(...municipalitiesResponse.data)
    }

    for (const municipality of municipalities.sort((a, b) => a.nome.localeCompare(b.nome))) {
      if (!allLocalities.hasOwnProperty(municipality.nome)) {
        allLocalities[municipality.nome] = `N6[${municipality.id}]`;
      }
    }

    return allLocalities;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getDadoIbgeByFullURL = async (url: string, location: string, locationOptions: { [key: string]: string }): Promise<dataReturn | null> => {
  const urlLocation = "?localidades=" + locationOptions[location]
  url = url.replace("?localidades=", urlLocation)

  try {
    const response = await axios.get(url);
    const start = url.indexOf("periodos/") + "periodos/".length;
    const end = url.indexOf("/variaveis");
    const numbersStr = url.slice(start, end);
    let years = numbersStr.split("|");

    const data: dataReturn = {
      data: getInfoByear(response.data[0], years),
      name: response.data[0].variavel,
      unit: response.data[0].unidade
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
        data: axis ? data.data.map((item, index) => { return { x: parseInt(item.name.substring(0, 5)), y: item.value } }) : data.data.map((item) => item.value),
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

type ChartOptions = {
  plugins: {
    legend: {
      display: boolean;
    };
    title: {
      display: boolean;
      text: string;
      color: string;
      font: {
        size: number;
      };
    };
  };
  elements: {
    line: {
      tension: number;
      borderWidth: number;
      borderColor: string;
      fill: string;
      backgroundColor: string;
    };
    point: {
      radius: number;
      hitRadius: number;
    };
  };
  scales: {
    x?: {
      ticks: {
        color: string;
      };
    };
    y?: {
      ticks: {
        color: string;
      };
    };
  };
};

export const createOptions = (data: dataReturn, showY?: boolean, showX?: boolean) => {
  const options: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: data.name.length > 55 ? data.name.substring(0, 55) + "..." : data.name,
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
        borderColor: "lightblue",
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