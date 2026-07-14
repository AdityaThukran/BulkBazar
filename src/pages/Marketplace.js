import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, SlidersHorizontal, Package } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import './Marketplace.css';

const CATEGORIES = [
  'All', 'Textiles', 'Electronics', 'FMCG', 'Auto Parts',
  'Pharma', 'Building Materials', 'Chemicals', 'Agriculture', 'Other'
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase
        .from('products')
        .select('*, profiles(full_name, company)')
        .eq('status', 'active')
        .gt('quantity', 0);

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery.trim()}%`);
      }

      if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
      else if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
      else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
      else if (sortBy === 'discount') query = query.order('mrp', { ascending: false });

      const { data, error: err } = await query;
      if (err) throw err;
      setProducts(data || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Marketplace fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="marketplace-page">
      {/* Hero */}
      <section className="marketplace-hero">
        <div className="container">
          <div className="marketplace-hero-inner">
            <div className="marketplace-hero-label">LIVE MARKETPLACE</div>
            <h1 className="marketplace-hero-title">
              Buy Bulk Stock at{' '}
              <span className="marketplace-gradient-word">Clearance Prices</span>
            </h1>
            <p className="marketplace-hero-subtitle">
              Browse verified dead stock from manufacturers across India. 
              Authentic goods, deep discounts, direct from source.
            </p>

            <div className="marketplace-search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products, categories, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="marketplace-body">
        <div className="container">
          {/* Category Chips */}
          <div className="marketplace-filters">
            <div className="category-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="marketplace-sort">
              <SlidersHorizontal size={14} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="marketplace-results-info">
            {!loading && (
              <span>
                {products.length === 0
                  ? 'No products found'
                  : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="marketplace-loading">
              <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="product-card-skeleton" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="marketplace-error">
              <Package size={40} />
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchProducts}>Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="marketplace-empty">
              <Package size={48} />
              <h3>No Products Found</h3>
              <p>
                {searchQuery
                  ? `No active listings match "${searchQuery}". Try a different search.`
                  : `No active listings in ${activeCategory} right now. Check back soon!`}
              </p>
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  className="clear-filters-btn"
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="marketplace-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
