// POS Integration Service for DeshiBites
export interface POSConfig {
  provider: 'square' | 'toast' | 'clover' | 'lightspeed' | 'touchbistro';
  apiKey: string;
  merchantId?: string;
  locationId?: string;
  environment: 'sandbox' | 'production';
  webhookUrl?: string;
}

export interface POSMenuItem {
  posId: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  available: boolean;
  modifiers?: POSModifier[];
}

export interface POSModifier {
  id: string;
  name: string;
  price: number;
  required: boolean;
}

export interface POSOrder {
  posOrderId: string;
  orderNumber: string;
  customerInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  items: POSOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  createdAt: string;
  tableNumber?: string;
}

export interface POSOrderItem {
  posItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: POSModifier[];
  specialInstructions?: string;
}

export class POSIntegrationService {
  private config: POSConfig;
  private baseUrl: string;

  constructor(config: POSConfig) {
    this.config = config;
    this.baseUrl = this.getBaseUrl(config.provider, config.environment);
  }

  private getBaseUrl(provider: string, environment: string): string {
    const urls = {
      square: {
        sandbox: 'https://connect.squareupsandbox.com',
        production: 'https://connect.squareup.com'
      },
      toast: {
        sandbox: 'https://ws-sandbox-api.toasttab.com',
        production: 'https://ws-api.toasttab.com'
      },
      clover: {
        sandbox: 'https://sandbox.dev.clover.com',
        production: 'https://api.clover.com'
      },
      lightspeed: {
        sandbox: 'https://api.lightspeedhq.com',
        production: 'https://api.lightspeedhq.com'
      }
    };

    const providerUrls = urls[provider as keyof typeof urls];
    if (!providerUrls) return '';
    
    return providerUrls[environment as keyof typeof providerUrls] || '';
  }

  // Sync menu items from POS to DeshiBites
  async syncMenuFromPOS(): Promise<POSMenuItem[]> {
    try {
      switch (this.config.provider) {
        case 'square':
          return await this.syncSquareMenu();
        case 'toast':
          return await this.syncToastMenu();
        case 'clover':
          return await this.syncCloverMenu();
        default:
          throw new Error(`POS provider ${this.config.provider} not supported`);
      }
    } catch (error) {
      console.error('Error syncing menu from POS:', error);
      throw error;
    }
  }

