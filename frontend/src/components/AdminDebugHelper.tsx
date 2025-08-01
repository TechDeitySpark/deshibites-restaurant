import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDebugHelper: React.FC = () => {
  const { state, login } = useAuth();

  const quickLogin = async () => {
    try {
      await login('admin@deshibites.com', 'admin123');
      alert('Logged in as admin! Now try /admin route');
    } catch (error) {
      alert('Login failed: ' + error);
    }
  };

  const testAdminRoute = () => {
    window.location.href = '/admin';
  };

  const testAdminDirect = () => {
    window.location.href = '/admin-test';
  };

  const checkAuth = () => {
    alert(`
      Authenticated: ${state.isAuthenticated}
      User: ${state.user?.name || 'none'}
      Role: ${state.user?.role || 'none'}
      Email: ${state.user?.email || 'none'}
    `);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Admin Debug Helper</div>
      
      <div style={{ marginBottom: '5px' }}>
        Auth: {state.isAuthenticated ? '✅' : '❌'} | Role: {state.user?.role || 'none'}
      </div>
      
      <button 
        onClick={quickLogin} 
        style={{ 
          margin: '3px', 
          padding: '8px 12px', 
          fontSize: '11px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'block',
          width: '100%'
        }}
      >
        🔑 Quick Admin Login
      </button>
      
      <button 
        onClick={testAdminRoute} 
        style={{ 
          margin: '3px', 
          padding: '8px 12px', 
          fontSize: '11px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'block',
          width: '100%'
        }}
      >
        🚀 Test /admin (Protected)
      </button>
      
      <button 
        onClick={testAdminDirect} 
        style={{ 
          margin: '3px', 
          padding: '8px 12px', 
          fontSize: '11px',
          background: '#ffc107',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'block',
          width: '100%'
        }}
      >
        🔧 Test /admin-test (Direct)
      </button>
      
      <button 
        onClick={checkAuth} 
        style={{ 
          margin: '3px', 
          padding: '8px 12px', 
          fontSize: '11px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'block',
          width: '100%'
        }}
      >
        🔍 Check Auth Status
      </button>
    </div>
  );
};

export default AdminDebugHelper;
