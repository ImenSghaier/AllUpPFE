// src/hooks/useChart.js
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export const useChart = (config) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique existant avant d'en créer un nouveau
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Créer le nouveau graphique
      chartInstance.current = new Chart(chartRef.current, config);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [config]);

  return chartRef;
};