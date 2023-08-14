'use client'
import React, { useState, useEffect } from 'react';
import { getDadoIbgeByFullURL, dataReturn, createOptions, createChartData, dataInfo, dataLocation } from '../utils/ibgeAPI';
import { Bar, Doughnut, Line, PolarArea, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { Autocomplete, CircularProgress, Select, TextField, useTheme, MenuItem } from '@mui/material';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, BarElement, RadialLinearScale, ArcElement);

function IBGEDataPage() {
  const theme = useTheme();
  const [data, setData] = useState<dataReturn | null | undefined>();
  const [dataOption, setDataOption] = useState<string>(Object.keys(dataInfo)[0]);
  const [location, setLocation] = useState<string>(Object.keys(dataLocation)[0])

  console.log(data)

  useEffect(() => {
    async function fetchData() {
      setData(await getDadoIbgeByFullURL(dataInfo[dataOption].link, location));
    }
    if (dataOption) {
      fetchData();
    }
  }, [dataOption, location]);

  return (
    <div className='h-full min-h-screen max-w-screen-2xl flex flex-col items-center w-full'>
      <h1 className='text-4xl text-white font-bold my-3'>Dados do IBGE</h1>
      <div className='flex flex-col sm:flex-row'>
        <Select autoFocus value={location} onChange={(event) => setLocation(event.target.value)} sx={{ width: 200 }}>
          {Object.keys(dataLocation).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
        <Autocomplete
          disablePortal
          value={dataOption}
          onChange={(event, newValue) => setDataOption(newValue)}
          groupBy={(option) => dataInfo[option].type}
          options={Object.keys(dataInfo)}
          sx={{
            width: { xs: "100%", md: 340 },
            maxWidth: 340,
            "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] .MuiAutocomplete-input": {
              color: theme.palette.primary.contrastText
            },
            "& + .MuiAutocomplete-popper .MuiAutocomplete-option":
            {
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
            },
            "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected='true']":
            {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
            "& + .MuiAutocomplete-popper .MuiAutocomplete-option[aria-selected ='true'] .Mui-focused":
            {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
          renderInput={(params) => <TextField focused {...params} label="Dados" />}
        />
      </div>
      {data && (
        <>
        <div className='w-[70vw] flex justify-between'>
          <p>Dados de <span style={{color: theme.palette.primary.light}} className='font-semibold'>{data.data[0].name}</span> até <span style={{color: theme.palette.primary.light}} className='font-semibold'>{data.data[data.data.length-1].name}</span></p>
          <p>Números de resultados: {data.data.length}</p>
          </div>
        <div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center w-full sm:h-[80vh] gap-4 grid-rows-2 lg:pl-6'>
          <div className='flex justify-center items-center'>
            <Line data={createChartData(data)} options={createOptions(data, true, true)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='flex justify-center items-center'>
            <Bar data={createChartData(data)} options={createOptions(data, true, true)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='lg:col-span-2 lg:row-span-2 flex justify-center items-center'>
            <PolarArea data={createChartData(data)} options={createOptions(data)} style={{ width: '100%', height: '800px' }} />
          </div>
          <div className='flex justify-center items-center'>
            <Doughnut data={createChartData(data)} options={createOptions(data)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='flex justify-center items-center col-span-1 sm:col-span-2 lg:col-span-1'>
            <Scatter data={createChartData(data, true)} options={createOptions(data, true)} style={{ width: '100%', height: '500px' }} />
          </div>
        </div>
        </>
      )}

      {data === undefined && (
        <div className='fixed h-screen items-center flex'>
          <CircularProgress color='secondary' />
        </div>
      )}

      {data === null && (
        <div className='h-[80vh] items-center justify-center flex'>
          <p>{location === "" ? "Selecione uma localidade primeiro." : `Não foi encontrado esses dados do IBGE em ${location}`}</p>
        </div>
      )}
      <span className='w-full flex justify-end'>Desenvolvido por <a href='https://github.com/ViniciusCestarii' className='underline font-semibold' style={{color: theme.palette.primary.light}}>@ViniciusCestarii</a></span>
    </div>
  );
}

export default IBGEDataPage;