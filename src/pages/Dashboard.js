import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, UserCircle, LogOut, Plus, Pencil, Trash2,
  Search, X, Save, AlertTriangle, TrendingUp, Archive, IndianRupee,
  ChevronDown, ShoppingCart, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const CATEGORIES = [
  'Textiles', 'Electronics', 'FMCG', 'Auto Parts',
  'Pharma', 'Building Materials', 'Chemicals', 'Agriculture', 'Other'
];

const UNITS = ['pieces', 'kg', 'liters', 'meters', 'boxes', 'cartons', 'tonnes'];
const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'damaged'];

const emptyProduct = {
  name: '', description: '', category: 'Other', quantity: 0,
  unit: 'pieces', price: 0, mrp: 0, condition: 'new', status: 'active'
};

const Dashboard = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({
    full_name: '', company: '', phone: '', role: 'seller'
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0, totalValue: 0, lowStock: 0, activeCount: 0, pendingOrders: 0
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!user) return;
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);

      // Calculate stats
      const prods = data || [];
      setStats(prev => ({
        ...prev,
        totalProducts: prods.length,
        totalValue: prods.reduce((sum, p) => sum + (Number(p.price) * p.quantity), 0),
        lowStock: prods.filter(p => p.quantity > 0 && p.quantity <= 10).length,
        activeCount: prods.filter(p => p.status === 'active').length,
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name, unit, category)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
      setStats(prev => ({
        ...prev,
        pendingOrders: (data || []).filter(o => o.status === 'pending').length
      }));
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      await fetchOrders();
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        company: profile.company || '',
        phone: profile.phone || '',
        role: profile.role || 'seller',
      });
    }
  }, [profile]);

  // Product CRUD
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: ['quantity', 'price', 'mrp'].includes(name) ? Number(value) : value
    }));
    setFormError('');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ ...emptyProduct });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      price: Number(product.price),
      mrp: Number(product.mrp) || 0,
      condition: product.condition,
      status: product.status,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    setFormLoading(true);
    setFormError('');

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            ...productForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...productForm, user_id: user.id }]);
        if (error) throw error;
      }
      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      setDeleteConfirm(null);
      await fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Profile
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileSuccess(false);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <ShoppingCart size={18} />
            <span>BulkBazaar</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{profile?.full_name || 'User'}</span>
            <span className="sidebar-user-role">{profile?.role || 'seller'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }}
          >
            <Package size={18} />
            Inventory
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setSidebarOpen(false); fetchOrders(); }}
          >
            <ClipboardList size={18} />
            Orders
            {stats.pendingOrders > 0 && (
              <span className="sidebar-orders-badge">{stats.pendingOrders}</span>
            )}
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
          >
            <UserCircle size={18} />
            Profile
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Log Out
        </button>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <LayoutDashboard size={20} />
          </button>
          <h2 className="topbar-title">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'inventory' && 'Inventory Management'}
            {activeTab === 'orders' && 'Incoming Orders'}
            {activeTab === 'profile' && 'Profile Settings'}
          </h2>
          <div className="topbar-user-badge">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </header>

        <div className="dashboard-content">
          {/* ======== OVERVIEW TAB ======== */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-icon" style={{ background: 'var(--accent)' }}>
                    <Package size={22} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{stats.totalProducts}</span>
                    <span className="stat-card-label">Total Products</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon" style={{ background: 'var(--yellow)' }}>
                    <IndianRupee size={22} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{formatCurrency(stats.totalValue)}</span>
                    <span className="stat-card-label">Total Inventory Value</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon" style={{ background: '#f87171' }}>
                    <AlertTriangle size={22} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{stats.lowStock}</span>
                    <span className="stat-card-label">Low Stock Alerts</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon" style={{ background: 'var(--purple)' }}>
                    <TrendingUp size={22} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{stats.activeCount}</span>
                    <span className="stat-card-label">Active Listings</span>
                  </div>
                </div>

                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('orders')}>
                  <div className="stat-card-icon" style={{ background: '#60a5fa' }}>
                    <ClipboardList size={22} />
                  </div>
                  <div className="stat-card-info">
                    <span className="stat-card-value">{stats.pendingOrders}</span>
                    <span className="stat-card-label">Pending Orders</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="overview-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn" onClick={() => { setActiveTab('inventory'); openAddModal(); }}>
                    <Plus size={18} /> Add New Product
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveTab('inventory')}>
                    <Archive size={18} /> View Inventory
                  </button>
                  <button className="quick-action-btn" onClick={() => { setActiveTab('orders'); fetchOrders(); }}>
                    <ClipboardList size={18} /> View Orders
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveTab('profile')}>
                    <UserCircle size={18} /> Edit Profile
                  </button>
                </div>
              </div>

              {/* Recent Products */}
              <div className="overview-section">
                <h3>Recent Products</h3>
                {products.length === 0 ? (
                  <div className="empty-state">
                    <Package size={40} />
                    <p>No products yet. Add your first product to get started!</p>
                    <button className="quick-action-btn" onClick={() => { setActiveTab('inventory'); openAddModal(); }}>
                      <Plus size={18} /> Add Product
                    </button>
                  </div>
                ) : (
                  <div className="recent-products-list">
                    {products.slice(0, 5).map(product => (
                      <div key={product.id} className="recent-product-item">
                        <div className="recent-product-info">
                          <span className="recent-product-name">{product.name}</span>
                          <span className="recent-product-category">{product.category}</span>
                        </div>
                        <div className="recent-product-meta">
                          <span className="recent-product-qty">{product.quantity} {product.unit}</span>
                          <span className="recent-product-price">{formatCurrency(product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======== INVENTORY TAB ======== */}
          {activeTab === 'inventory' && (
            <div className="inventory-tab">
              <div className="inventory-toolbar">
                <div className="inventory-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="search-clear" onClick={() => setSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="inventory-filter">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="filter-chevron" />
                </div>

                <button className="add-product-btn" onClick={openAddModal}>
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {productsLoading ? (
                <div className="inventory-loading">Loading inventory...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <Package size={40} />
                  <p>{products.length === 0 ? 'No products yet. Click "Add Product" to get started!' : 'No products match your search.'}</p>
                </div>
              ) : (
                <div className="inventory-table-wrap">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>MRP</th>
                        <th>Condition</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id} className={product.quantity <= 10 && product.quantity > 0 ? 'low-stock-row' : ''}>
                          <td>
                            <div className="product-name-cell">
                              <span className="product-name">{product.name}</span>
                              {product.description && (
                                <span className="product-desc">{product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''}</span>
                              )}
                            </div>
                          </td>
                          <td><span className="category-badge">{product.category}</span></td>
                          <td>
                            <span className={`qty-badge ${product.quantity <= 10 ? 'qty-low' : ''} ${product.quantity === 0 ? 'qty-zero' : ''}`}>
                              {product.quantity} {product.unit}
                            </span>
                          </td>
                          <td className="price-cell">{formatCurrency(product.price)}</td>
                          <td className="price-cell">{product.mrp ? formatCurrency(product.mrp) : '—'}</td>
                          <td><span className={`condition-badge condition-${product.condition}`}>{product.condition}</span></td>
                          <td>
                            <span className={`status-badge status-${product.status}`}>
                              {product.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(product)}>
                                <Pencil size={14} />
                              </button>
                              <button className="action-btn delete-btn" title="Delete" onClick={() => setDeleteConfirm(product.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Delete Confirmation */}
              {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                  <div className="delete-confirm-card" onClick={(e) => e.stopPropagation()}>
                    <AlertTriangle size={32} color="#dc2626" />
                    <h3>Delete Product?</h3>
                    <p>This action cannot be undone. The product will be permanently removed.</p>
                    <div className="delete-confirm-actions">
                      <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                      <button className="confirm-delete-btn" onClick={() => handleDeleteProduct(deleteConfirm)}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======== ORDERS TAB ======== */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              {ordersLoading ? (
                <div className="inventory-loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={40} />
                  <p>No orders yet. Once buyers place orders on your products, they will appear here.</p>
                </div>
              ) : (
                <div className="inventory-table-wrap">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Buyer</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>
                            <div className="product-name-cell">
                              <span className="product-name">{order.buyer_name}</span>
                              <span className="product-desc">{order.buyer_email}</span>
                            </div>
                          </td>
                          <td>
                            <div className="product-name-cell">
                              <span className="product-name">{order.products?.name || '—'}</span>
                              <span className="product-desc">{order.products?.category || ''}</span>
                            </div>
                          </td>
                          <td className="price-cell">{order.quantity} {order.products?.unit || ''}</td>
                          <td className="price-cell">{formatCurrency(order.total_price)}</td>
                          <td style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td>
                            <span className={`order-status-badge order-status-${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="order-status-select"
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ======== PROFILE TAB ======== */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="profile-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3>{profile?.full_name || 'User'}</h3>
                    <p className="profile-email">{user?.email}</p>
                    <span className="profile-role-badge">{profile?.role || 'seller'}</span>
                  </div>
                </div>

                {profileSuccess && (
                  <div className="profile-success">Profile updated successfully!</div>
                )}

                <form onSubmit={handleProfileSave} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={profileForm.full_name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        name="company"
                        value={profileForm.company}
                        onChange={handleProfileChange}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" value={profileForm.role} onChange={handleProfileChange}>
                        <option value="seller">Seller / Manufacturer</option>
                        <option value="buyer">Buyer / Retailer</option>
                        <option value="investor">Investor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user?.email || ''} disabled className="disabled-input" />
                    <span className="form-hint">Email cannot be changed</span>
                  </div>

                  <button type="submit" className="profile-save-btn" disabled={profileLoading}>
                    <Save size={16} />
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ======== ADD/EDIT PRODUCT MODAL ======== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && <div className="modal-error">{formError}</div>}

            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  placeholder="e.g. Cotton T-Shirts (500 pcs lot)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  placeholder="Brief description of the product, condition, etc."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={productForm.category} onChange={handleProductFormChange}>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select name="condition" value={productForm.condition} onChange={handleProductFormChange}>
                    {CONDITIONS.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row form-row-3">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={productForm.quantity}
                    onChange={handleProductFormChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select name="unit" value={productForm.unit} onChange={handleProductFormChange}>
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={productForm.status} onChange={handleProductFormChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    name="mrp"
                    value={productForm.mrp}
                    onChange={handleProductFormChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={formLoading}>
                  <Save size={16} />
                  {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
