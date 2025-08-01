// Language Selector Component for DeshiBites
import React from 'react';
import { useI18n, LanguageCode } from '../hooks/useI18n';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'toggle' | 'list';
  showFlag?: boolean;
  showName?: boolean;
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showFlag = true,
  showName = true,
  compact = false,
  className = ''
}) => {
  const { language, setLanguage, languages } = useI18n();

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    setLanguage(newLanguage);
  };

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`language-selector dropdown ${className}`}>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
          className="language-dropdown"
          aria-label="Select Language"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {showFlag && `${lang.flag} `}
              {showName && (compact ? lang.code.toUpperCase() : lang.nativeName)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Toggle variant (for 2 languages)
  if (variant === 'toggle') {
    const languageKeys = Object.keys(languages) as LanguageCode[];
    const otherLanguage = languageKeys.find(lang => lang !== language);
    
    if (!otherLanguage) return null;

    return (
      <button
        className={`language-selector toggle ${className}`}
        onClick={() => handleLanguageChange(otherLanguage)}
        aria-label={`Switch to ${languages[otherLanguage].name}`}
        title={`Switch to ${languages[otherLanguage].name}`}
      >
        {showFlag && (
          <span className="flag">{languages[otherLanguage].flag}</span>
        )}
        {showName && (
          <span className="name">
            {compact ? otherLanguage.toUpperCase() : languages[otherLanguage].nativeName}
          </span>
        )}
      </button>
    );
  }

  // List variant
  return (
    <div className={`language-selector list ${className}`}>
      {Object.entries(languages).map(([code, lang]) => (
        <button
          key={code}
          className={`language-option ${language === code ? 'active' : ''}`}
          onClick={() => handleLanguageChange(code as LanguageCode)}
          aria-label={`Switch to ${lang.name}`}
          title={lang.name}
        >
          {showFlag && <span className="flag">{lang.flag}</span>}
          {showName && (
            <span className="name">
              {compact ? code.toUpperCase() : lang.nativeName}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Compact header language selector
export const HeaderLanguageSelector: React.FC = () => {
  return (
    <LanguageSelector
      variant="toggle"
      showFlag={true}
      showName={false}
      compact={true}
      className="header-language-selector"
    />
  );
};

// Settings page language selector
export const SettingsLanguageSelector: React.FC = () => {
  const { language, setLanguage, languages } = useI18n();

  return (
    <div className="settings-language-selector">
      <h3>Language / Sprache</h3>
      <div className="language-cards">
        {Object.entries(languages).map(([code, lang]) => (
          <div
            key={code}
            className={`language-card ${language === code ? 'selected' : ''}`}
            onClick={() => setLanguage(code as LanguageCode)}
          >
            <div className="flag">{lang.flag}</div>
            <div className="names">
              <div className="native-name">{lang.nativeName}</div>
              <div className="english-name">{lang.name}</div>
            </div>
            {language === code && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
