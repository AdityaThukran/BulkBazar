import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Industries', path: '/industries' },
    { label: 'Market', path: '/market' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <ShoppingCart size={18} />
          </div>
          <span className="logo-text">
            Bulk<span className="logo-accent">Bazaar</span>
          </span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/contact" className="btn-secondary nav-btn-login" style={{ padding: '9px 18px', fontSize: '14px' }}>
            Log In
          </Link>
          <Link to="/contact" className="btn-nav-cta" style={{ padding: '9px 22px', fontSize: '14px' }}>
            Get Started →
          </Link>
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="navbar-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-link ${location.pathname === link.path ? 'mobile-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-actions">
            <button className="theme-toggle-mobile" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <>
                  <Sun size={16} /> <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} /> <span>Dark Mode</span>
                </>
              )}
            </button>
            <Link to="/contact" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Log In
            </Link>
            <Link to="/contact" className="btn-nav-cta" style={{ width: '100%', justifyContent: 'center' }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
