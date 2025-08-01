// Logo Change Guide Component for DeshiBites Settings
import React, { useState } from 'react';

interface LogoChangeGuideProps {
  onClose: () => void;
}

export const LogoChangeGuide: React.FC<LogoChangeGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      title: "Step 1: Navigate to Settings",
      content: "Go to the Admin Dashboard and click on 'Settings' in the sidebar menu.",
      image: "🏪",
      tip: "Make sure you're logged in as an admin or manager."
    },
    {
      title: "Step 2: Open Branding Tab",
      content: "In the Settings page, click on the 'Branding' tab (🎨) to access visual identity options.",
      image: "🎨",
      tip: "This tab contains all your visual branding elements."
    },
    {
      title: "Step 3: Change Logo",
      content: "Find the 'Logo' section and click the 'Change Logo' button below the current logo image.",
      image: "📁",
      tip: "You can see a preview of your current logo before changing it."
    },
    {
      title: "Step 4: Upload New Logo",
      content: "In the upload modal, either click to select a file or drag and drop your new logo image.",
      image: "⬆️",
      tip: "Best results with square images (1:1 ratio), 512x512px, PNG format with transparent background."
    },
    {
      title: "Step 5: Save Changes",
      content: "After uploading, click 'Save Settings' at the top right to apply your new logo across the site.",
      image: "💾",
      tip: "Your new logo will appear immediately in the admin dashboard and customer-facing pages."
    }
  ];

  return (
    <div className="logo-guide-modal">
      <div className="guide-content">
        <div className="guide-header">
          <h3>🖼️ How to Change Your Restaurant Logo</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="guide-body">
          <div className="steps-indicator">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`step-dot ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index + 1)}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
            ))}
          </div>

          <div className="current-step">
            <div className="step-icon">{steps[currentStep - 1].image}</div>
            <h4>{steps[currentStep - 1].title}</h4>
            <p>{steps[currentStep - 1].content}</p>
            <div className="step-tip">
              <strong>💡 Tip:</strong> {steps[currentStep - 1].tip}
            </div>
          </div>

          <div className="step-navigation">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              ← Previous
            </button>
            <span className="step-counter">{currentStep} of {steps.length}</span>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
            >
              Next →
            </button>
          </div>

          {currentStep === steps.length && (
            <div className="guide-completion">
              <div className="completion-message">
                <h4>🎉 You're all set!</h4>
                <p>You now know how to change your restaurant logo. Remember to use high-quality images for the best results.</p>
              </div>
              <div className="quick-specs">
                <h5>📏 Quick Logo Specifications:</h5>
                <ul>
                  <li><strong>Format:</strong> PNG (transparent background) or JPG</li>
                  <li><strong>Size:</strong> 512x512px (square) recommended</li>
                  <li><strong>Max file size:</strong> 5MB</li>
                  <li><strong>Style:</strong> Simple, clear, works at small sizes</li>
                </ul>
              </div>
              <button className="btn btn-primary" onClick={onClose}>
                Got it! Close Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick access help button component
export const LogoHelpButton: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <button 
        className="help-btn"
        onClick={() => setShowGuide(true)}
        title="How to change logo"
      >
        ❓
      </button>
      {showGuide && <LogoChangeGuide onClose={() => setShowGuide(false)} />}
    </>
  );
};

export default LogoChangeGuide;
