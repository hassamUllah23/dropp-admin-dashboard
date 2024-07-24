'use client';
import React, { useState, useMemo } from 'react';
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

const BarChart = React.memo(
  ({ chartDataX, cData }) => {
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

    const options = useMemo(
      () => ({
        type: 'bar',
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
            ticks: {
              beginAtZero: true,
              stepSize: 1, // Ensure that ticks increment by 1
              callback: function (value) {
                return Number(value).toFixed(0); // Ensure only whole numbers are shown
              },
            },
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Registrations',
            },
          },
        },
      }),
      []
    );
    
    const chartData = useMemo(
      () => ({
        labels: ['Registrations', 'Activations', 'Wallet Connectins', 'Retween Count', 'Follow Twitter Count', 'Join Discord Count', 'Share Count', 'Panprama Image Count'],
        datasets: [
          {
            label: [],
            data: [
              cData?.newSignupsCount,
              cData?.newActivationsCount,
              cData?.connectedWalletCount,
              cData?.retweetCount,
              cData?.followTwitterCount,
              cData?.joinDiscordCount,
              (cData?.shareDiscordCount || 0) + (cData?.shareTwitterCount || 0),
              cData?.panoramaCount,
            ],
            backgroundColor: ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#F97316', '#6366F1', '#EC4899'],
            barPercentage: 0.85, // Increase the width of bars
            categoryPercentage: 1.0,
          },
        ],
      }),
      [cData]
    );

    return <Bar options={options} data={chartData} />;
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.cData) === JSON.stringify(nextProps.cData);
  }
);
export default BarChart;
