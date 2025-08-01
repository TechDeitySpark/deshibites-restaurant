import React, { useState, useEffect } from 'react';
import { AdminOrder, OrderManagementProps, OrderItem } from '../types';

const OrderManagement: React.FC<OrderManagementProps> = ({ onAction }) => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample orders data
  useEffect(() => {
    const sampleOrders: AdminOrder[] = [
      {
        id: 1,
        orderNumber: 'ORD-2025-001',
        customerName: 'Ahmed Rahman',
        customerPhone: '+880-1712-345678',
        customerEmail: 'ahmed@example.com',
        items: [
          { id: 1, menuItemId: 1, name: 'Chicken Biryani', price: 280, quantity: 2 },
          { id: 2, menuItemId: 5, name: 'Samosa', price: 25, quantity: 4 }
        ],
        totalAmount: 660,
        status: 'pending',
        orderType: 'dine-in',
        orderTime: '2025-01-15T12:30:00Z',
        estimatedTime: '25 mins',
        tableNumber: 'T-12',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        notes: 'Extra spicy please'
      },
      {
        id: 2,
        orderNumber: 'ORD-2025-002',
        customerName: 'Fatima Khatun',
        customerPhone: '+880-1798-765432',
        customerEmail: 'fatima@example.com',
        items: [
          { id: 3, menuItemId: 2, name: 'Beef Rezala', price: 350, quantity: 1 },
          { id: 4, menuItemId: 7, name: 'Mango Lassi', price: 80, quantity: 2 }
        ],
        totalAmount: 510,
        status: 'preparing',
        orderType: 'takeaway',
        orderTime: '2025-01-15T13:15:00Z',
        estimatedTime: '15 mins',
        paymentMethod: 'card',
        paymentStatus: 'paid'
      },
      {
        id: 3,
        orderNumber: 'ORD-2025-003',
        customerName: 'Karim Uddin',
        customerPhone: '+880-1555-987654',
        items: [
          { id: 5, menuItemId: 4, name: 'Vegetable Biryani', price: 220, quantity: 3 },
          { id: 6, menuItemId: 6, name: 'Rasgulla', price: 60, quantity: 2 }
        ],
        totalAmount: 780,
        status: 'ready',
        orderType: 'delivery',
        orderTime: '2025-01-15T14:00:00Z',
        estimatedTime: '5 mins',
        deliveryAddress: '123 Dhaka Road, Gulshan, Dhaka',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        notes: 'Call before delivery'
      },
      {
        id: 4,
        orderNumber: 'ORD-2025-004',
        customerName: 'Rashida Begum',
        customerPhone: '+880-1677-123456',
        items: [
          { id: 7, menuItemId: 3, name: 'Fish Curry', price: 320, quantity: 1 },
          { id: 8, menuItemId: 5, name: 'Samosa', price: 25, quantity: 6 }
        ],
        totalAmount: 470,
        status: 'delivered',
        orderType: 'delivery',
        orderTime: '2025-01-15T11:45:00Z',
        deliveryAddress: '456 Chittagong Avenue, Dhanmondi, Dhaka',
        paymentMethod: 'cash',
        paymentStatus: 'paid'
      },
      {
        id: 5,
        orderNumber: 'ORD-2025-005',
        customerName: 'Mohammad Ali',
        customerPhone: '+880-1822-654321',
        items: [
          { id: 9, menuItemId: 8, name: 'Prawn Malai Curry', price: 420, quantity: 1 }
        ],
        totalAmount: 420,
        status: 'cancelled',
        orderType: 'dine-in',
        orderTime: '2025-01-15T10:30:00Z',
        tableNumber: 'T-08',
        paymentMethod: 'card',
        paymentStatus: 'refunded',
        notes: 'Customer cancelled - allergic reaction'
      }
    ];
    setOrders(sampleOrders);
  }, []);

  // Enhanced filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.orderType === filterType;
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  const handleStatusUpdate = (orderId: number, newStatus: AdminOrder['status']) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setIsLoading(false);
    }, 500);
  };

  const handleViewOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = 'admin-order-status';
    return `${baseClass} ${baseClass}-${status}`;
  };

  const getOrderTypeBadgeClass = (type: string) => {
    const baseClass = 'admin-order-type';
    return `${baseClass} ${baseClass}-${type}`;
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    const baseClass = 'admin-payment-status';
    return `${baseClass} ${baseClass}-${status}`;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🔔',
      delivered: '🚚',
      cancelled: '❌'
    };
    return icons[status as keyof typeof icons] || '📋';
  };

  const getOrderTypeIcon = (type: string) => {
    const icons = {
      'dine-in': '🪑',
      'takeaway': '🥡',
      'delivery': '🚚'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>📋 Order Management</h2>
        <div className="admin-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.preparing}</span>
            <span className="stat-label">Preparing</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.ready}</span>
            <span className="stat-label">Ready</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="admin-filters">
        <div className="admin-search-bar">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by order number, customer name, phone, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Types</option>
          <option value="dine-in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </select>
        
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Payments</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Enhanced Table */}
      <div className="admin-table-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">📋</div>
            <h3>No orders found</h3>
            <p>Try adjusting your search criteria or check if there are any new orders.</p>
          </div>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Customer</th>
                <th>Items & Total</th>
                <th>Type</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="admin-order-display">
                      <div className="admin-order-info">
                        <div 
                          className="order-number clickable"
                          onClick={() => handleViewOrder(order)}
                          title="Click to view order details"
                        >
                          {order.orderNumber}
                        </div>
                        <div className="order-time">{formatTime(order.orderTime)}</div>
                        {order.estimatedTime && (
                          <div className="order-estimate">ETA: {order.estimatedTime}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-customer-info">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="customer-phone">{order.customerPhone}</div>
                      {order.tableNumber && (
                        <div className="table-number">Table: {order.tableNumber}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-order-items">
                      <div className="items-summary">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="order-total">৳{order.totalAmount}</div>
                    </div>
                  </td>
                  <td>
                    <span className={getOrderTypeBadgeClass(order.orderType)}>
                      {getOrderTypeIcon(order.orderType)} {order.orderType}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={getPaymentStatusBadgeClass(order.paymentStatus)}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn admin-view-btn"
                        onClick={() => handleViewOrder(order)}
                        title="View Order Details"
                      >
                        👁️
                      </button>
                      {order.status === 'pending' && (
                        <button
                          className="admin-action-btn admin-confirm-btn"
                          onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                          title="Confirm Order"
                          disabled={isLoading}
                        >
                          ✅
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          className="admin-action-btn admin-prepare-btn"
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                          title="Start Preparing"
                          disabled={isLoading}
                        >
                          👨‍🍳
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          className="admin-action-btn admin-ready-btn"
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          title="Mark as Ready"
                          disabled={isLoading}
                        >
                          🔔
                        </button>
                      )}
                      {(order.status === 'ready' || order.status === 'confirmed') && (
                        <button
                          className="admin-action-btn admin-deliver-btn"
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          title="Mark as Delivered"
                          disabled={isLoading}
                        >
                          🚚
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="admin-modal">
          <div className="admin-modal-content large-modal">
            <div className="admin-modal-header">
              <h2>📋 Order Details - {selectedOrder.orderNumber}</h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="order-details-container">
                {/* Order Information */}
                <div className="order-info-section">
                  <h3>📄 Order Information</h3>
                  <div className="order-info-grid">
                    <div className="info-item">
                      <label>Order Number:</label>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="info-item">
                      <label>Order Time:</label>
                      <span>{formatTime(selectedOrder.orderTime)}</span>
                    </div>
                    <div className="info-item">
                      <label>Status:</label>
                      <span className={getStatusBadgeClass(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Type:</label>
                      <span className={getOrderTypeBadgeClass(selectedOrder.orderType)}>
                        {getOrderTypeIcon(selectedOrder.orderType)} {selectedOrder.orderType}
                      </span>
                    </div>
                    {selectedOrder.estimatedTime && (
                      <div className="info-item">
                        <label>Estimated Time:</label>
                        <span>{selectedOrder.estimatedTime}</span>
                      </div>
                    )}
                    {selectedOrder.tableNumber && (
                      <div className="info-item">
                        <label>Table Number:</label>
                        <span>{selectedOrder.tableNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="customer-info-section">
                  <h3>👤 Customer Information</h3>
                  <div className="customer-info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone:</label>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    {selectedOrder.customerEmail && (
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{selectedOrder.customerEmail}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryAddress && (
                      <div className="info-item full-width">
                        <label>Delivery Address:</label>
                        <span>{selectedOrder.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-section">
                  <h3>🍽️ Order Items</h3>
                  <div className="order-items-list">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">× {item.quantity}</span>
                        </div>
                        <div className="item-price">৳{item.price * item.quantity}</div>
                        {item.specialInstructions && (
                          <div className="item-instructions">
                            Note: {item.specialInstructions}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="order-total-section">
                      <div className="total-row">
                        <span className="total-label">Total Amount:</span>
                        <span className="total-amount">৳{selectedOrder.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="payment-info-section">
                  <h3>💳 Payment Information</h3>
                  <div className="payment-info-grid">
                    <div className="info-item">
                      <label>Payment Method:</label>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="info-item">
                      <label>Payment Status:</label>
                      <span className={getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="notes-section">
                    <h3>📝 Notes</h3>
                    <div className="notes-content">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳ Updating order...</div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
