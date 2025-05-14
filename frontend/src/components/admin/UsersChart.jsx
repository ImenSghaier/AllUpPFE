import React from 'react';
import { Row, Col, Card, Spin, Empty } from 'antd';
import { useChart } from '../../hooks/useChart';

const UsersChart = ({ users, loading }) => {
  // Préparation des données avec formatage amélioré
  const prepareChartData = () => {
    if (!users || users.length === 0) return null;

    const sortedUsers = [...users].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Données pour le graphique linéaire
    const lineChartData = {
      labels: sortedUsers.map(user => 
        new Date(user.createdAt).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short',
          year: '2-digit'
        })
      ),
      counts: sortedUsers.map((_, index) => index + 1)
    };

    // Données pour le graphique en donut (répartition par rôle)
    const roleDistribution = sortedUsers.reduce((acc, user) => {
      const roleName = user.role || 'Non spécifié';
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {});

    return { lineChartData, roleDistribution };
  };

  const chartData = prepareChartData();

  // Configuration commune des graphiques
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
              return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  // Graphique linéaire
  const lineChartRef = useChart({
    type: 'line',
    data: {
      labels: chartData?.lineChartData?.labels || [],
      datasets: [{
        label: 'Nouveaux Utilisateurs',
        data: chartData?.lineChartData?.counts || [],
        borderColor: 'rgba(24, 144, 255, 0.8)',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(24, 144, 255, 1)',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      ...commonChartOptions,
      plugins: {
        ...commonChartOptions.plugins,
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Évolution des inscriptions',
          font: {
            size: 14
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          },
          title: {
            display: true,
            text: "Nombre d'utilisateurs"
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });

  // Graphique en donut
  const doughnutChartRef = useChart({
    type: 'doughnut',
    data: {
      labels: chartData ? Object.keys(chartData.roleDistribution) : [],
      datasets: [{
        label: 'Répartition par rôle',
        data: chartData ? Object.values(chartData.roleDistribution) : [],
        backgroundColor: [
          'rgba(24, 144, 255, 0.7)',
          'rgba(82, 196, 26, 0.7)',
          'rgba(250, 173, 20, 0.7)',
          'rgba(114, 46, 209, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderWidth: 1,
        hoverOffset: 10
      }]
    },
    options: {
      ...commonChartOptions,
      plugins: {
        ...commonChartOptions.plugins,
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Répartition par rôle',
          font: {
            size: 14
          }
        }
      },
      cutout: '65%'
    }
  });

  // Gestion des états vides et du chargement
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card title="Évolution des Utilisateurs">
        <Empty description="Aucune donnée utilisateur disponible" />
      </Card>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={16}>
        <Card 
          bodyStyle={{ height: '400px' }}
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            <canvas ref={lineChartRef} />
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card 
          bodyStyle={{ height: '400px' }}
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            <canvas ref={doughnutChartRef} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default UsersChart;