  // Push menu updates to POS
  async updateMenuItemInPOS(item: POSMenuItem): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'square':
          return await this.updateSquareMenuItem(item);
        case 'toast':
          return await this.updateToastMenuItem(item);
        case 'clover':
          return await this.updateCloverMenuItem(item);
        default:
          throw new Error(`POS provider ${this.config.provider} not supported`);
      }
    } catch (error) {
      console.error('Error updating menu item in POS:', error);
      return false;
    }
  }

  // Fetch orders from POS
  async fetchOrdersFromPOS(startDate?: string, endDate?: string): Promise<POSOrder[]> {
    try {
      switch (this.config.provider) {
        case 'square':
          return await this.fetchSquareOrders(startDate, endDate);
        case 'toast':
          return await this.fetchToastOrders(startDate, endDate);
        case 'clover':
          return await this.fetchCloverOrders(startDate, endDate);
        default:
          throw new Error(`POS provider ${this.config.provider} not supported`);
      }
    } catch (error) {
      console.error('Error fetching orders from POS:', error);
      throw error;
    }
  }

  // Send order to POS
  async sendOrderToPOS(order: POSOrder): Promise<string> {
    try {
      switch (this.config.provider) {
        case 'square':
          return await this.sendSquareOrder(order);
        case 'toast':
          return await this.sendToastOrder(order);
        case 'clover':
          return await this.sendCloverOrder(order);
        default:
          throw new Error(`POS provider ${this.config.provider} not supported`);
      }
    } catch (error) {
      console.error('Error sending order to POS:', error);
      throw error;
    }
  }

  // Square POS Integration Methods
  private async syncSquareMenu(): Promise<POSMenuItem[]> {
    const response = await fetch(`${this.baseUrl}/v2/catalog/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      }
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapSquareItemsToMenu(data.objects || []);
  }

  private mapSquareItemsToMenu(items: any[]): POSMenuItem[] {
    return items
      .filter(item => item.type === 'ITEM')
      .map(item => ({
        posId: item.id,
        name: item.item_data.name,
        price: item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount / 100 || 0,
        category: item.item_data.category_id || 'uncategorized',
        description: item.item_data.description,
        available: !item.item_data.skip_modifier_screen,
        modifiers: []
      }));
  }

  private async updateSquareMenuItem(item: POSMenuItem): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/v2/catalog/object`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        object: {
          id: item.posId,
          type: 'ITEM',
          item_data: {
            name: item.name,
            description: item.description,
            variations: [{
              type: 'ITEM_VARIATION',
              item_variation_data: {
                price_money: {
                  amount: Math.round(item.price * 100),
                  currency: 'USD'
                }
              }
            }]
          }
        }
      })
    });

    return response.ok;
  }

  private async fetchSquareOrders(startDate?: string, endDate?: string): Promise<POSOrder[]> {
    const searchQuery: any = {
      location_ids: [this.config.locationId]
    };

    if (startDate && endDate) {
      searchQuery.query = {
        filter: {
          date_time_filter: {
            created_at: {
              start_at: startDate,
              end_at: endDate
            }
          }
        }
      };
    }

    const response = await fetch(`${this.baseUrl}/v2/orders/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(searchQuery)
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapSquareOrdersToFormat(data.orders || []);
  }

  private mapSquareOrdersToFormat(orders: any[]): POSOrder[] {
    return orders.map(order => ({
      posOrderId: order.id,
      orderNumber: order.order_number || order.id.slice(-6),
      customerInfo: {
        name: order.fulfillments?.[0]?.pickup_details?.recipient?.display_name,
        phone: order.fulfillments?.[0]?.pickup_details?.recipient?.phone_number,
        email: order.fulfillments?.[0]?.pickup_details?.recipient?.email_address
      },
      items: order.line_items?.map((item: any) => ({
        posItemId: item.catalog_object_id,
        name: item.name,
        quantity: parseInt(item.quantity),
        unitPrice: item.base_price_money?.amount / 100 || 0,
        totalPrice: item.total_money?.amount / 100 || 0,
        modifiers: item.modifiers?.map((mod: any) => ({
          id: mod.catalog_object_id,
          name: mod.name,
          price: mod.total_money?.amount / 100 || 0,
          required: false
        })) || [],
        specialInstructions: item.note
      })) || [],
      totalAmount: order.total_money?.amount / 100 || 0,
      paymentStatus: order.tenders?.[0]?.card_details ? 'paid' : 'pending',
      orderStatus: this.mapSquareOrderStatus(order.state),
      orderType: this.mapSquareOrderType(order.fulfillments?.[0]?.type),
      createdAt: order.created_at,
      tableNumber: order.fulfillments?.[0]?.pickup_details?.note
    }));
  }

  private mapSquareOrderStatus(state: string): POSOrder['orderStatus'] {
    const statusMap: { [key: string]: POSOrder['orderStatus'] } = {
      'OPEN': 'pending',
      'COMPLETED': 'completed',
      'CANCELED': 'pending'
    };
    return statusMap[state] || 'pending';
  }

  private mapSquareOrderType(fulfillmentType: string): POSOrder['orderType'] {
    const typeMap: { [key: string]: POSOrder['orderType'] } = {
      'PICKUP': 'takeaway',
      'DELIVERY': 'delivery'
    };
    return typeMap[fulfillmentType] || 'dine-in';
  }

  private async sendSquareOrder(order: POSOrder): Promise<string> {
    const squareOrder = {
      order: {
        location_id: this.config.locationId,
        line_items: order.items.map(item => ({
          catalog_object_id: item.posItemId,
          quantity: item.quantity.toString(),
          note: item.specialInstructions
        })),
        fulfillments: [{
          type: order.orderType.toUpperCase(),
          state: 'PROPOSED'
        }]
      }
    };

    const response = await fetch(`${this.baseUrl}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(squareOrder)
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.order.id;
  }

  // Toast POS Integration Methods (placeholder)
  private async syncToastMenu(): Promise<POSMenuItem[]> {
    // Implement Toast POS menu sync
    throw new Error('Toast POS integration not implemented yet');
  }

  private async updateToastMenuItem(item: POSMenuItem): Promise<boolean> {
    // Implement Toast POS menu item update
    throw new Error('Toast POS integration not implemented yet');
  }

  private async fetchToastOrders(startDate?: string, endDate?: string): Promise<POSOrder[]> {
    // Implement Toast POS order fetching
    throw new Error('Toast POS integration not implemented yet');
  }

  private async sendToastOrder(order: POSOrder): Promise<string> {
    // Implement Toast POS order sending
    throw new Error('Toast POS integration not implemented yet');
  }

  // Clover POS Integration Methods (placeholder)
  private async syncCloverMenu(): Promise<POSMenuItem[]> {
    // Implement Clover POS menu sync
    throw new Error('Clover POS integration not implemented yet');
  }

  private async updateCloverMenuItem(item: POSMenuItem): Promise<boolean> {
    // Implement Clover POS menu item update
    throw new Error('Clover POS integration not implemented yet');
  }

  private async fetchCloverOrders(startDate?: string, endDate?: string): Promise<POSOrder[]> {
    // Implement Clover POS order fetching
    throw new Error('Clover POS integration not implemented yet');
  }

  private async sendCloverOrder(order: POSOrder): Promise<string> {
    // Implement Clover POS order sending
    throw new Error('Clover POS integration not implemented yet');
  }

  // Test POS connection
  async testConnection(): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'square':
          const response = await fetch(`${this.baseUrl}/v2/locations`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
              'Square-Version': '2023-10-18'
            }
          });
          return response.ok;
        default:
          return false;
      }
    } catch (error) {
      console.error('POS connection test failed:', error);
      return false;
    }
  }
}

// POS Integration Hook for React Components
export const usePOSIntegration = (config: POSConfig) => {
  const posService = new POSIntegrationService(config);

  const syncMenu = async () => {
    return await posService.syncMenuFromPOS();
  };

  const updateMenuItem = async (item: POSMenuItem) => {
    return await posService.updateMenuItemInPOS(item);
  };

  const fetchOrders = async (startDate?: string, endDate?: string) => {
    return await posService.fetchOrdersFromPOS(startDate, endDate);
  };

  const sendOrder = async (order: POSOrder) => {
    return await posService.sendOrderToPOS(order);
  };

  const testConnection = async () => {
    return await posService.testConnection();
  };

  return {
    syncMenu,
    updateMenuItem,
    fetchOrders,
    sendOrder,
    testConnection
  };
};
