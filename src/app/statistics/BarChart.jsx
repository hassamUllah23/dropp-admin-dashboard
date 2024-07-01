'use client';
import React, { useState } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//ChartJS.register(ArcElement, Tooltip, Legend);

export function BarChart({ chartDataX, cData }) {
  // // const [chartData, setChartData] = useState(chartDataX)
  // const data = {
  //   // labels: chartDataX.map((element) => element.label),
  //   datasets: [
  //     // {
  //     //   label: 'Total Registerations',
  //     //   data: [0, cData?.newSignupsCount, 0],
  //     //   backgroundColor: ['rgba(0, 0, 0, 0)', '#14C7FF'],
  //     //   borderColor: ['rgba(0, 0, 0, 0)', '#000'],
  //     //   borderWidth: 1,
  //     // },
  //     {
  //       label: 'Total Activation',
  //       data: [
  //         cData?.newSignupsCount - cData?.newActivationsCount,
  //         cData?.newActivationsCount,
  //         0,
  //       ],
  //       backgroundColor: ['#000', '#67C24B'],
  //       borderColor: ['#000', 'rgba(0, 0, 0, 0)'],
  //       borderWidth: 1,
  //     },
  //     {
  //       label: 'Users with Wallet Connections',
  //       data: [
  //         cData?.newSignupsCount - cData?.connectedWalletCount,
  //         cData?.connectedWalletCount,
  //         0,
  //       ],
  //       backgroundColor: ['#000', '#FFCE53'],
  //       borderColor: ['#000', 'rgba(0, 0, 0, 0)'],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const options = {
    responsive: true,
    plugins: {
      legend: false,
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          display: false, // Hide x-axis labels
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Registrations',
        },
        ticks: {
          display: true,
          callback: function (value) {
            return value;
          },
        },
        suggestedMax: cData?.newSignupsCount,
      },
    },
  };
  const data = [10, 20];
  const chartData = {
    labels: ['Activations', 'Wallet Connectins'],
    datasets: [
      {
        label: 'Activations',
        data: [cData?.newActivationsCount],
        backgroundColor: '#67C24B',
      },
      {
        label: 'Wallet Connectins',
        data: [cData?.connectedWalletCount],
        backgroundColor: '#FFCE53',
      },
      {
        label: 'Registrations',
        data: [cData?.newSignupsCount],
        backgroundColor: '#14C7FF',
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}
