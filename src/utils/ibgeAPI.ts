import axios from 'axios';
import { ChartOptions } from 'chart.js';

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
    percentage?: number;
    months?: boolean;
  };
} = {
  'Produção de Leite': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1086/periodos/199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/282?localidades=&classificacao=12716[115236]' },
  'Produção de Ovo': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/915/periodos/201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/29?localidades=' },
  'Produção de Banana': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4930]' },
  'Produção de Laranja': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4961]' },
  'Produção de Limão': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4963]' },
  'Produção de Manga': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1730/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=227[4968]' },
  'Produção de Batata-doce': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4853]' },
  'Produção de Cana-de-áçucar': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4857]' },
  'Produção de Mandioca': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4885]' },
  'Produção de Milho': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4888]' },
  'Produção de Soja': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4896]' },
  'Produção de Tomate': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1731/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/214?localidades=&classificacao=226[4899]' },
  'Área dos estabelecimentos agropecuários utilizada para pastagem': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1031/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/184?localidades=&classificacao=12777[118269]', percentage: 2339 },
  'Área dos estabelecimentos agropecuários utilizada para lavouras': { type: 'Dados Agropecuários', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/1031/periodos/1940|1950|1960|1970|1975|1980|1985|1995|2006/variaveis/184?localidades=&classificacao=12777[118268]', percentage: 2339 },
  'Índice de Gini': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/155/periodos/1991|2000/variaveis/95?localidades=' },
  'Número total de brasileiros natos': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/617/periodos/1991|2000|2010/variaveis/289?localidades=' },
  'Número de brasileiros natos com 80 anos ou mais': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/617/periodos/1991|2000|2010/variaveis/289?localidades=&classificacao=58[2503]' },
  'População residente estimada': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2001|2002|2003|2004|2005|2006|2008|2009|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021/variaveis/9324?localidades=' },
  'População residente branca': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/136/periodos/1991|2000|2010/variaveis/93?localidades=&classificacao=86[2776]', percentage: 10000 },
  'População residente parda': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/136/periodos/1991|2000|2010/variaveis/93?localidades=&classificacao=86[2779]', percentage: 10000 },
  'População residente preta': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/136/periodos/1991|2000|2010/variaveis/93?localidades=&classificacao=86[2777]', percentage: 10000 },
  'População residente indígena': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/136/periodos/1991|2000|2010/variaveis/93?localidades=&classificacao=86[2780]', percentage: 10000 },
  'População residente amarela': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/136/periodos/1991|2000|2010/variaveis/93?localidades=&classificacao=86[2778]', percentage: 10000 },
  'População católica apostólica romana residente': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/93?localidades=&classificacao=86[0]|133[95263]', percentage: 10000 },
  'População evangélica residente': { type: 'Dados Demográficos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2094/periodos/2000|2010/variaveis/93?localidades=&classificacao=86[0]|133[95277]', percentage: 10000 },
  'Taxa de admissão em empresas indústriais': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2575/periodos/200101|200102|200103|200104|200105|200106|200107|200108|200109|200110|200111|200112|200201|200202|200203|200204|200205|200206|200207|200208|200209|200210|200211|200212|200301|200302|200303|200304|200305|200306|200307|200308|200309|200310|200311|200312|200401|200402|200403|200404|200405|200406|200407|200408|200409|200410|200411|200412|200501|200502|200503|200504|200505|200506|200507|200508|200509|200510|200511|200512|200601|200602|200603|200604|200605|200606|200607|200608|200609|200610|200611|200612|200701|200702|200703|200704|200705|200706|200707|200708|200709|200710|200711|200712|200801|200802|200803|200804|200805|200806|200807|200808|200809|200810|200811|200812|200901|200902|200903|200904|200905|200906|200907|200908|200909|200910|200911|200912|201001|201002|201003|201004|201005|201006|201007|201008|201009|201010|201011|201012|201101|201102|201103|201104|201105|201106|201107|201108|201109|201110|201111|201112|201201|201202|201203|201204|201205|201206|201207|201208|201209|201210|201211|201212|201301|201302|201303|201304|201305|201306|201307|201308|201309|201310|201311|201312|201401|201402|201403|201404|201405|201406|201407|201408|201409|201410|201411|201412|201501|201502|201503|201504|201505|201506|201507|201508|201509|201510|201511|201512/variaveis/1353?localidades=&classificacao=11773[95021]', months: true },
  'Número de pessoas ocupadas assalariadas total': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2722/periodos/2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020/variaveis/484?localidades=&classificacao=12762[117897]' },
  'Número de pessoas ocupadas assalariadas no setor agropecuário': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2722/periodos/2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020/variaveis/484?localidades=&classificacao=12762[116830]', percentage: 1000 },
  'Número de pessoas ocupadas assalariadas no setor comunicação e informação': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/2722/periodos/2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020/variaveis/484?localidades=&classificacao=12762[117555]', percentage: 1000 },
  'Variação de preços de indústria geral ao consumidor': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/6904/periodos/201312|201401|201402|201403|201404|201405|201406|201407|201408|201409|201410|201411|201412|201501|201502|201503|201504|201505|201506|201507|201508|201509|201510|201511|201512|201601|201602|201603|201604|201605|201606|201607|201608|201609|201610|201611|201612|201701|201702|201703|201704|201705|201706|201707|201708|201709|201710|201711|201712|201801|201802|201803|201804|201805|201806|201807|201808|201809|201810|201811|201812|201901|201902|201903|201904|201905|201906|201907|201908|201909|201910|201911|201912|202001|202002|202003|202004|202005|202006|202007|202008|202009|202010|202011|202012|202101|202102|202103|202104|202105|202106|202107|202108|202109|202110|202111|202112|202201|202202|202203|202204|202205|202206|202207|202208|202209|202210|202211|202212|202301|202302|202303|202304|202305|202306/variaveis/1396?localidades=&classificacao=543[33586]', months: true },
  'Variação de preços de bens de consumo ao consumidor': { type: 'Dados Econômicos', link: 'https://servicodados.ibge.gov.br/api/v3/agregados/6904/periodos/201312|201401|201402|201403|201404|201405|201406|201407|201408|201409|201410|201411|201412|201501|201502|201503|201504|201505|201506|201507|201508|201509|201510|201511|201512|201601|201602|201603|201604|201605|201606|201607|201608|201609|201610|201611|201612|201701|201702|201703|201704|201705|201706|201707|201708|201709|201710|201711|201712|201801|201802|201803|201804|201805|201806|201807|201808|201809|201810|201811|201812|201901|201902|201903|201904|201905|201906|201907|201908|201909|201910|201911|201912|202001|202002|202003|202004|202005|202006|202007|202008|202009|202010|202011|202012|202101|202102|202103|202104|202105|202106|202107|202108|202109|202110|202111|202112|202201|202202|202203|202204|202205|202206|202207|202208|202209|202210|202211|202212|202301|202302|202303|202304|202305|202306/variaveis/1396?localidades=&classificacao=543[33584]', months: true },
}

