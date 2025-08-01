import React from 'react';

interface HeroProps {
  onOrderNow?: () => void;
  onViewMenu?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOrderNow, onViewMenu }) => {
  const handleOrderNow = () => {
    if (onOrderNow) {
      onOrderNow();
    } else {
      // Scroll to menu section
      const menuSection = document.querySelector('.menu-nav');
      menuSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMenu = () => {
    if (onViewMenu) {
      onViewMenu();
    } else {
      // Scroll to menu section
      const menuSection = document.querySelector('.menu-nav');
      menuSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <img 
          src="/assets/images/hero-banner.svg" 
          alt="Delicious Asian Street Food" 
          className="hero-image"
          onError={(e) => {
            // Try JPG fallback first, then hide if that fails too
            const target = e.currentTarget;
            if (target.src.includes('.svg')) {
              target.src = '/assets/images/hero-banner.jpg';
            } else {
              target.style.display = 'none';
            }
          }}
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h2>Authentic Asian<br /><span className="highlight">Street Food</span></h2>
        <p>Experience the vibrant flavors of Asia, delivered fresh to your door. From steaming momos to crispy fritters, every bite tells a story.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleOrderNow}>
            🛒 Order Now
          </button>
          <button className="btn-secondary" onClick={handleViewMenu}>
            📋 View Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
