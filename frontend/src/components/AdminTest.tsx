import React from 'react';

const AdminTest: React.FC = () => {
  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🎉 Admin Route is Working!</h1>
      <p>If you can see this page, the admin route is functioning correctly.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default AdminTest;
