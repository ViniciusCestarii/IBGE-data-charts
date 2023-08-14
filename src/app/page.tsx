'use client'
import React, { useState, useEffect } from 'react';
import { getDadoIbgeByFullURL, dataReturn, createOptions, createChartData } from '../utils/ibgeAPI';
import { Bar, Doughnut, Line, PolarArea, Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { CircularProgress } from '@mui/material';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, BarElement, RadialLinearScale, ArcElement);

function IBGEDataPage() {
  const [leiteData, setLeiteData] = useState<dataReturn | null>(null);

  const leite = 'https://servicodados.ibge.gov.br/api/v3/agregados/915/periodos/201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/29?localidades=N3[42]';

  useEffect(() => {
    async function fetchData() {
      setLeiteData(await getDadoIbgeByFullURL(leite));
    }
    fetchData();
  }, []);

  return (
    <div className='h-full min-h-screen bg-slate-900 flex flex-col items-center'>
      <h1 className='text-4xl text-white font-bold mt-4'>IBGE Data</h1>

      {leiteData && (
        <div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center w-full sm:h-[80vh] gap-4 grid-rows-2 lg:pl-12'>
          <div className='flex justify-center items-center'>
            <Line data={createChartData(leiteData)} options={createOptions(leiteData, true, true)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='flex justify-center items-center'>
            <Bar data={createChartData(leiteData)} options={createOptions(leiteData, true, true)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='lg:col-span-2 lg:row-span-2 flex justify-center items-center'>
            <PolarArea data={createChartData(leiteData)} options={createOptions(leiteData, true)} style={{ width: '100%', height: '800px' }} />
          </div>
          <div className='flex justify-center items-center'>
            <Doughnut data={createChartData(leiteData)} options={createOptions(leiteData)} style={{ width: '100%', height: '500px' }} />
          </div>
          <div className='flex justify-center items-center col-span-1 sm:col-span-2 lg:col-span-1'>
            <Scatter data={createChartData(leiteData, true)} options={createOptions(leiteData, true)} style={{ width: '100%', height: '500px' }} />
          </div>
        </div>
      )}

      {leiteData === null && (
        <div className='fixed h-screen items-center flex'>
          <CircularProgress color='secondary' />
        </div>
      )}

    </div>
  );
}

export default IBGEDataPage;