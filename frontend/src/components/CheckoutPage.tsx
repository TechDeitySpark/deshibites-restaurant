import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onBack: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress: string;
  timeSlot: string;
  specialInstructions: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
  const { state, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    orderType: 'delivery',
    deliveryAddress: '',
    timeSlot: '',
    specialInstructions: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.orderType === 'delivery' && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }
    if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      clearCart();
      onBack();
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const timeSlots = [
    '3:00-3:30', '3:30-4:00', '4:00-4:30', '4:30-5:00',
    '5:00-5:30', '5:30-6:00', '6:00-6:30', '6:30-7:00',
    '7:00-7:30', '7:30-8:00'
  ];

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="header-content">
          <button className="back-arrow" onClick={onBack}>←</button>
          <div className="header-text">
            <h1>Checkout</h1>
            <p>Complete your order details</p>
          </div>
        </div>
      </header>

      <div className="checkout-container">
        <div className="delivery-section">
          <h2 className="section-title">Delivery Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Order Type</label>
              <div className="order-type">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="delivery"
                    name="orderType"
                    value="delivery"
                    checked={formData.orderType === 'delivery'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="delivery">
                    <span className="radio-icon">🚚</span>
                    Delivery
                  </label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="pickup"
                    name="orderType"
                    value="pickup"
                    checked={formData.orderType === 'pickup'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="pickup">
                    <span className="radio-icon">🏪</span>
                    Pickup
                  </label>
                </div>
              </div>
            </div>

            {formData.orderType === 'delivery' && (
              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address <span className="required">*</span></label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  className={`form-input textarea ${errors.deliveryAddress ? 'error' : ''}`}
                  placeholder="123 Main St, City, State 12345"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                />
                {errors.deliveryAddress && <span className="error-text">{errors.deliveryAddress}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="timeSlot">
                {formData.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time Slot <span className="required">*</span>
              </label>
              <select
                id="timeSlot"
                name="timeSlot"
                className={`form-input select ${errors.timeSlot ? 'error' : ''}`}
                value={formData.timeSlot}
                onChange={handleInputChange}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot.replace('-', ' - ')} PM
                  </option>
                ))}
              </select>
              {errors.timeSlot && <span className="error-text">{errors.timeSlot}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="specialInstructions">Special Instructions</label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                className="form-input textarea"
                placeholder="Any special requests or dietary restrictions..."
                value={formData.specialInstructions}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>

        <div className="order-summary">
          <h2 className="section-title">Order Summary</h2>
          
          {state.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-details">
                <h4>{item.title}</h4>
                <div className="item-qty-price">Qty: {item.quantity} × {item.price}</div>
              </div>
              <div className="item-total">
                €{(parseFloat(item.price.replace('€', '')) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>€{tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <div className="delivery-time">
            <strong>Estimated {formData.orderType === 'delivery' ? 'delivery' : 'pickup'} time:</strong> 30-45 minutes
          </div>

          <button 
            className="place-order-btn"
            onClick={handleSubmit}
            disabled={isProcessing || state.items.length === 0}
          >
            {isProcessing ? '🔄 Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
