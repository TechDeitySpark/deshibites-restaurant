import React from 'react';

const QuickLoginTest: React.FC = () => {
  const handleQuickLogin = () => {
    // Manually set localStorage for admin login
    localStorage.setItem('auth_token', 'demo-token-' + Date.now());
    localStorage.setItem('user_role', 'admin');
    
    // Reload the page to trigger auth initialization
    window.location.reload();
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    window.location.reload();
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    alert(`Token: ${token}\nRole: ${role}`);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>Quick Auth Test:</strong></div>
      <button onClick={handleQuickLogin} style={{margin: '2px', padding: '5px', fontSize: '10px'}}>
        Quick Admin Login
      </button>
      <button onClick={clearAuth} style={{margin: '2px', padding: '5px', fontSize: '10px'}}>
        Clear Auth
      </button>
      <button onClick={checkLocalStorage} style={{margin: '2px', padding: '5px', fontSize: '10px'}}>
        Check Storage
      </button>
      <br />
      <a href="/test" style={{color: 'white', fontSize: '10px', display: 'block'}}>Test /test route</a>
      <a href="/admin-direct" style={{color: 'white', fontSize: '10px', display: 'block'}}>Test /admin-direct route</a>
      <a href="/admin" style={{color: 'white', fontSize: '10px', display: 'block'}}>Test /admin route</a>
    </div>
  );
};

export default QuickLoginTest;
