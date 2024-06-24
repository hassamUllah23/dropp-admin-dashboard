import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ chartDataX }) {
  // const [chartData, setChartData] = useState(chartDataX)
  const data = {
    labels: chartDataX.map((element) => element.label),
    datasets: [
      {
        // label: 'Count',
        data: chartDataX.map((element) => element.value),
        backgroundColor: chartDataX.map((element) => element.backgroundColor),
        borderColor: chartDataX.map((element) => element.borderColor),
        borderWidth: 1,
      },
    ],
  };
  return (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 20,
              },
            },
          },
        },
      }}
    />
  );
}
