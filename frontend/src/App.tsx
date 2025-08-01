import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './hooks/useI18n';
import Header from './components/Header';
import DeliveryNotice from './components/DeliveryNotice';
import Hero from './components/Hero';
import MenuNav from './components/MenuNav';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import CheckoutPage from './components/CheckoutPage';
import FloatingCart from './components/FloatingCart';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminDashboard } from './admin';

const AppContent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [currentPage, setCurrentPage] = useState<'menu' | 'checkout'>('menu');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { toggleCart, getTotalItems } = useCart();

  const handleCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const handleCartClick = () => {
    toggleCart();
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="App">
      <Header 
        onMenuClick={handleBackToMenu}
        showMenuButton={currentPage === 'checkout'}
        onCartClick={handleCartClick}
        cartItemCount={getTotalItems()}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <DeliveryNotice />
      {currentPage === 'menu' ? (
        <>
          <Hero />
          <MenuNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <MenuGrid activeCategory={activeCategory} />
          <CartSidebar onCheckout={handleCheckout} />
          <FloatingCart />
        </>
      ) : (
        <CheckoutPage onBack={handleBackToMenu} />
      )}
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />
    </div>
  );
};

function App() {
  return (
    <I18nProvider defaultLanguage="en">
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
