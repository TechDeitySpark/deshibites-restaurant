import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SidebarProps, AdminSection } from '../types';

const AdminSidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobileOpen,
  onMobileToggle
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ðŸ“Š', description: 'Overview & Analytics' },
    { id: 'menu', label: 'Menu Management', icon: 'ðŸ½ï¸', description: 'Manage Food Items' },
    { id: 'orders', label: 'Orders', icon: 'ðŸ“‹', description: 'Order Processing' },
    { id: 'customers', label: 'Customers', icon: 'ðŸ‘¥', description: 'Customer Database' },
    { id: 'analytics', label: 'Analytics', icon: 'ðŸ“ˆ', description: 'Reports & Insights' },
    { id: 'settings', label: 'Settings', icon: 'âš™ï¸', description: 'System Settings' },
    { id: 'Landing', label: 'Landing', icon: 'ðŸŒ', description: 'Go to Main Website' }
  ];

  const authItems = [
    { id: 'profile', label: 'My Profile', icon: 'ðŸ‘¤', description: 'Account Settings' },
    { id: 'security', label: 'Security', icon: 'ðŸ”’', description: 'Password & Security' },
    { id: 'logout', label: 'Logout', icon: 'ðŸšª', description: 'Sign Out' }
  ];

  const handleAuthAction = (action: string) => {
    if (action === 'logout') {
      handleLogout();
    } else if (action === 'profile') {
      onSectionChange('settings' as AdminSection);
    } else if (action === 'security') {
      onSectionChange('settings' as AdminSection);
    }
    onMobileToggle();
  };

  return (
    <div className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : 'mobile-hidden'}`}>
      <div className="admin-sidebar-header">
        <h3>
          <span>ðŸ›</span>
          Deshi Bites
        </h3>
        <div className="subtitle">Admin Dashboard</div>
      </div>
      
      {/* User Profile Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #ff8c42'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format" 
              alt="Admin User"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>John Doe</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Administrator</div>
            <div style={{ 
              fontSize: '11px', 
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px'
            }}>
              <span style={{ color: '#10b981' }}>â—</span> Online
            </div>
          </div>
        </div>
      </div>
      
      <nav>
        <ul className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button type="button" className={activeSection === item.id ? 'active' : ''}
                onClick={() => {
                  onSectionChange(item.id as AdminSection);
                  onMobileToggle();
                }}
                title={item.description} style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", padding: "0", display: "flex", alignItems: "center" }}>
                <span className="icon">{item.icon}</span>
                <div>
                  <div>{item.label}</div>
                  {item.description && (
                    <small style={{ 
                      fontSize: '11px', 
                      opacity: 0.7, 
                      display: 'block',
                      marginTop: '2px',
                      color: activeSection === item.id ? 'rgba(255,255,255,0.8)' : '#94a3b8'
                    }}>
                      {item.description}
                    </small>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div style={{ 
          margin: '20px', 
          padding: '15px 0', 
          borderTop: '1px solid #e2e8f0' 
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#64748b', 
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingLeft: '20px'
          }}>
            Account
          </div>
          <ul className="admin-sidebar-nav" style={{ padding: '0' }}>
            {authItems.map((item) => (
              <li key={item.id}>
                <button type="button" className={item.id === 'logout' ? 'logout-item' : ''}
                  onClick={() => handleAuthAction(item.id)}
                  title={item.description}
                  style={{
                    color: item.id === 'logout' ? '#ef4444' : undefined,
                    fontWeight: item.id === 'logout' ? '600' : undefined
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <div>
                    <div>{item.label}</div>
                    {item.description && (
                      <small style={{ 
                        fontSize: '11px', 
                        opacity: 0.7, 
                        display: 'block',
                        marginTop: '2px',
                        color: '#94a3b8'
                      }}>
                        {item.description}
                      </small>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export { AdminSidebar };
export default AdminSidebar;
export {};

