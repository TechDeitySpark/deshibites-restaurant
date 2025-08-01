import React, { useState } from 'react';
import { RestaurantSettings, SettingsManagementProps } from '../types';
import POSIntegration from './POSIntegration';
import { SettingsLanguageSelector } from '../../components/LanguageSelector';
import { useI18n } from '../../hooks/useI18n';
import LogoChangeGuide from './LogoChangeGuide';

const SettingsManagement: React.FC<SettingsManagementProps> = ({ onAction }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [settings, setSettings] = useState<RestaurantSettings>({
    id: 1,
    restaurantName: 'DeshiBites',
    tagline: 'Authentic Bengali Flavors',
    description: 'Experience the authentic taste of Bengal with our traditional recipes and modern cooking techniques.',
    logo: '/assets/images/logo.png',
    bannerImage: '/assets/images/banner.jpg',
    favicon: '/assets/images/favicon.ico',
    primaryColor: '#ff8c42',
    secondaryColor: '#ff6b1a',
    accentColor: '#e53e3e',
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'contact@deshibites.com',
      address: '123 Food Street, Kolkata, West Bengal 700001',
      website: 'https://deshibites.com'
    },
    socialMedia: {
      facebook: 'https://facebook.com/deshibites',
      instagram: 'https://instagram.com/deshibites',
      twitter: 'https://twitter.com/deshibites',
      youtube: 'https://youtube.com/@deshibites'
    },
    businessHours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '10:00', close: '23:00', isClosed: false },
      saturday: { open: '10:00', close: '23:00', isClosed: false },
      sunday: { open: '11:00', close: '22:00', isClosed: false }
    },
    features: {
      onlineOrdering: true,
      tableReservations: true,
      deliveryService: true,
      loyaltyProgram: true,
      guestOrdering: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      orderAlerts: true,
      inventoryAlerts: true
    },
    integrations: {
      paymentGateways: ['stripe', 'razorpay', 'paytm'],
      deliveryPartners: ['zomato', 'swiggy', 'uber-eats'],
      posSystem: 'square',
      analyticsTracking: 'google-analytics'
    },
    seoSettings: {
      metaTitle: 'DeshiBites - Authentic Bengali Restaurant',
      metaDescription: 'Experience authentic Bengali cuisine with traditional recipes and modern cooking techniques. Order online for delivery or dine-in.',
      keywords: ['bengali food', 'authentic cuisine', 'traditional recipes', 'online ordering'],
      ogImage: '/assets/images/og-image.jpg'
    }
  });

  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    [key: string]: { type: 'success' | 'error'; message: string } | null;
  }>({});

  const handleInputChange = (field: string, value: any, category?: string) => {
    setSettings(prev => {
      if (category) {
        const categoryData = prev[category as keyof RestaurantSettings] as Record<string, any>;
        return {
          ...prev,
          [category]: {
            ...categoryData,
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value
        }
      }
    }));
  };

  const handleArrayChange = (category: string, field: string, value: string[]) => {
    setSettings(prev => {
      const categoryData = prev[category as keyof RestaurantSettings] as Record<string, any>;
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [field]: value
        }
      };
    });
  };

  const handleImageUpload = (type: string, file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size too large. Please select an image under 5MB.');
      return;
    }

    // Special validation for logo (recommended square aspect ratio)
    if (type === 'logo') {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.8 || aspectRatio > 1.2) {
          setUploadResult(prev => ({
            ...prev,
            [type]: {
              type: 'error',
              message: `Warning: Logo is ${img.width}x${img.height}. For best results, logos should be square (1:1 ratio). Consider resizing your image.`
            }
          }));
          return;
        }
        
        const mockUrl = URL.createObjectURL(file);
        handleInputChange(type, mockUrl);
        setUploadResult(prev => ({
          ...prev,
          [type]: {
            type: 'success',
            message: `Logo uploaded successfully! Perfect aspect ratio.`
          }
        }));
        setShowImageUpload(null);
      };
      img.src = URL.createObjectURL(file);
    } else {
      // For other images (banner, favicon, etc.)
      const mockUrl = URL.createObjectURL(file);
      handleInputChange(type, mockUrl);
      setUploadResult(prev => ({
        ...prev,
        [type]: {
          type: 'success',
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`
        }
      }));
      setShowImageUpload(null);
    }
  };

  const handleSaveSettings = () => {
    onAction?.('save', settings);
    // Show success message
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: t.settings.general, icon: '🏪' },
    { id: 'branding', label: t.settings.appearance, icon: '🎨' },
    { id: 'contact', label: t.settings.contact, icon: '📞' },
    { id: 'hours', label: t.settings.business_hours, icon: '🕒' },
    { id: 'language', label: t.settings.language, icon: '🌍' },
    { id: 'features', label: 'Features', icon: '⚙️' },
    { id: 'notifications', label: t.settings.notifications, icon: '🔔' },
    { id: 'integrations', label: t.settings.integrations, icon: '🔗' },
    { id: 'seo', label: 'SEO', icon: '🔍' }
  ];

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h4>General Information</h4>
      <div className="settings-grid">
        <div className="settings-field">
          <label>Restaurant Name</label>
          <input
            type="text"
            value={settings.restaurantName}
            onChange={(e) => handleInputChange('restaurantName', e.target.value)}
            placeholder="Enter restaurant name"
          />
        </div>
        <div className="settings-field">
          <label>Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Enter tagline"
          />
        </div>
        <div className="settings-field full-width">
          <label>Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter restaurant description"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="settings-section">
      <h4>Branding & Visual Identity</h4>
      <div className="settings-grid">
        <div className="settings-field">
          <label>
            Logo
            <button 
              type="button"
              className="help-btn"
              onClick={() => setShowGuide(true)}
              title="Show Logo Change Guide"
            >
              ?
            </button>
          </label>
          <div className="image-upload-container">
            <div className="current-image">
              <img src={settings.logo} alt="Logo" className="settings-image" />
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowImageUpload('logo')}
            >
              Change Logo
            </button>
          </div>
        </div>
        <div className="settings-field">
          <label>Banner Image</label>
          <div className="image-upload-container">
            <div className="current-image">
              <img src={settings.bannerImage} alt="Banner" className="settings-image banner" />
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowImageUpload('bannerImage')}
            >
              Change Banner
            </button>
          </div>
        </div>
        <div className="settings-field">
          <label>Favicon</label>
          <div className="image-upload-container">
            <div className="current-image">
              <img src={settings.favicon} alt="Favicon" className="settings-image favicon" />
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowImageUpload('favicon')}
            >
              Change Favicon
            </button>
          </div>
        </div>
        <div className="color-settings">
          <h5>Color Scheme</h5>
          <div className="color-grid">
            <div className="settings-field">
              <label>Primary Color</label>
              <div className="color-input-container">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#ff8c42"
                />
              </div>
            </div>
            <div className="settings-field">
              <label>Secondary Color</label>
              <div className="color-input-container">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#ff6b1a"
                />
              </div>
            </div>
            <div className="settings-field">
              <label>Accent Color</label>
              <div className="color-input-container">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  placeholder="#e53e3e"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSettings = () => (
    <div className="settings-section">
      <h4>Contact Information</h4>
      <div className="settings-grid">
        <div className="settings-field">
          <label>Phone Number</label>
          <input
            type="tel"
            value={settings.contactInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="settings-field">
          <label>Email Address</label>
          <input
            type="email"
            value={settings.contactInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
            placeholder="contact@deshibites.com"
          />
        </div>
        <div className="settings-field">
          <label>Website URL</label>
          <input
            type="url"
            value={settings.contactInfo.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value, 'contactInfo')}
            placeholder="https://deshibites.com"
          />
        </div>
        <div className="settings-field full-width">
          <label>Address</label>
          <textarea
            value={settings.contactInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value, 'contactInfo')}
            placeholder="Enter full address"
            rows={3}
          />
        </div>
        <div className="social-media-section">
          <h5>Social Media</h5>
          <div className="social-grid">
            <div className="settings-field">
              <label>Facebook</label>
              <input
                type="url"
                value={settings.socialMedia.facebook || ''}
                onChange={(e) => handleInputChange('facebook', e.target.value, 'socialMedia')}
                placeholder="https://facebook.com/deshibites"
              />
            </div>
            <div className="settings-field">
              <label>Instagram</label>
              <input
                type="url"
                value={settings.socialMedia.instagram || ''}
                onChange={(e) => handleInputChange('instagram', e.target.value, 'socialMedia')}
                placeholder="https://instagram.com/deshibites"
              />
            </div>
            <div className="settings-field">
              <label>Twitter</label>
              <input
                type="url"
                value={settings.socialMedia.twitter || ''}
                onChange={(e) => handleInputChange('twitter', e.target.value, 'socialMedia')}
                placeholder="https://twitter.com/deshibites"
              />
            </div>
            <div className="settings-field">
              <label>YouTube</label>
              <input
                type="url"
                value={settings.socialMedia.youtube || ''}
                onChange={(e) => handleInputChange('youtube', e.target.value, 'socialMedia')}
                placeholder="https://youtube.com/@deshibites"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessHoursSettings = () => (
    <div className="settings-section">
      <h4>Business Hours</h4>
      <div className="business-hours-grid">
        {Object.entries(settings.businessHours).map(([day, hours]) => (
          <div key={day} className="business-hours-row">
            <div className="day-label">
              <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
            </div>
            <div className="hours-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hours.isClosed}
                  onChange={(e) => handleBusinessHoursChange(day, 'isClosed', e.target.checked)}
                />
                Closed
              </label>
              {!hours.isClosed && (
                <>
                  <div className="time-input">
                    <label>Open:</label>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                    />
                  </div>
                  <div className="time-input">
                    <label>Close:</label>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="settings-section">
      <h4>Language & Localization</h4>
      <div className="language-settings-container">
        <SettingsLanguageSelector />
        
        <div className="language-info">
          <div className="info-card">
            <h5>🌍 Multilingual Support</h5>
            <p>DeshiBites supports multiple languages to serve diverse customers:</p>
            <ul>
              <li><strong>English:</strong> Default language for global customers</li>
              <li><strong>German (Deutsch):</strong> For German-speaking customers</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h5>📝 Content Translation</h5>
            <p>The following content will be automatically translated:</p>
            <ul>
              <li>Menu categories and items</li>
              <li>Order statuses and notifications</li>
              <li>User interface elements</li>
              <li>Email templates and messages</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h5>⚙️ How It Works</h5>
            <p>Language selection affects:</p>
            <ul>
              <li><strong>Admin Dashboard:</strong> Changes interface language</li>
              <li><strong>Customer Experience:</strong> Menu and ordering in selected language</li>
              <li><strong>Communications:</strong> Emails and notifications in customer's language</li>
              <li><strong>Reports:</strong> Analytics and reports in admin's language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesSettings = () => (
    <div className="settings-section">
      <h4>Features & Services</h4>
      <div className="features-grid">
        {Object.entries(settings.features).map(([feature, enabled]) => (
          <div key={feature} className="feature-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleInputChange(feature, e.target.checked, 'features')}
              />
              <span className="toggle-slider"></span>
              <span className="feature-name">
                {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="settings-section">
      <h4>Notification Settings</h4>
      <div className="notifications-grid">
        {Object.entries(settings.notifications).map(([notification, enabled]) => (
          <div key={notification} className="notification-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleInputChange(notification, e.target.checked, 'notifications')}
              />
              <span className="toggle-slider"></span>
              <span className="notification-name">
                {notification.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="settings-section">
      <h4>🔗 System Integrations</h4>
      
      {/* Full POS Integration Component */}
      <POSIntegration onAction={onAction} />
      
      {/* Other Integrations */}
      <div className="integrations-grid" style={{ marginTop: '30px' }}>
        <div className="integration-group">
          <h5>Payment Gateways</h5>
          <div className="tag-input">
            {settings.integrations.paymentGateways.map((gateway, index) => (
              <span key={index} className="tag">
                {gateway}
                <button 
                  onClick={() => {
                    const newGateways = settings.integrations.paymentGateways.filter((_, i) => i !== index);
                    handleArrayChange('integrations', 'paymentGateways', newGateways);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add payment gateway"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !settings.integrations.paymentGateways.includes(value)) {
                    handleArrayChange('integrations', 'paymentGateways', [...settings.integrations.paymentGateways, value]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="integration-group">
          <h5>Delivery Partners</h5>
          <div className="tag-input">
            {settings.integrations.deliveryPartners.map((partner, index) => (
              <span key={index} className="tag">
                {partner}
                <button 
                  onClick={() => {
                    const newPartners = settings.integrations.deliveryPartners.filter((_, i) => i !== index);
                    handleArrayChange('integrations', 'deliveryPartners', newPartners);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add delivery partner"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !settings.integrations.deliveryPartners.includes(value)) {
                    handleArrayChange('integrations', 'deliveryPartners', [...settings.integrations.deliveryPartners, value]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="settings-field">
          <label>Analytics Tracking</label>
          <input
            type="text"
            value={settings.integrations.analyticsTracking || ''}
            onChange={(e) => handleInputChange('analyticsTracking', e.target.value, 'integrations')}
            placeholder="e.g., Google Analytics, Facebook Pixel"
          />
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="settings-section">
      <h4>SEO Settings</h4>
      <div className="settings-grid">
        <div className="settings-field">
          <label>Meta Title</label>
          <input
            type="text"
            value={settings.seoSettings.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value, 'seoSettings')}
            placeholder="DeshiBites - Authentic Bengali Restaurant"
          />
        </div>
        <div className="settings-field full-width">
          <label>Meta Description</label>
          <textarea
            value={settings.seoSettings.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value, 'seoSettings')}
            placeholder="Enter meta description for search engines"
            rows={3}
          />
        </div>
        <div className="settings-field full-width">
          <label>Keywords</label>
          <div className="tag-input">
            {settings.seoSettings.keywords.map((keyword, index) => (
              <span key={index} className="tag">
                {keyword}
                <button 
                  onClick={() => {
                    const newKeywords = settings.seoSettings.keywords.filter((_, i) => i !== index);
                    handleArrayChange('seoSettings', 'keywords', newKeywords);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add keyword"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !settings.seoSettings.keywords.includes(value)) {
                    handleArrayChange('seoSettings', 'keywords', [...settings.seoSettings.keywords, value]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="settings-field">
          <label>OG Image</label>
          <div className="image-upload-container">
            <div className="current-image">
              <img src={settings.seoSettings.ogImage} alt="OG Image" className="settings-image" />
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowImageUpload('ogImage')}
            >
              Change OG Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-management">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={() => setSettings({ ...settings })}>
            Reset Changes
          </button>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            Save Settings
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'branding' && renderBrandingSettings()}
        {activeTab === 'contact' && renderContactSettings()}
        {activeTab === 'hours' && renderBusinessHoursSettings()}
        {activeTab === 'language' && renderLanguageSettings()}
        {activeTab === 'features' && renderFeaturesSettings()}
        {activeTab === 'notifications' && renderNotificationsSettings()}
        {activeTab === 'integrations' && renderIntegrationsSettings()}
        {activeTab === 'seo' && renderSEOSettings()}
      </div>

      {showImageUpload && (
        <div className="modal-overlay">
          <div className="modal image-upload-modal">
            <div className="modal-header">
              <h3>Upload {showImageUpload.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
              <button 
                className="close-button"
                onClick={() => setShowImageUpload(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div 
                className="upload-area"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleImageUpload(showImageUpload, file);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(showImageUpload, file);
                    }
                  }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <p>Click to select image or drag and drop</p>
                  <small>Supported formats: JPG, PNG, GIF, WebP (Max size: 5MB)</small>
                  {showImageUpload === 'logo' && (
                    <div className="upload-recommendations">
                      <strong>📏 Logo Recommendations:</strong>
                      <ul>
                        <li>• Square format (1:1 ratio) works best</li>
                        <li>• Minimum 200x200px, recommended 512x512px</li>
                        <li>• Transparent background (PNG) preferred</li>
                        <li>• Simple design that works at small sizes</li>
                      </ul>
                    </div>
                  )}
                  {showImageUpload === 'bannerImage' && (
                    <div className="upload-recommendations">
                      <strong>🖼️ Banner Recommendations:</strong>
                      <ul>
                        <li>• Wide format (16:9 or 3:1 ratio) works best</li>
                        <li>• Minimum 1200x400px, recommended 1920x640px</li>
                        <li>• High quality food photography</li>
                        <li>• Avoid text overlay (will be added separately)</li>
                      </ul>
                    </div>
                  )}
                  {showImageUpload === 'favicon' && (
                    <div className="upload-recommendations">
                      <strong>🔗 Favicon Recommendations:</strong>
                      <ul>
                        <li>• Square format (1:1 ratio) required</li>
                        <li>• Exactly 32x32px or 64x64px</li>
                        <li>• Simple, recognizable symbol</li>
                        <li>• ICO or PNG format preferred</li>
                      </ul>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <LogoChangeGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};

export default SettingsManagement;