export const getInfoByear = (data: any, allYears: string[], months?: boolean) => {
  const validYears = []
  for (const year of allYears) {
    const dataValue = data.resultados[0].series[0].serie[year]
    if (isNaN(parseFloat(dataValue))) {
      delete data.resultados[0].series[0].serie[year]
    } else {
      validYears.push(year)
    }
  }
  return validYears.map((year) => ({
    value: data.resultados[0].series[0].serie[year],
    name: year.length > 4 ? months ? `${year.substring(0, 4)} mês ${year.substring(4, 6)}` : `${year.substring(0, 4)} ${year.substring(5, 6)}° trimestre` : year,
  }));
}

export const getYearsFromUrl = (url: string): string[] => {
  const start = url.indexOf("periodos/") + "periodos/".length;
  const end = url.indexOf("/variaveis");
  const numbersStr = url.slice(start, end);
  return numbersStr.split("|");
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
      } else {
        allLocalities[municipality.nome + " (cidade)"] = `N6[${municipality.id}]`;
      }
    }

    return allLocalities;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getDadoIbgeByFullURL = async (url: string, location: string, locationOptions: { [key: string]: string }, isPercentage?: number, months?: boolean): Promise<dataReturn | null> => {
  const urlLocation = "?localidades=" + locationOptions[location]
  url = url.replace("?localidades=", urlLocation)

  if (isPercentage) {
    if (isPercentage.toString().substring(0, 2) === "10") {
      url = url.replace("variaveis/", `variaveis/${isPercentage}`)
    } else {
      const startIndex = url.lastIndexOf("/variaveis/") + 11
      const endIndex = url.indexOf("?", startIndex);

      if (startIndex >= 11 && endIndex > startIndex) {
        const numberString = url.substring(startIndex, endIndex);
        const parsedNumber = parseInt(numberString);

        if (!isNaN(parsedNumber)) {
          url = url.replace(`variaveis/${parsedNumber}`, `variaveis/${isPercentage}`)
        } else {
          console.error("Error parsing number:", numberString);
        }
      }
    }
  }

  try {
    const response = await axios.get(url);
    const years = getYearsFromUrl(url)

    const data: dataReturn = {
      data: getInfoByear(response.data[0], years, months),
      name: response.data[0].variavel,
      unit: response.data[0].unidade
    }
    return data
  } catch (error) {
    console.error('Error fetching:', error);
    return null;
  }
}

