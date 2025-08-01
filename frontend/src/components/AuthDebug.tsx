import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug: React.FC = () => {
  const { state } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>Auth Debug:</strong></div>
      <div>Authenticated: {state.isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {state.user ? state.user.name : 'None'}</div>
      <div>Role: {state.user ? state.user.role : 'None'}</div>
      <div>Email: {state.user ? state.user.email : 'None'}</div>
      <div>Loading: {state.isLoading ? 'Yes' : 'No'}</div>
      <div>Error: {state.error || 'None'}</div>
      <div>Token: {localStorage.getItem('auth_token') || 'None'}</div>
      <div>User Role: {localStorage.getItem('user_role') || 'None'}</div>
    </div>
  );
};

export default AuthDebug;
