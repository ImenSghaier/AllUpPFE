import React from 'react';
import { List, Avatar, Tag, Card } from 'antd';
import { 
  UserAddOutlined, 
  FileAddOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const RecentActivity = ({ users, contracts }) => {
  // Combiner les activités récentes
  const recentActivities = [
    ...(users?.map(user => ({
      type: 'user',
      ...user
    })) || []),
    ...(contracts?.map(contract => ({
      type: 'contract',
      ...contract
    })) || [])
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
   .slice(0, 8);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return <UserAddOutlined style={{ color: '#1890ff' }} />;
      case 'contract':
        return <FileAddOutlined style={{ color: '#722ed1' }} />;
      default:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const getActivityDescription = (item) => {
    if (item.type === 'user') {
      return (
        <>
          <strong>{item.nom} {item.prenom}</strong> a rejoint la plateforme
          <Tag color="blue" style={{ marginLeft: 8 }}>{item.role}</Tag>
        </>
      );
    } else if (item.type === 'contract') {
      return (
        <>
          Nouveau contrat <strong>{item.reference}</strong> créé
          <Tag color="purple" style={{ marginLeft: 8 }}>
            {item.status}
          </Tag>
        </>
      );
    }
    return '';
  };

  return (
    <Card 
      title={
        <>
          <ClockCircleOutlined /> Activité Récente
        </>
      }
      className="activity-card"
    >
      <List
        itemLayout="horizontal"
        dataSource={recentActivities}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={getActivityIcon(item.type)} 
                  style={{ backgroundColor: 'transparent' }} 
                />
              }
              title={getActivityDescription(item)}
              description={moment(item.createdAt).fromNow()}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;