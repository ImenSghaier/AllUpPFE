// components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import statisticsService from '../services/statisticsService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token'); // Ou depuis Redux
      const data = await statisticsService.getStatistics(token);
      setStats(data);
    };

    fetchStats();

    // Actualisation toutes les 10 secondes
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div className="dashboard">
      <h2>Tableau de bord Administrateur</h2>
      <div className="stats-grid">
        <div className="card">👥 Utilisateurs : {stats.users}</div>
        <div className="card">💼 Offres : {stats.offres}</div>
        <div className="card">📑 Conventions : {stats.contrats}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
