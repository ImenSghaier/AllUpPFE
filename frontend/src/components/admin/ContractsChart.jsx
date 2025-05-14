// src/components/ContractsChart.js
import React from 'react';
import { useChart } from '../../hooks/useChart';

const ContractsChart = ({ contracts, expiringSoon }) => {
  const chartRef = useChart({
    type: 'bar',
    data: {
      labels: contracts?.map(c => c.reference) || [],
      datasets: [{
        label: 'Contrats récents',
        data: contracts?.map(c => c.value || 0) || [],
        backgroundColor: 'rgba(114, 46, 209, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return <canvas ref={chartRef} />;
};

export default ContractsChart;