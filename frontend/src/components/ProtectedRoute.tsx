import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'user')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin'] 
}) => {
  const { state } = useAuth();

  // Check if user is authenticated
  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(state.user.role)) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>🚫 Access Denied</h1>
        <p>You don't have permission to access this area.</p>
        <p>Required role: {allowedRoles.join(' or ')}</p>
        <p>Your role: {state.user.role}</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid white',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
