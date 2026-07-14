import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Package, Tag, Star, Building2, Calendar,
  ShoppingCart, AlertTriangle, CheckCircle2, IndianRupee
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { estimateMarketability } from '../utils/aiEngine';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [orderQty, setOrderQty] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select('*, profiles(id, full_name, company, created_at, role)')
          .eq('id', id)
          .single();

        if (err) throw err;
        setProduct(data);
      } catch (err) {
        setError('Product not found or no longer available.');
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });

  const discount = product?.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const totalPrice = (Number(product?.price) * orderQty).toFixed(2);

  const isOwnListing = user && product && user.id === product.user_id;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (orderQty < 1 || orderQty > product.quantity) {
      setOrderError(`Please enter a quantity between 1 and ${product.quantity}.`);
      return;
    }
    setOrderLoading(true);
    setOrderError('');
    try {
      const { error: err } = await supabase
        .from('orders')
        .insert([{
          product_id: product.id,
          seller_id: product.user_id,
          buyer_id: user.id,
          buyer_name: profile?.full_name || 'Buyer',
          buyer_email: user.email,
          quantity: orderQty,
          total_price: totalPrice,
          status: 'pending',
          notes: orderNotes || null,
        }]);
      if (err) throw err;
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const conditionColors = {
    new: '#059669', 'like-new': '#059669', good: '#3b82f6',
    fair: '#f59e0b', damaged: '#dc2626'
  };

  if (loading) return (
    <div className="product-detail-loading">
      <div className="loading-pulse" />
      <div className="loading-pulse" style={{ width: '60%' }} />
      <div className="loading-pulse" style={{ width: '80%' }} />
    </div>
  );

  if (error || !product) return (
    <div className="product-detail-error">
      <Package size={48} />
      <h2>{error || 'Product not found'}</h2>
      <Link to="/marketplace" className="back-btn">
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>
    </div>
  );

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/marketplace" className="product-back-link">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        <div className="product-detail-layout">
          {/* ===== LEFT: Product Info ===== */}
          <div className="product-detail-left">
            {product.image_url ? (
              <div className="product-detail-image-card">
                <img src={product.image_url} alt={product.name} className="product-detail-large-image" />
              </div>
            ) : (
              <div className="product-detail-image-card product-detail-image-placeholder">
                <Package size={64} className="placeholder-icon" />
              </div>
            )}

            <div className="product-detail-card">
              <div className="product-detail-badges">
                <span className="product-detail-category">
                  <Tag size={11} /> {product.category}
                </span>
                {discount && (
                  <span className="product-detail-discount-badge">
                    {discount}% OFF
                  </span>
                )}
                <span
                  className="product-detail-condition"
                  style={{ color: conditionColors[product.condition] || '#121212' }}
                >
                  <Star size={10} fill="currentColor" /> {product.condition}
                </span>
              </div>

              <h1 className="product-detail-name">{product.name}</h1>

              {product.description && (
                <p className="product-detail-description">{product.description}</p>
              )}

              <div className="product-detail-pricing">
                <div className="product-detail-price">{formatCurrency(product.price)}</div>
                <div className="product-detail-price-meta">
                  {product.mrp && product.mrp > product.price && (
                    <span className="product-detail-mrp">MRP {formatCurrency(product.mrp)}</span>
                  )}
                  <span className="product-detail-unit">per {product.unit}</span>
                </div>
              </div>

              {(() => {
                const diagnosis = estimateMarketability(product);
                return (
                  <div className="product-detail-ai-assessment">
                    <div className="ai-assessment-header">
                      <span className="ai-assessment-title">✨ AI Deal Assessment</span>
                      <span className={`ai-assessment-score-pill score-${diagnosis.level.toLowerCase()}`}>
                        Value Score: {diagnosis.score}%
                      </span>
                    </div>
                    <p className="ai-assessment-text">
                      {diagnosis.score >= 75
                        ? `🔥 Exceptional Deal: This stock is priced at a major discount in ${product.condition} condition. High procurement recommendation.`
                        : diagnosis.score >= 45
                        ? `✅ Fair B2B Value: Good pricing relative to the item's ${product.condition} condition and category resale demand.`
                        : `⚠️ High Depreciation: Consider negotiating the price further using the live chat drawer.`}
                    </p>
                  </div>
                );
              })()}

              <div className="product-detail-stats">
                <div className="product-stat">
                  <span className="product-stat-label">Available Stock</span>
                  <span className="product-stat-value">
                    <Package size={14} /> {product.quantity} {product.unit}
                  </span>
                </div>
                <div className="product-stat">
                  <span className="product-stat-label">Category</span>
                  <span className="product-stat-value">{product.category}</span>
                </div>
                <div className="product-stat">
                  <span className="product-stat-label">Condition</span>
                  <span className="product-stat-value" style={{ color: conditionColors[product.condition] }}>
                    {product.condition}
                  </span>
                </div>
                <div className="product-stat">
                  <span className="product-stat-label">Listed On</span>
                  <span className="product-stat-value">
                    <Calendar size={13} /> {formatDate(product.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            {product.profiles && (
              <div className="seller-card">
                <div className="seller-card-header">
                  <span className="seller-card-label">SOLD BY</span>
                </div>
                <div className="seller-card-info">
                  <div className="seller-card-avatar">
                    {product.profiles.full_name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="seller-card-name">{product.profiles.full_name}</div>
                    {product.profiles.company && (
                      <div className="seller-card-company">
                        <Building2 size={12} /> {product.profiles.company}
                      </div>
                    )}
                    <div className="seller-card-since">
                      <Calendar size={11} /> Member since {formatDate(product.profiles.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT: Order Form ===== */}
          <div className="product-detail-right">
            {orderSuccess ? (
              <div className="order-success-card">
                <CheckCircle2 size={48} color="var(--accent)" />
                <h3>Order Placed!</h3>
                <p>
                  Your order for <strong>{orderQty} {product.unit}</strong> of{' '}
                  <strong>{product.name}</strong> has been sent to the seller.
                </p>
                <div className="order-success-total">
                  Total: {formatCurrency(Number(totalPrice))}
                </div>
                <p className="order-success-note">
                  The seller will contact you at <strong>{user?.email}</strong> to confirm and arrange delivery.
                </p>
                <div className="order-success-actions">
                  <Link to="/marketplace" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : isOwnListing ? (
              <div className="order-form-card own-listing-card">
                <div className="own-listing-icon">
                  <Package size={28} />
                </div>
                <h3>This is your listing</h3>
                <p>You can't place an order on your own product.</p>
                <Link to="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', justifyContent: 'center' }}>
                  Go to Dashboard
                </Link>
              </div>
            ) : profile?.role === 'seller' ? (
              <div className="order-form-card own-listing-card">
                <div className="own-listing-icon">
                  <AlertTriangle size={28} color="var(--yellow)" />
                </div>
                <h3>Seller Account</h3>
                <p>Only Buyer accounts can place orders. Please register or log in with a Buyer account to purchase listings.</p>
                <Link to="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', justifyContent: 'center' }}>
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="order-form-card">
                <div className="order-form-header">
                  <ShoppingCart size={20} />
                  <h3>Place Your Order</h3>
                </div>

                {!user && (
                  <div className="order-login-notice">
                    <AlertTriangle size={16} />
                    <span>
                      <Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to place an order.
                    </span>
                  </div>
                )}

                {orderError && (
                  <div className="order-error">{orderError}</div>
                )}

                <form onSubmit={handlePlaceOrder} className="order-form">
                  <div className="order-price-summary">
                    <div className="order-price-per">
                      <IndianRupee size={14} /> {formatCurrency(product.price)} per {product.unit}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Quantity ({product.unit})</label>
                    <div className="qty-input-wrap">
                      <button type="button" className="qty-btn" onClick={() => setOrderQty(q => Math.max(1, q - 1))}>−</button>
                      <input
                        type="number"
                        value={orderQty}
                        onChange={(e) => setOrderQty(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
                        min={1}
                        max={product.quantity}
                      />
                      <button type="button" className="qty-btn" onClick={() => setOrderQty(q => Math.min(product.quantity, q + 1))}>+</button>
                    </div>
                    <span className="form-hint">Max: {product.quantity} {product.unit}</span>
                  </div>

                  <div className="form-group">
                    <label>Notes for Seller (optional)</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="E.g. preferred packaging, delivery city, special requirements..."
                      rows={3}
                    />
                  </div>

                  <div className="order-total-row">
                    <span className="order-total-label">Total Amount</span>
                    <span className="order-total-value">{formatCurrency(Number(totalPrice))}</span>
                  </div>

                  <button
                    type="submit"
                    className="place-order-btn"
                    disabled={orderLoading || !user || product.quantity === 0 || profile?.role === 'seller'}
                  >
                    <ShoppingCart size={16} />
                    {orderLoading ? 'Placing Order...' : product.quantity === 0 ? 'Out of Stock' : 'Place Order'}
                  </button>

                  <p className="order-disclaimer">
                    By placing an order, you agree to be contacted by the seller via email to finalize payment and delivery.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