export const createChartData = (data: dataReturn, contrast?: boolean, axis?: boolean) => {
  const colors = [
    'rgba(60, 60, 80, 0.7)',    // Azul escuro
    'rgba(90, 90, 120, 0.7)',   // Azul médio-escuro
    'rgba(120, 120, 160, 0.7)', // Azul médio
    'rgba(150, 150, 200, 0.7)', // Azul médio-claro
    'rgba(180, 180, 240, 0.7)', // Azul claro
  ]
  const contrastColors = [
    'rgba(0, 123, 255, 0.85)',   // Azul brilhante
    'rgba(255, 159, 64, 0.85)',  // Laranja
    'rgba(0, 206, 209, 0.85)',   // Turquesa
    'rgba(46, 204, 113, 0.85)',  // Verde esmeralda
    'rgba(255, 59, 48, 0.85)',   // Vermelho
    'rgba(138, 43, 226, 0.85)',  // Roxo
    'rgba(255, 99, 71, 0.85)',   // Vermelho mais claro
    'rgba(255, 200, 87, 0.85)',  // Amarelo pálido
    'rgba(70, 130, 180, 0.85)',  // Azul aço
    'rgba(255, 140, 0, 0.85)',   // Laranja intenso
  ]
  const choosedColors = contrast ? contrastColors : colors
  const chartData = {
    labels: data.data.map((item) => item.name),
    datasets: [
      {
        data: axis ? data.data.map((item, index) => { return { x: parseInt(item.name.substring(0, 5)), y: item.value } }) : data.data.map((item) => item.value),
        pointBorderColor: choosedColors.slice(1),
        pointBackgroundColor: choosedColors.slice(1),
        ticks: {
          color: "white",
        },
        backgroundColor: choosedColors,
        borderColor: choosedColors,
      }
    ]
  }
  return chartData
}

export const createOptions = (data: dataReturn, showY?: boolean, showX?: boolean): Object => {
  const options: ChartOptions = {
    plugins: {
      colors: {
        forceOverride: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: data.name.length > 55 ? data.name.substring(0, 55) + "..." : data.name,
        color: "white",
        font: {
          size: 18,
        },
      },
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
      },
    },
    scales: {},
  };

  if (showY) {
    options.scales = {
      ...options.scales,
      y: {
        ticks: {
          color: "white",
        },
      },
    };
  }
  if (showX) {
    options.scales = {
      ...options.scales,
      x: {
        ticks: {
          color: "white",
        },
      },
    };
  }

  return options;
};