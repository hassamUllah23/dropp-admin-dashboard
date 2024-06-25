import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ chartDataX, cData }) {
  // const [chartData, setChartData] = useState(chartDataX)
  const data = {
    // labels: chartDataX.map((element) => element.label),
    datasets: [
      {
        label: 'Total Registerations',
        data: [0, cData?.newSignupsCount, 0],
        backgroundColor: ['rgba(0, 0, 0, 0)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(0, 0, 0, 0)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
      {
        label: 'Total Activation',
        data: [
          cData?.newSignupsCount - cData?.newActivationsCount,
          cData?.newActivationsCount,
          0,
        ],
        backgroundColor: ['#AAA', '#777'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(0, 0, 0, 0)'],
        borderWidth: 1,
      },
      {
        label: 'Users with Wallet Connectins',
        data: [
          cData?.newSignupsCount - cData?.connectedWalletCount,
          cData?.connectedWalletCount,
          0,
        ],
        backgroundColor: ['rgba(255, 206, 86, 0.2)', 'hsl(100, 100%, 60%)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(0, 0, 0, 0)'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Pie
      data={data}
      options={{
        responsive: true,
        plugins: {
          tooltip: {
            filter: function (tooltipItem) {
              // Show tooltip only for the main section of each series
              return tooltipItem.dataIndex === 1;
            },
          },
          legend: {
            display: true,
          },
        },
      }}
    />
  );
}
