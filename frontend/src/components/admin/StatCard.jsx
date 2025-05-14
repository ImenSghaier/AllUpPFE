import React from 'react';
import { Card, Statistic, Tag } from 'antd';

const StatCard = ({ icon, title, value, color, trend, trendText }) => {
  const getTrendColor = () => {
    if (title.includes('Utilisateurs')) return 'blue';
    if (title.includes('Offres')) return 'green';
    if (title.includes('Contrats')) return 'purple';
    return 'gold';
  };

  return (
    <Card className="stat-card" hoverable>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color }}
      />
      {trend !== undefined && (
        <div className="trend-container">
          <Tag color={getTrendColor()}>
            {typeof trend === 'number' && trendText.includes('%') 
              ? `${trend.toFixed(1)}%` 
              : trend}
          </Tag>
          <span className="trend-text">{trendText}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;