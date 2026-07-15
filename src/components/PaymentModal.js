import React, { useState } from 'react';
import { CreditCard, Smartphone, ShieldCheck, X, Loader2 } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, totalAmount, productName, onPaymentSuccess }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card' or 'upi'
  const [loading, setLoading] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  const commission = Number(totalAmount) * 0.02; // 2% platform cut
  const finalPrice = Number(totalAmount);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock payment gateway delay
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-box card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="payment-header">
          <div className="payment-header-title">
            <ShieldCheck className="shield-icon" size={20} />
            <h3>Secure B2B Payment Gateway</h3>
          </div>
          <button type="button" className="payment-close-btn" onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        {/* Summary Card */}
        <div className="payment-summary-box">
          <p className="summary-lbl">Wholesale Purchase</p>
          <h4 className="summary-product-name">{productName}</h4>
          <div className="payment-summary-row">
            <span>Order Value:</span>
            <strong>{formatCurrency(finalPrice - commission)}</strong>
          </div>
          <div className="payment-summary-row fee-row">
            <span>Platform Service Fee (2%):</span>
            <strong>{formatCurrency(commission)}</strong>
          </div>
          <div className="payment-summary-total">
            <span>Total Amount Due:</span>
            <strong>{formatCurrency(finalPrice)}</strong>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="payment-tabs">
          <button
            type="button"
            className={`payment-tab-btn ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => !loading && setActiveTab('card')}
          >
            <CreditCard size={14} /> Credit/Debit Card
          </button>
          <button
            type="button"
            className={`payment-tab-btn ${activeTab === 'upi' ? 'active' : ''}`}
            onClick={() => !loading && setActiveTab('upi')}
          >
            <Smartphone size={14} /> UPI Transfer
          </button>
        </div>

        {/* Forms */}
        <form onSubmit={handlePay} className="payment-form">
          {activeTab === 'card' ? (
            <div className="payment-fields">
              <div className="payment-field-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="payment-field-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="payment-field-row">
                <div className="payment-field-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="payment-field-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-fields">
              <div className="payment-field-group">
                <label>UPI ID (VPA)</label>
                <input
                  type="text"
                  placeholder="name@upi or phone@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={loading}
                  required
                />
                <span className="field-help-text">Enter any valid UPI ID (no actual balance will be debited).</span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button type="submit" className="payment-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spin" /> Processing Secure Payment...
              </>
            ) : (
              `Authorize Payment of ${formatCurrency(finalPrice)}`
            )}
          </button>
        </form>

        <div className="payment-footer">
          🛡️ BulkBazar Escrow Guarantee: Funds are held safely until warehouse delivery is confirmed.
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
