'use client'
import { useState, useEffect, ReactNode } from 'react';
import { getDadoIbgeByFullURL, dataReturn, createOptions, createChartData, dataInfo, getAllLocalities, getYearsFromUrl } from '../utils/ibgeAPI';
import { Bar, Line, PolarArea, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { Autocomplete, Checkbox, CircularProgress, Popper, TextField, useTheme, Tooltip as TooltipMUI, useMediaQuery } from '@mui/material';
import CalendarBlank from 'mdi-material-ui/CalendarBlank';
import Magnify from 'mdi-material-ui/Magnify';
import MagnifyRemoveOutline from 'mdi-material-ui/MagnifyRemoveOutline';
import CursorDefaultOutline from 'mdi-material-ui/CursorDefaultOutline';
import AccountMultipleOutline from 'mdi-material-ui/AccountMultipleOutline';
import Cow from 'mdi-material-ui/Cow';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import MathCompass from 'mdi-material-ui/MathCompass';
import PercentBox from 'mdi-material-ui/PercentBox';
import DivisionBox from 'mdi-material-ui/DivisionBox';
import StarFourPointsBox from 'mdi-material-ui/StarFourPointsBox';
import ListboxComponent from '@/components/Listbox';
import Cancel from 'mdi-material-ui/Cancel';
import GestureTap from 'mdi-material-ui/GestureTap';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, BarElement, RadialLinearScale, ArcElement);

interface LocationOptions {
  [key: string]: string;
}

const checkData = (data: dataReturn | null | undefined): boolean => (
  !!(data && data.data && data.data[0] && data.data[0].value)
)

const checkMaxYears = (dataOption: string): boolean => (
  getYearsFromUrl(dataInfo[dataOption].link).length > 40
)

