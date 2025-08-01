import React from 'react';
import { DashboardStats } from '../types';

interface StatCardData {
  title: string;
  value: string | number;
  className: string;
  icon: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

interface StatsGridProps {
  stats?: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats: providedStats }) => {
  const stats: StatCardData[] = [
    {
      title: 'Total Revenue',
      value: '৳2,45,890',
      className: 'revenue',
      icon: '💰',
      trend: '+12.5%',
      trendDirection: 'up'
    },
    {
      title: 'Total Orders',
      value: '1,247',
      className: 'orders',
      icon: '📋',
      trend: '+8.2%',
      trendDirection: 'up'
    },
    {
      title: 'Menu Items',
      value: '45',
      className: 'items',
      icon: '🍽️',
      trend: '+3.1%',
      trendDirection: 'up'
    },
    {
      title: 'Active Customers',
      value: '892',
      className: 'customers',
      icon: '👥',
      trend: '+15.7%',
      trendDirection: 'up'
    }
  ];

  return (
    <div className="admin-stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`admin-stat-card ${stat.className}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ fontSize: '32px' }}>{stat.icon}</div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: stat.trendDirection === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: stat.trendDirection === 'up' ? '#10b981' : '#ef4444',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <span>{stat.trendDirection === 'up' ? '↗️' : '↘️'}</span>
              {stat.trend}
            </div>
          </div>
          <h3>{stat.value}</h3>
          <p>{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
