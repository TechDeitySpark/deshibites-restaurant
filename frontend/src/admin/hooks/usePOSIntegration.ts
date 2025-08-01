import { useState, useEffect } from 'react';
import { POSIntegrationService, POSConfig, POSMenuItem, POSOrder } from '../services/POSIntegration';

export interface UsePOSIntegrationReturn {
  posService: POSIntegrationService | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  testConnection: () => Promise<boolean>;
  syncMenu: () => Promise<POSMenuItem[]>;
  fetchOrders: (startDate: string, endDate: string) => Promise<POSOrder[]>;
  clearError: () => void;
}

export const usePOSIntegration = (config: POSConfig | null): UsePOSIntegrationReturn => {
  const [posService, setPosService] = useState<POSIntegrationService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize POS service when config changes
  useEffect(() => {
    if (config && config.apiKey && config.merchantId) {
      setPosService(new POSIntegrationService(config));
      setIsConnected(false);
    } else {
      setPosService(null);
      setIsConnected(false);
    }
    setError(null);
  }, [config]);

  const testConnection = async (): Promise<boolean> => {
    if (!posService) {
      setError('POS service not configured');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const connected = await posService.testConnection();
      setIsConnected(connected);
      if (!connected) {
        setError('Failed to connect to POS system');
      }
      return connected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncMenu = async (): Promise<POSMenuItem[]> => {
    if (!posService) {
      throw new Error('POS service not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const menuItems = await posService.syncMenuFromPOS();
      return menuItems;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Menu sync failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (startDate: string, endDate: string): Promise<POSOrder[]> => {
    if (!posService) {
      throw new Error('POS service not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const orders = await posService.fetchOrdersFromPOS(startDate, endDate);
      return orders;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    posService,
    isConnected,
    isLoading,
    error,
    testConnection,
    syncMenu,
    fetchOrders,
    clearError
  };
};
