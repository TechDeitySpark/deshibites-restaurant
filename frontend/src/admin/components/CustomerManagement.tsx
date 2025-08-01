import React, { useState, useEffect } from 'react';
import { AdminCustomer, CustomerManagementProps, AdminOrder } from '../types';

const CustomerManagement: React.FC<CustomerManagementProps> = ({ onAction }) => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample customer data
  useEffect(() => {
    const sampleCustomers: AdminCustomer[] = [
      {
        id: 1,
        customerType: 'registered',
        name: 'Ahmed Rahman',
        phone: '+880-1712-345678',
        email: 'ahmed.rahman@email.com',
        address: '123 Dhaka Road, Gulshan, Dhaka-1212',
        registrationDate: '2024-06-15T10:30:00Z',
        lastOrderDate: '2025-01-15T12:30:00Z',
        totalOrders: 24,
        totalSpent: 8460,
        loyaltyPoints: 846,
        preferences: {
          preferredOrderType: 'delivery',
          dietaryRestrictions: ['halal'],
          favoriteItems: [1, 2, 5]
        },
        status: 'active'
      },
      {
        id: 2,
        customerType: 'registered',
        name: 'Fatima Khatun',
        phone: '+880-1798-765432',
        email: 'fatima.khatun@email.com',
        address: '456 Chittagong Avenue, Dhanmondi, Dhaka-1205',
        registrationDate: '2024-08-22T14:20:00Z',
        lastOrderDate: '2025-01-15T13:15:00Z',
        totalOrders: 18,
        totalSpent: 6320,
        loyaltyPoints: 632,
        preferences: {
          preferredOrderType: 'takeaway',
          dietaryRestrictions: ['vegetarian'],
          favoriteItems: [4, 6, 7]
        },
        status: 'active'
      },
      {
        id: 3,
        customerType: 'guest',
        name: 'Karim Uddin',
        phone: '+880-1555-987654',
        lastOrderDate: '2025-01-15T14:00:00Z',
        totalOrders: 1,
        totalSpent: 780,
        status: 'active',
        notes: 'Guest customer - single order via delivery'
      },
      {
        id: 4,
        customerType: 'registered',
        name: 'Rashida Begum',
        phone: '+880-1677-123456',
        email: 'rashida.begum@email.com',
        address: '789 Sylhet Street, Uttara, Dhaka-1230',
        registrationDate: '2024-03-10T09:45:00Z',
        lastOrderDate: '2025-01-10T16:20:00Z',
        totalOrders: 35,
        totalSpent: 12450,
        loyaltyPoints: 1245,
        preferences: {
          preferredOrderType: 'dine-in',
          dietaryRestrictions: [],
          favoriteItems: [1, 3, 8]
        },
        status: 'active'
      },
      {
        id: 5,
        customerType: 'guest',
        name: 'Mohammad Ali',
        phone: '+880-1822-654321',
        lastOrderDate: '2025-01-12T11:30:00Z',
        totalOrders: 2,
        totalSpent: 650,
        status: 'active',
        notes: 'Guest customer - 2 takeaway orders'
      },
      {
        id: 6,
        customerType: 'registered',
        name: 'Nasir Uddin',
        phone: '+880-1934-567890',
        email: 'nasir.uddin@email.com',
        address: '321 Comilla Road, Wari, Dhaka-1203',
        registrationDate: '2024-11-05T11:15:00Z',
        lastOrderDate: '2024-12-20T19:45:00Z',
        totalOrders: 8,
        totalSpent: 2840,
        loyaltyPoints: 284,
        preferences: {
          preferredOrderType: 'delivery',
          dietaryRestrictions: ['spicy'],
          favoriteItems: [2, 4, 7]
        },
        status: 'inactive',
        notes: 'Has not ordered in 3+ weeks'
      }
    ];
    setCustomers(sampleCustomers);
  }, []);

  // Enhanced filtering
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || customer.customerType === filterType;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewCustomer = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handlePromoteGuest = (customerId: number) => {
    setIsLoading(true);
    // Simulate API call to promote guest to registered customer
    setTimeout(() => {
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { 
              ...customer, 
              customerType: 'registered' as const,
              registrationDate: new Date().toISOString(),
              loyaltyPoints: Math.floor(customer.totalSpent * 0.1)
            } 
          : customer
      ));
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateGuestOrder = () => {
    setShowGuestModal(true);
  };

  const getCustomerTypeBadgeClass = (type: string) => {
    return `admin-customer-type admin-customer-type-${type}`;
  };

  const getStatusBadgeClass = (status: string) => {
    return `admin-customer-status admin-customer-status-${status}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerTypeIcon = (type: string) => {
    return type === 'registered' ? '👤' : '🎭';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: '✅',
      inactive: '⏸️',
      blocked: '🚫'
    };
    return icons[status as keyof typeof icons] || '❓';
  };

  // Calculate statistics
  const stats = {
    total: customers.length,
    registered: customers.filter(c => c.customerType === 'registered').length,
    guests: customers.filter(c => c.customerType === 'guest').length,
    active: customers.filter(c => c.status === 'active').length
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>👥 Customer Management</h2>
        <div className="admin-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.registered}</span>
            <span className="stat-label">Registered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.guests}</span>
            <span className="stat-label">Guests</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="admin-filters">
        <div className="admin-search-bar">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Customer Types</option>
          <option value="registered">Registered</option>
          <option value="guest">Guest</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
        
        <button 
          className="admin-btn admin-btn-primary"
          onClick={handleCreateGuestOrder}
        >
          <span>🎭</span>
          Create Guest Order
        </button>
      </div>

      {/* Enhanced Table */}
      <div className="admin-table-wrapper">
        {filteredCustomers.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">👥</div>
            <h3>No customers found</h3>
            <p>Try adjusting your search criteria or create a new guest order.</p>
            <button className="admin-btn admin-btn-primary" onClick={handleCreateGuestOrder}>
              Create Guest Order
            </button>
          </div>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Customer Details</th>
                <th>Contact Info</th>
                <th>Order History</th>
                <th>Type</th>
                <th>Status</th>
                <th>Loyalty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="admin-customer-display">
                      <div className="admin-customer-info">
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-id">ID: #{customer.id}</div>
                        {customer.registrationDate && (
                          <div className="registration-date">
                            Joined: {formatDate(customer.registrationDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-contact-info">
                      <div className="contact-phone">{customer.phone}</div>
                      {customer.email && (
                        <div className="contact-email">{customer.email}</div>
                      )}
                      {customer.address && (
                        <div className="contact-address" title={customer.address}>
                          {customer.address.length > 30 
                            ? `${customer.address.substring(0, 30)}...` 
                            : customer.address}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-order-history">
                      <div className="total-orders">{customer.totalOrders} orders</div>
                      <div className="total-spent">৳{customer.totalSpent}</div>
                      <div className="last-order">
                        Last: {formatDate(customer.lastOrderDate)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getCustomerTypeBadgeClass(customer.customerType)}>
                      {getCustomerTypeIcon(customer.customerType)} {customer.customerType}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(customer.status)}>
                      {getStatusIcon(customer.status)} {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-loyalty-info">
                      {customer.loyaltyPoints !== undefined ? (
                        <>
                          <div className="loyalty-points">{customer.loyaltyPoints} pts</div>
                          <div className="loyalty-tier">
                            {customer.loyaltyPoints >= 1000 ? '🏆 Gold' : 
                             customer.loyaltyPoints >= 500 ? '🥈 Silver' : '🥉 Bronze'}
                          </div>
                        </>
                      ) : (
                        <div className="no-loyalty">No points</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-action-btn admin-view-btn"
                        onClick={() => handleViewCustomer(customer)}
                        title="View Customer Details"
                      >
                        👁️
                      </button>
                      {customer.customerType === 'guest' && (
                        <button
                          className="admin-action-btn admin-promote-btn"
                          onClick={() => handlePromoteGuest(customer.id)}
                          title="Promote to Registered Customer"
                          disabled={isLoading}
                        >
                          ⬆️
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

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="admin-modal">
          <div className="admin-modal-content large-modal">
            <div className="admin-modal-header">
              <h2>👤 Customer Details - {selectedCustomer.name}</h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="customer-details-container">
                {/* Basic Information */}
                <div className="customer-info-section">
                  <h3>📄 Basic Information</h3>
                  <div className="customer-info-grid">
                    <div className="info-item">
                      <label>Customer ID:</label>
                      <span>#{selectedCustomer.id}</span>
                    </div>
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Type:</label>
                      <span className={getCustomerTypeBadgeClass(selectedCustomer.customerType)}>
                        {getCustomerTypeIcon(selectedCustomer.customerType)} {selectedCustomer.customerType}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Status:</label>
                      <span className={getStatusBadgeClass(selectedCustomer.status)}>
                        {getStatusIcon(selectedCustomer.status)} {selectedCustomer.status}
                      </span>
                    </div>
                    {selectedCustomer.registrationDate && (
                      <div className="info-item">
                        <label>Registration Date:</label>
                        <span>{formatDate(selectedCustomer.registrationDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="contact-info-section">
                  <h3>📞 Contact Information</h3>
                  <div className="contact-info-grid">
                    <div className="info-item">
                      <label>Phone:</label>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="info-item">
                        <label>Email:</label>
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}
                    {selectedCustomer.address && (
                      <div className="info-item full-width">
                        <label>Address:</label>
                        <span>{selectedCustomer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order History */}
                <div className="order-history-section">
                  <h3>📊 Order History</h3>
                  <div className="order-history-grid">
                    <div className="info-item">
                      <label>Total Orders:</label>
                      <span>{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Spent:</label>
                      <span>৳{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="info-item">
                      <label>Average Order:</label>
                      <span>
                        ৳{selectedCustomer.totalOrders > 0 
                          ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Last Order:</label>
                      <span>{formatDate(selectedCustomer.lastOrderDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Loyalty & Preferences */}
                {selectedCustomer.customerType === 'registered' && (
                  <>
                    <div className="loyalty-section">
                      <h3>🏆 Loyalty Program</h3>
                      <div className="loyalty-grid">
                        <div className="info-item">
                          <label>Loyalty Points:</label>
                          <span>{selectedCustomer.loyaltyPoints || 0} points</span>
                        </div>
                        <div className="info-item">
                          <label>Tier Status:</label>
                          <span>
                            {(selectedCustomer.loyaltyPoints || 0) >= 1000 ? '🏆 Gold Member' : 
                             (selectedCustomer.loyaltyPoints || 0) >= 500 ? '🥈 Silver Member' : '🥉 Bronze Member'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedCustomer.preferences && (
                      <div className="preferences-section">
                        <h3>⚙️ Preferences</h3>
                        <div className="preferences-grid">
                          <div className="info-item">
                            <label>Preferred Order Type:</label>
                            <span>{selectedCustomer.preferences.preferredOrderType}</span>
                          </div>
                          <div className="info-item">
                            <label>Dietary Restrictions:</label>
                            <span>
                              {selectedCustomer.preferences.dietaryRestrictions.length > 0
                                ? selectedCustomer.preferences.dietaryRestrictions.join(', ')
                                : 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Notes */}
                {selectedCustomer.notes && (
                  <div className="notes-section">
                    <h3>📝 Notes</h3>
                    <div className="notes-content">
                      {selectedCustomer.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Order Creation Modal */}
      {showGuestModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>🎭 Create Guest Order</h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowGuestModal(false)}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="guest-order-info">
                <h3>📋 Guest Order Information</h3>
                <p>
                  Guest orders are stored temporarily and linked to phone numbers. 
                  Guests can later register to convert their order history to a full account.
                </p>
                
                <div className="guest-order-steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span className="step-text">Collect guest name and phone number</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span className="step-text">Take order details (optional email)</span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span className="step-text">Process payment and fulfill order</span>
                  </div>
                  <div className="step">
                    <span className="step-number">4</span>
                    <span className="step-text">Guest can register later to claim order history</span>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowGuestModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => {
                      setShowGuestModal(false);
                      // Redirect to order creation
                      alert('Redirect to order creation form with guest option');
                    }}
                  >
                    Start Guest Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳ Processing...</div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
