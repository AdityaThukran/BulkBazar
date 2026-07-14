import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Package, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);

  const conditionColors = {
    new: '#059669', 'like-new': '#059669', good: '#3b82f6',
    fair: '#f59e0b', damaged: '#dc2626'
  };

  return (
    <Link to={`/marketplace/${product.id}`} className="product-card">
      <div className="product-card-header">
        <span className="product-card-category">
          <Tag size={10} /> {product.category}
        </span>
        {discount && (
          <span className="product-card-discount">-{discount}% OFF</span>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        {product.description && (
          <p className="product-card-desc">
            {product.description.length > 80
              ? product.description.substring(0, 80) + '...'
              : product.description}
          </p>
        )}
      </div>

      <div className="product-card-meta">
        <div className="product-card-qty">
          <Package size={12} />
          {product.quantity} {product.unit} available
        </div>
        <span
          className="product-card-condition"
          style={{ color: conditionColors[product.condition] || '#121212' }}
        >
          <Star size={10} fill="currentColor" /> {product.condition}
        </span>
      </div>

      <div className="product-card-pricing">
        <div className="product-card-price">{formatCurrency(product.price)}</div>
        {product.mrp && product.mrp > product.price && (
          <div className="product-card-mrp">{formatCurrency(product.mrp)}</div>
        )}
      </div>

      {product.profiles && (
        <div className="product-card-seller">
          <div className="product-card-seller-avatar">
            {product.profiles.full_name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <span>{product.profiles.full_name || 'Seller'}</span>
          {product.profiles.company && (
            <span className="product-card-seller-company">· {product.profiles.company}</span>
          )}
        </div>
      )}

      <div className="product-card-cta">View Deal →</div>
    </Link>
  );
};

export default ProductCard;
