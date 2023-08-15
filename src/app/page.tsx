'use client'
import React, { useState, useEffect, ReactNode, SyntheticEvent } from 'react';
import { getDadoIbgeByFullURL, dataReturn, createOptions, createChartData, dataInfo, getAllLocalities } from '../utils/ibgeAPI';
import { Bar, Line, PolarArea, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { Autocomplete, CircularProgress, Popper, TextField, useTheme } from '@mui/material';
import { CalendarBlank, Magnify, MagnifyRemoveOutline, CursorDefaultOutline, AccountMultipleOutline, Cow, CurrencyUsd, MathCompass } from 'mdi-material-ui';
import ListboxComponent from '@/components/Listbox';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, BarElement, RadialLinearScale, ArcElement);

interface LocationOptions {
  [key: string]: string;
}

const getDadoTypeIcon = (type: string) => {
  switch (type) {
    case 'Dados Agropecuário':
      return <Cow className='text-xl mr-2' />
    case 'Dados Demográficos':
      return <AccountMultipleOutline className='text-xl mr-2' />
    case 'Dados Econômicos':
      return <CurrencyUsd className='text-xl mr-2' />
    default: return <></>
  }
}

const getRegiaoByLevel = (level: number): string => {
  switch (level) {
    case 1:
      return 'País'
    case 3:
      return 'Estados'
    case 6:
      return 'Cidades'
  }
  return 'Outras Localidades'
}

function IBGEDataPage() {
  const theme = useTheme();
  const [data, setData] = useState<dataReturn | null | undefined>();
  const [dataOption, setDataOption] = useState<string>(Object.keys(dataInfo)[0]);
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({});
  const [location, setLocation] = useState<string>("Brasil")

  const handleChangeLocation = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    if (newValue !== null) {
      setLocation(newValue);
      setData(undefined);
    }
  };

  const handleChangeDataOption = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    if (newValue !== null) {
      setDataOption(newValue);
      setData(undefined);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(locationOptions).length > 0) {
        setData(await getDadoIbgeByFullURL(dataInfo[dataOption].link, location, locationOptions));
      }
    }
    if (dataOption) {
      fetchData();
    }
  }, [dataOption, location, locationOptions]);

  useEffect(() => {
    const fetchData = async () => {
      const localities = await getAllLocalities()
      setLocationOptions(localities);
    }
    fetchData()
  }, [])

  return (
    <div className='h-full flex flex-col items-center w-full px-3'>
      <h1 className='text-4xl text-white font-bold my-3 text-center'>Dados do IBGE</h1>
      <div className='flex flex-col space-y-2 w-full items-center justify-center sm:flex-row sm:space-x-4 sm:space-y-0 pb-2'>
        <Autocomplete
          PopperComponent={(props) => (
            <Popper
              {...props}
              sx={{
                '& .MuiAutocomplete-listbox::-webkit-scrollbar': {
                  width: '8px',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: '2px',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(60, 60, 80)',
                },
              }}
            />)}
          disablePortal
          ListboxComponent={ListboxComponent}
          disableListWrap
          value={location}
          onChange={handleChangeLocation}
          loading={Object.keys(locationOptions).length === 0}
          groupBy={(option) => getRegiaoByLevel(parseInt(locationOptions[option].substring(1, 3)))}
          renderGroup={(params) => params as unknown as ReactNode}
          options={Object.keys(locationOptions)}
          renderOption={(props, option, state) =>
            [props, option, state.index] as React.ReactNode
          }
          sx={{
            width: { xs: "100%", md: 340 },
            maxWidth: 340,
          }}
          renderInput={(params) => <TextField {...params} label="Localização"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {Object.keys(locationOptions).length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }} />}
        />
        <Autocomplete
          PopperComponent={(props) => (
            <Popper
              {...props}
              sx={{
                '& .MuiAutocomplete-listbox::-webkit-scrollbar': {
                  width: '8px',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: '4px',
                },
                '& .MuiAutocomplete-listbox::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(60, 60, 80)',
                },
              }}
            />)}
          renderGroup={(params) => {
            return (
              <li key={params.key}>
                <div className='sticky -top-2 py-2 px-10 font-semibold flex items-center' style={{ backgroundColor: 'rgba(60, 60, 80)' }}>{getDadoTypeIcon(params.group)} {params.group}</div>
                <ul>{params.children}</ul>
              </li>)
          }}
          disablePortal
          value={dataOption}
          onChange={handleChangeDataOption}
          groupBy={(option) => dataInfo[option].type}
          options={Object.keys(dataInfo)}
          sx={{
            width: { xs: "100%", md: 340 },
            maxWidth: 340,
          }}
          renderInput={(params) => <TextField {...params} label="Dados" />}
        />
      </div>
      {data && data && data.data[0].value !== "..." && (
        <>
          <div className='w-full flex flex-col text-xs sm:text-sm pt-3 sm:pt-0 max-w-screen-xl sm:-mb-8'>
            <p><CalendarBlank className='text-lg sm:text-xl' /> Dados de <span style={{ color: theme.palette.primary.light }} className='font-semibold'>{data.data[0].name}</span> até <span style={{ color: theme.palette.primary.light }} className='font-semibold'>{data.data[data.data.length - 1].name}</span></p>
            <p><Magnify className='text-lg sm:text-xl' /> Números de resultados: {data.data.length}</p>
            <p><MathCompass className='text-lg sm:text-xl' /> Unidade de medida: {data.unit.toLocaleLowerCase()}</p>
          </div>
          <div className='max-w-[1400px] grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center w-full sm:h-auto gap-4 grid-rows-2'>
            <div className='flex justify-center items-center flex-col'>
              <Line data={createChartData(data)} options={createOptions(data, true, true)} />
            </div>
            <div className='flex justify-center items-center'>
              <Scatter data={createChartData(data, true)} options={createOptions(data, true, true)} />
            </div>
            <div className='lg:col-span-2 lg:row-span-2 flex justify-center items-center'>
              <PolarArea data={createChartData(data)} options={createOptions(data)} />
            </div>
            <div className='flex justify-center items-center col-span-1 lg:col-span-2'>
              <Bar data={createChartData(data)} options={createOptions(data, true, true)} />
            </div>
          </div>
          <div className='p-3 lg:p-0'>
            <p className='text-xs opacity-60'>Arraste o mouse por cima dos gráficos para mais informação <CursorDefaultOutline className='text-base' /> </p>
          </div>
        </>
      )}

      {data === undefined && (
        <div className='fixed h-screen items-center flex'>
          <CircularProgress color='secondary' />
        </div>
      )}

      {(data === null || data && data.data[0].value === "...") && (
        <div className='h-[50vh] sm:h-[80vh] items-center justify-center flex flex-col space-y-4 text-center'>
          <p>{location === "" || location === null ? "Selecione uma localidade primeiro." : `Não foi encontrado esses dados do IBGE em ${location}`}</p>
          <MagnifyRemoveOutline className='text-3xl' />
        </div>
      )}
    </div>
  );
}

export default IBGEDataPage;