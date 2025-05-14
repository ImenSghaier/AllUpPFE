// src/components/OffersChart.js
import React from 'react';
import { useChart } from '../../hooks/useChart';

const OffersChart = ({ offers, popularOffers }) => {
  const chartRef = useChart({
    type: 'bar',
    data: {
      labels: offers?.map(o => o.title) || [],
      datasets: [{
        label: 'Offres récentes',
        data: offers?.map(o => o.views || 0) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
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

export default OffersChart;