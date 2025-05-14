import React from 'react';
import { Card, Statistic } from 'antd';

const RealTimeStats = ({ users, offers, contracts }) => {
  return (
    <Card title="Statistiques Temps Réel">
      <Statistic title="Utilisateurs" value={users} />
      <Statistic title="Offres" value={offers} />
      <Statistic title="Contrats" value={contracts} />
    </Card>
  );
};

export default RealTimeStats;