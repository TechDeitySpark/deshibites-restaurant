import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HeaderProps } from '../types';

const AdminHeader: React.FC<HeaderProps> = ({
  activeSection,
  onMobileToggle,
  onAction
}) => {
  const { state } = useAuth();

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action);
    }
  };

  const handleMobileToggle = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      menu: 'Menu Management',
      orders: 'Orders',
      customers: 'Customers',
      analytics: 'Analytics',
      settings: 'Settings'
    };
    return titles[section] || 'Dashboard';
  };

  const getSectionIcon = (section: string) => {
    const icons: Record<string, string> = {
      dashboard: '📊',
      menu: '🍽️',
      orders: '📝',
      customers: '👥',
      analytics: '📈',
      settings: '⚙️'
    };
    return icons[section] || '📊';
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button 
          className="mobile-menu-button" 
          onClick={handleMobileToggle}
          title="Toggle Sidebar"
        >
          <div className="hamburger-icon">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </button>
        <h1 className="admin-header-title">
          <span>{getSectionIcon(activeSection)}</span>
          {getSectionTitle(activeSection)}
        </h1>
      </div>
      
      <div className="admin-header-actions">
        {activeSection === 'menu' && (
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => handleAction('add-item')}
          >
            <span>➕</span>
            Add New Item
          </button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
