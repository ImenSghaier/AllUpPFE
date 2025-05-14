import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, notification } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined,
  TeamOutlined,
  RiseOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { fetchStats } from '../../services/api';
import { socketService } from '../../services/socket';
import { useSocket } from '../../hooks/useSocket';
import StatCard from './StatCard';
import UsersChart from './UsersChart';
import OffersChart from './OffersChart';
import ContractsChart from './ContractsChart';
import RecentActivity from './RecentActivity';
import RealTimeStats from './RealTimeStats';
import './dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    summary: {
      users: 0,
      offers: 0,
      contracts: 0
    },
    users: {
      recentUsers: [],
      activeUsers: 0,
      newUsers: 0
    },
    offers: {
      recentOffers: [],
      activeOffers: 0,
      popularOffers: []
    },
    contracts: {
      recentContracts: [],
      activeContracts: 0,
      expiringSoon: []
    }
  });

  // Récupération initiale des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
        setLoading(false);
        
        // Connexion WebSocket après chargement initial
        const token = localStorage.getItem('token');
        if (token) {
          socketService.connect(token);
        }
      } catch (error) {
        notification.error({
          message: 'Erreur',
          description: 'Impossible de charger les données du tableau de bord'
        });
        setLoading(false);
      }
    };

    loadData();

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Abonnement aux mises à jour en temps réel
  useSocket('statsUpdate', (realTimeData) => {
    setStats(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        users: realTimeData.users,
        offers: realTimeData.offers,
        contracts: realTimeData.conventions
      },
      users: {
        ...prev.users,
        recentUsers: realTimeData.recentUsers
      }
    }));
  });

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Tableau de Bord Administrateur</h1>
      <p className="dashboard-subtitle">Statistiques et activités en temps réel</p>
      
      {/* Cartes de statistiques */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard 
            icon={<UserOutlined />}
            title="Utilisateurs"
            value={stats.summary.users}
            color="#1890ff"
            trend={stats.users.newUsers}
            trendText="nouveaux (7j)"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard 
            icon={<ShoppingOutlined />}
            title="Offres"
            value={stats.summary.offers}
            color="#52c41a"
            trend={stats.offers.activeOffers}
            trendText="actives"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard 
            icon={<FileTextOutlined />}
            title="Contrats"
            value={stats.summary.contracts}
            color="#722ed1"
            trend={stats.contracts.activeContracts}
            trendText="actifs"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <StatCard 
            icon={<TeamOutlined />}
            title="Utilisateurs Actifs"
            value={stats.users.activeUsers}
            color="#faad14"
            trend={stats.users.activeUsers / stats.summary.users * 100}
            trendText="% d'activité"
          />
        </Col>
      </Row>
      
      {/* Graphiques */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={12}>
          <div className="chart-card">
            <h3><RiseOutlined /> Évolution des Utilisateurs</h3>
            <UsersChart users={stats.users.recentUsers} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-card">
            <h3><BarChartOutlined /> Statistiques des Offres</h3>
            <OffersChart 
              offers={stats.offers.recentOffers} 
              popularOffers={stats.offers.popularOffers} 
            />
          </div>
        </Col>
      </Row>
      
      {/* Activités récentes et stats temps réel */}
      <Row gutter={[16, 16]} className="activity-row">
        <Col xs={24} lg={12}>
          <RecentActivity 
            users={stats.users.recentUsers} 
            contracts={stats.contracts.recentContracts} 
          />
        </Col>
        <Col xs={24} lg={12}>
          <RealTimeStats 
            users={stats.summary.users} 
            offers={stats.summary.offers} 
            contracts={stats.summary.contracts} 
          />
        </Col>
      </Row>
      
      {/* Graphique des contrats */}
      <Row gutter={[16, 16]} className="contracts-row">
        <Col xs={24}>
          <div className="chart-card">
            <h3><FileTextOutlined /> État des Contrats</h3>
            <ContractsChart 
              contracts={stats.contracts.recentContracts} 
              expiringSoon={stats.contracts.expiringSoon} 
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spin } from 'antd';
// import { UserOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
// import StatCard from './StatCard';
// import UsersChart from './UsersChart';
// import OffersChart from './OffersChart';
// import RealTimeStats from './RealTimeStats';

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: 0,
//     offers: 0,
//     contracts: 0,
//     recentUsers: []
//   });

//   useEffect(() => {
//     // Simulation de chargement de données
//     setTimeout(() => {
//       setStats({
//         users: 125,
//         offers: 42,
//         contracts: 78,
//         recentUsers: Array(5).fill().map((_, i) => ({
//           id: i,
//           name: `User ${i}`,
//           createdAt: new Date(Date.now() - i * 86400000)
//         }))
//       });
//       setLoading(false);
//     }, 1000);
//   }, []);

//   if (loading) return <Spin size="large" />;

//   return (
//     <div className="admin-dashboard">
//       <h1>Tableau de Bord</h1>
      
//       <Row gutter={16}>
//         <Col span={8}>
//           <StatCard icon={<UserOutlined />} title="Utilisateurs" value={stats.users} />
//         </Col>
//         <Col span={8}>
//           <StatCard icon={<ShoppingOutlined />} title="Offres" value={stats.offers} />
//         </Col>
//         <Col span={8}>
//           <StatCard icon={<FileTextOutlined />} title="Contrats" value={stats.contracts} />
//         </Col>
//       </Row>

//       <Row gutter={16} style={{ marginTop: 20 }}>
//         <Col span={12}>
//           <Card title="Utilisateurs récents">
//             <UsersChart users={stats.recentUsers} />
//           </Card>
//         </Col>
//         <Col span={12}>
//           <RealTimeStats {...stats} />
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;