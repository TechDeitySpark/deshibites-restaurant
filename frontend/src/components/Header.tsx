import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onCartClick?: () => void;
  cartItemCount?: number;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false, 
  onCartClick,
  cartItemCount = 0,
  onLoginClick,
  onRegisterClick
}) => {
  const { state, logout } = useAuth();
  const [logoSrc, setLogoSrc] = useState('/assets/images/logo.png');

  // You can fetch restaurant settings here if needed
  useEffect(() => {
    // For now, use the default logo path
    // Later, you can fetch from your settings API
    const fetchLogo = async () => {
      try {
        // Example: const settings = await fetch('/api/restaurant-settings');
        // const data = await settings.json();
        // setLogoSrc(data.logo);
      } catch (error) {
        console.log('Using default logo');
      }
    };
    fetchLogo();
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">
          <img 
            src={logoSrc} 
            alt="DeshiBites Logo" 
            className="logo-image"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
            onError={() => {
              // Fallback to emoji if image fails to load
              setLogoSrc('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><text y="32" font-size="32">🍜</text></svg>');
            }}
          />
        </div>
        <div className="logo-text">
          <h1>Deshi Bites</h1>
          <p>Asian Street Food</p>
        </div>
      </div>
      <div className="header-info">
        <div>📞 Order Hotline</div>
        <div className="header-location">
          <span>📍 Chemnitz, Germany</span>
          {showMenuButton && (
            <button className="menu-button" onClick={onMenuClick}>
              🍽️ Menu
            </button>
          )}
        </div>
        
        {/* Authentication Section */}
        <div className="header-auth">
          {state.isAuthenticated ? (
            <div className="user-menu">
              <span className="welcome-text">👋 Hi, {state.user?.name}</span>
              
              {/* Dashboard link for admin and manager */}
              {(state.user?.role === 'admin' || state.user?.role === 'manager') && (
                <a 
                  href="/admin" 
                  className="dashboard-link"
                  style={{
                    marginLeft: '10px',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📊 Dashboard
                </a>
              )}
              
              <button className="logout-btn" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-btn" onClick={onLoginClick}>
                👤 Login
              </button>
              <button className="register-btn" onClick={onRegisterClick}>
                📝 Register
              </button>
            </div>
          )}
        </div>

        <div className="header-cart" onClick={onCartClick}>
          <span className="cart-icon">🛒</span>
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
