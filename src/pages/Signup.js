import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Phone, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'seller',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        company: form.company,
        role: form.role,
        phone: form.phone,
      });
      navigate('/dashboard');
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon-wrap">
              <UserPlus size={24} />
            </div>
            <h1>Create Account</h1>
            <p>Join BulkBazaar and start managing your inventory</p>
          </div>

          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-name">
                  <User size={14} /> Full Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-company">
                  <Building2 size={14} /> Company
                </label>
                <input
                  id="signup-company"
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={form.company}
                  onChange={handleChange}
                  autoComplete="organization"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">
                <Mail size={14} /> Email *
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-password">
                  <Lock size={14} /> Password *
                </label>
                <div className="password-input-wrap">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm">
                  <Lock size={14} /> Confirm Password *
                </label>
                <input
                  id="signup-confirm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-role">
                  <User size={14} /> Role *
                </label>
                <select
                  id="signup-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="seller">Seller / Manufacturer</option>
                  <option value="buyer">Buyer / Retailer</option>
                  <option value="investor">Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="signup-phone">
                  <Phone size={14} /> Phone
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            <button
              type="submit"
              className="signup-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
