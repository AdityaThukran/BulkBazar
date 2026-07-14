import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Invalid email or password. Please try again.'
        : err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrap">
              <LogIn size={24} />
            </div>
            <h1>Welcome Back</h1>
            <p>Log in to your BulkBazaar dashboard</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {!showReset ? (
            <>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="login-email">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">
                    <Lock size={14} /> Password
                  </label>
                  <div className="password-input-wrap">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
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

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => { setShowReset(true); setResetEmail(form.email); setError(''); }}
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup">Sign up free</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {resetSent ? (
                <div className="reset-success">
                  <p>Password reset link sent! Check your email inbox.</p>
                  <button
                    className="login-submit-btn"
                    onClick={() => { setShowReset(false); setResetSent(false); }}
                  >
                    Back to Login <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="login-form">
                  <p className="reset-desc">Enter your email and we'll send you a link to reset your password.</p>
                  <div className="form-group">
                    <label htmlFor="reset-email">
                      <Mail size={14} /> Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <button type="submit" className="login-submit-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    {!loading && <ArrowRight size={16} />}
                  </button>

                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => { setShowReset(false); setError(''); }}
                    style={{ marginTop: '12px' }}
                  >
                    Back to login
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
