import React, { useState, useEffect } from 'react';
import { POSIntegrationService, POSConfig, POSMenuItem, POSOrder } from '../services/POSIntegration';

interface POSIntegrationProps {
  onAction?: (action: string, data?: any) => void;
}

const POSIntegration: React.FC<POSIntegrationProps> = ({ onAction }) => {
  const [posConfig, setPosConfig] = useState<POSConfig>({
    provider: 'square',
    apiKey: '',
    merchantId: '',
    locationId: '',
    environment: 'sandbox',
    webhookUrl: ''
  });

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [lastSync, setLastSync] = useState<string>('');
  const [syncedItems, setSyncedItems] = useState<POSMenuItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<POSOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const posService = posConfig.apiKey ? new POSIntegrationService(posConfig) : null;

  // Test POS connection
  const testConnection = async () => {
    if (!posService) {
      setError('Please configure POS settings first');
      return;
    }

    setConnectionStatus('connecting');
    setError('');

    try {
      const isConnected = await posService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      if (!isConnected) {
        setError('Failed to connect to POS system. Please check your credentials.');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  // Sync menu from POS
  const syncMenuFromPOS = async () => {
    if (!posService) return;

    setIsLoading(true);
    setError('');

    try {
      const menuItems = await posService.syncMenuFromPOS();
      setSyncedItems(menuItems);
      setLastSync(new Date().toISOString());
      onAction?.('menu_synced', menuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Menu sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    if (!posService) return;

    setIsLoading(true);
    setError('');

    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
      
      const orders = await posService.fetchOrdersFromPOS(startDate, endDate);
      setRecentOrders(orders);
      onAction?.('orders_fetched', orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle configuration change
  const handleConfigChange = (field: keyof POSConfig, value: string) => {
    setPosConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setConnectionStatus('disconnected');
  };

  // Save POS configuration
  const savePOSConfig = () => {
    localStorage.setItem('pos_config', JSON.stringify(posConfig));
    onAction?.('pos_config_saved', posConfig);
  };

  // Load saved configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem('pos_config');
    if (savedConfig) {
      try {
        setPosConfig(JSON.parse(savedConfig));
      } catch (err) {
        console.error('Failed to load POS config:', err);
      }
    }
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#22c55e';
      case 'connecting': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Failed';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="pos-integration">
      <div className="pos-header">
        <h2>🔗 POS System Integration</h2>
        <div className="pos-status">
          <div 
            className="status-indicator"
            style={{ backgroundColor: getConnectionStatusColor() }}
          ></div>
          <span className="status-text">{getConnectionStatusText()}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="pos-content">
        {/* POS Configuration */}
        <div className="pos-section">
          <h3>⚙️ POS Configuration</h3>
          <div className="pos-config-grid">
            <div className="config-field">
              <label>POS Provider</label>
              <select
                value={posConfig.provider}
                onChange={(e) => handleConfigChange('provider', e.target.value)}
              >
                <option value="square">Square</option>
                <option value="toast">Toast</option>
                <option value="clover">Clover</option>
                <option value="lightspeed">Lightspeed</option>
                <option value="touchbistro">TouchBistro</option>
              </select>
            </div>

            <div className="config-field">
              <label>Environment</label>
              <select
                value={posConfig.environment}
                onChange={(e) => handleConfigChange('environment', e.target.value)}
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="production">Production (Live)</option>
              </select>
            </div>

            <div className="config-field full-width">
              <label>API Key</label>
              <input
                type="password"
                value={posConfig.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="Enter your POS API key"
              />
            </div>

            <div className="config-field">
              <label>Merchant ID</label>
              <input
                type="text"
                value={posConfig.merchantId}
                onChange={(e) => handleConfigChange('merchantId', e.target.value)}
                placeholder="Your merchant ID"
              />
            </div>

            <div className="config-field">
              <label>Location ID</label>
              <input
                type="text"
                value={posConfig.locationId}
                onChange={(e) => handleConfigChange('locationId', e.target.value)}
                placeholder="Your location ID"
              />
            </div>

            <div className="config-field full-width">
              <label>Webhook URL (Optional)</label>
              <input
                type="url"
                value={posConfig.webhookUrl}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                placeholder="https://your-domain.com/webhooks/pos"
              />
            </div>
          </div>

          <div className="config-actions">
            <button className="btn btn-secondary" onClick={savePOSConfig}>
              💾 Save Configuration
            </button>
            <button 
              className="btn btn-primary" 
              onClick={testConnection}
              disabled={!posConfig.apiKey || connectionStatus === 'connecting'}
            >
              🔌 Test Connection
            </button>
          </div>
        </div>

        {/* Sync Operations */}
        {connectionStatus === 'connected' && (
          <div className="pos-section">
            <h3>🔄 Sync Operations</h3>
            <div className="sync-operations">
              <div className="sync-card">
                <div className="sync-info">
                  <h4>📋 Menu Sync</h4>
                  <p>Sync menu items from your POS system</p>
                  {lastSync && (
                    <small>Last sync: {new Date(lastSync).toLocaleString()}</small>
                  )}
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={syncMenuFromPOS}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Syncing...' : '🔄 Sync Menu'}
                </button>
              </div>

              <div className="sync-card">
                <div className="sync-info">
                  <h4>📦 Orders Sync</h4>
                  <p>Fetch recent orders from POS</p>
                  <small>Last 24 hours</small>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={fetchRecentOrders}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Fetching...' : '📦 Fetch Orders'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Synced Menu Items */}
        {syncedItems.length > 0 && (
          <div className="pos-section">
            <h3>📋 Synced Menu Items ({syncedItems.length})</h3>
            <div className="synced-items-grid">
              {syncedItems.slice(0, 6).map((item, index) => (
                <div key={index} className="synced-item-card">
                  <div className="item-header">
                    <h4>{item.name}</h4>
                    <span className={`status ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>
                  <p className="item-description">{item.description || 'No description'}</p>
                  <div className="item-details">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <span className="item-category">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
            {syncedItems.length > 6 && (
              <p className="show-more">
                And {syncedItems.length - 6} more items...
              </p>
            )}
          </div>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="pos-section">
            <h3>📦 Recent Orders ({recentOrders.length})</h3>
            <div className="recent-orders-list">
              {recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="order-card">
                  <div className="order-header">
                    <span className="order-number">#{order.orderNumber}</span>
                    <span className={`order-status ${order.orderStatus}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.customerInfo.name || 'Guest'}</p>
                    <p><strong>Items:</strong> {order.items.length}</p>
                    <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                    <p><strong>Type:</strong> {order.orderType}</p>
                  </div>
                  <div className="order-time">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Guide */}
        <div className="pos-section">
          <h3>📖 Integration Guide</h3>
          <div className="integration-guide">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Get API Credentials</h4>
                <p>Log into your {posConfig.provider} dashboard and create API credentials</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Configure Settings</h4>
                <p>Enter your API key, merchant ID, and location ID above</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Test Connection</h4>
                <p>Click "Test Connection" to verify your credentials work</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Sync Data</h4>
                <p>Use the sync buttons to import menu items and orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSIntegration;
