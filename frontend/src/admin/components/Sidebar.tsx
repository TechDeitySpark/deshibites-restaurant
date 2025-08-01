import React from 'react';
import { SidebarProps, AdminSection } from '../types';

// AdminSidebar component with Landing page navigation
const AdminSidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobileOpen,
  onMobileToggle
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'menu', label: 'Menu Management', icon: '🍽️' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'Landing', label: 'Landing', icon: '🌐' }
  ];

  return (
    <div className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : 'mobile-hidden'}`}>
      <div className="admin-sidebar-header">
        <h3>
          <span>🍛</span>
          Deshi Bites
        </h3>
        <div className="subtitle">Admin Dashboard</div>
      </div>
      
      <nav>
        <ul className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => {
                  onSectionChange(item.id as AdminSection);
                  onMobileToggle();
                }}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