const getDadoTypeIcon = (type: string) => {
  switch (type) {
    case 'Dados Agropecuários':
      return <Cow className='mr-2' fontSize='small' />
    case 'Dados Demográficos':
      return <AccountMultipleOutline className='mr-2' fontSize='small' />
    case 'Dados Econômicos':
      return <CurrencyUsd className='mr-2' fontSize='small' />
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
  const [filteredData, setFilteredData] = useState<dataReturn | null | undefined>();
  const [dataOption, setDataOption] = useState<string>(Object.keys(dataInfo)[0]);
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({});
  const [location, setLocation] = useState<string>("Brasil")
  const [isPercentage, setIsPercentage] = useState<boolean>(false);
  const [isMaxYears, setIsMaxYears] = useState<boolean>(false);
  const [isContrast, setIsContrast] = useState<boolean>(false);

  const isBiggerThanLg = useMediaQuery(theme.breakpoints.up('lg'))

  const handleChangeIsContrast = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsContrast(event.target.checked);
  };

  const handleChangeIsPercentage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPercentage(event.target.checked);
  };

  const handleChangeIsMaxYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMaxYears(event.target.checked);
  };

  const handleChangeLocation = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    if (newValue !== null) {
      setLocation(newValue);
      setData(undefined);
    }
  };

  const handleChangeDataOption = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    if (newValue !== null) {
      setDataOption(newValue);
      if (!dataInfo[newValue].percentage) {
        setIsPercentage(false);
      }
      if (!checkMaxYears(newValue)) {
        setIsMaxYears(false);
      }

      setData(undefined);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(locationOptions).length > 0) {
        setData(await getDadoIbgeByFullURL(dataInfo[dataOption].link, location, locationOptions, isPercentage ? dataInfo[dataOption].percentage : undefined, dataInfo[dataOption].months));
      }
    }
    if (dataOption) {
      fetchData();
    }
  }, [dataOption, location, locationOptions, isPercentage]);

  useEffect(() => {
    if (data) {
      const cloneData = { ...data }
      cloneData.data = cloneData.data.filter((_, index) => index % (isMaxYears ? 4 : 1) === 0)
      setFilteredData(cloneData)
    } else {
      setFilteredData(data)
    }
  }, [isMaxYears, data])

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
          disableClearable
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
                  {Object.keys(locationOptions).length === 0 ? <CircularProgress color="secondary" size={20} /> : null}
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
          disableClearable
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
        <div className='flex flex-col sm:flex-row'>

          <TooltipMUI enterTouchDelay={0} leaveTouchDelay={5000} title={
            <>
              <div className='text-center'>Percentual do total geral</div>
              <span className='text-[0.65rem] text-center'>{dataInfo[dataOption].percentage && checkData(filteredData) ? "" : <><Cancel className='white' fontSize='small' /> | esse tipo de dado não suporta</>}</span>
            </>
          } placement='top'>
            <div className='flex flex-row items-center justify-center w-full sm:w-auto sm:flex-col max-w-[340px] space-x-2 sm:space-x-0'>
              <PercentBox style={{ color: dataInfo[dataOption].percentage && checkData(filteredData) ? 'white' : 'rgba(120, 120, 160, 0.7)' }} fontSize='medium' />
              <Checkbox
                disabled={!(dataInfo[dataOption].percentage && checkData(filteredData))}
                checked={isPercentage}
                onChange={handleChangeIsPercentage}
              />

            </div>
          </TooltipMUI>
          <TooltipMUI enterTouchDelay={0} leaveTouchDelay={5000}
            title={
              <>
                <div className='text-center'>Mostrar 1/4  dos dado</div>
                <span className='text-[0.65rem] text-center'>{checkMaxYears(dataOption) && checkData(filteredData) ? "" : <><Cancel className='white' fontSize='small' /> | há poucos dados</>}</span>
              </>
            } placement='top'>
            <div className='flex flex-row items-center justify-center w-full sm:w-auto sm:flex-col max-w-[340px] space-x-2 sm:space-x-0'>
              <DivisionBox style={{ color: checkMaxYears(dataOption) && checkData(filteredData) ? 'white' : 'rgba(120, 120, 160, 0.7)' }} fontSize='medium' />
              <Checkbox
                disabled={!(checkMaxYears(dataOption) && checkData(filteredData))}
                checked={isMaxYears}
                onChange={handleChangeIsMaxYear}
              />
            </div>
          </TooltipMUI>
          <TooltipMUI enterTouchDelay={0} leaveTouchDelay={5000} title={`${isContrast ? 'Diminuir contraste' : 'Aumentar contraste'}`} placement='top'>
            <div className='flex flex-row items-center justify-center w-full sm:w-auto sm:flex-col max-w-[340px] space-x-2 sm:space-x-0'>
              <StarFourPointsBox className='text-white' fontSize='medium' />
              <Checkbox
                className={`${isContrast ? 'bg-gradient-to-br from-green-300 via-purple-500 to-orange-600' : ''}`}
                checked={isContrast}
                onChange={handleChangeIsContrast}
              />
            </div>
          </TooltipMUI>
        </div>
      </div>
      {filteredData && checkData(filteredData) && (
        <>
          <div className='w-full flex flex-col text-xs sm:text-sm pt-3 sm:pt-0 max-w-screen-xl sm:-mb-8'>
            <p><CalendarBlank fontSize='small' /> Dados de <span style={{ color: theme.palette.primary.light }} className='font-semibold'>{filteredData.data[0].name}</span> até <span style={{ color: theme.palette.primary.light }} className='font-semibold'>{filteredData.data[filteredData.data.length - 1].name}</span></p>
            <p><Magnify fontSize='small' /> Números de resultados: {filteredData.data.length}</p>
            <p><MathCompass fontSize='small' /> Unidade de medida: {filteredData.unit.toLocaleLowerCase()}</p>
          </div>
          <div className='max-w-[1300px] grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center w-full sm:h-auto gap-4 grid-rows-2'>
            <div className='flex justify-center items-center flex-col max-h-[432px]'>
              <Line data={createChartData(filteredData, isContrast)} options={createOptions(filteredData, true, true)} />
            </div>
            <div className='flex justify-center items-center max-h-[432px]'>
              <Scatter data={createChartData(filteredData, isContrast, true)} options={createOptions(filteredData, true, true)} />
            </div>
            <div className='lg:col-span-2 lg:row-span-2 flex justify-center items-center max-h-[564px]'>
              <PolarArea data={createChartData(filteredData, isContrast)} options={createOptions(filteredData)} />
            </div>
            <div className='flex justify-center items-center col-span-1 lg:col-span-2 max-h-[432px]'>
              <Bar data={createChartData(filteredData, isContrast)} options={createOptions(filteredData, true, true)} />
            </div>
          </div>
          <div className='p-3 lg:p-0'>
            <p className='text-xs opacity-60 text-center'>{isBiggerThanLg
              ? <>Arraste o mouse por cima dos gráficos para mais informação <CursorDefaultOutline fontSize='small' /></>
              : <>Toque nos gráficos para mais informação <GestureTap fontSize='small' /></>} </p>
          </div>
        </>
      )}

      {filteredData === undefined && (
        <div className='fixed h-screen items-center flex'>
          <CircularProgress color='secondary' />
        </div>
      )}

      {(filteredData === null || filteredData && !checkData(filteredData)) && (
        <div className='h-[50vh] sm:h-[80vh] items-center justify-center flex flex-col space-y-4 text-center'>
          <p>{location === "" || location === null ? "Selecione uma localidade primeiro." : `Não foi encontrado esses dados do IBGE em ${location}`}</p>
          <MagnifyRemoveOutline fontSize='medium' />
        </div>
      )}
    </div>
  );
}

export default IBGEDataPage;