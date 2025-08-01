import React, { useState } from 'react';
import '../styles/AdminDashboard.css';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import SettingsManagement from './SettingsManagement';
import StatsGrid from './StatsGrid';
import { AdminSection } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with sidebar closed
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="admin-content-wrapper">
            <StatsGrid />
            <div className="admin-section-content">
              <h3>📊 Dashboard Overview</h3>
              <p>Analytics and overview charts will be implemented here</p>
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="admin-content-wrapper">
            <StatsGrid />
            <MenuManagement />
          </div>
        );
      case 'orders':
        return (
          <div className="admin-content-wrapper">
            <OrderManagement />
          </div>
        );
      case 'customers':
        return (
          <div className="admin-content-wrapper">
            <CustomerManagement />
          </div>
        );
      case 'analytics':
        return (
          <div className="admin-content-wrapper">
            <div className="admin-section-content">
              <h3>📈 Analytics & Reports</h3>
              <p>Analytics dashboard and reports will be implemented here</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-content-wrapper">
            <SettingsManagement onAction={handleAction} />
          </div>
        );
      case 'Landing':
        // Redirect to main website
        window.location.href = '/';
        return (
          <div className="admin-content-wrapper">
            <div className="admin-section-content">
              <h3>🌐 Redirecting to Landing Page...</h3>
              <p>Taking you back to the main website</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="admin-content-wrapper">
            <StatsGrid />
            <div className="admin-section-content">
              <h3>📊 Dashboard Overview</h3>
              <p>Analytics and overview charts will be implemented here</p>
            </div>
          </div>
        );
    }
  };

  const handleAction = (action: string) => {
    if (action === 'add-item' && activeSection === 'menu') {
      // This will be handled by MenuManagement component
      console.log('Add item action triggered');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile' : 'desktop'}`}>
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileOpen={sidebarOpen}
        onMobileToggle={() => setSidebarOpen(false)}
      />
      
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="admin-main-content">
        <AdminHeader 
          activeSection={activeSection}
          onMobileToggle={toggleSidebar}
          onAction={handleAction}
        />
        <div className="admin-content-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
