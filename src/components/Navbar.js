import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <Link to="/contact" className="btn-secondary nav-btn-login" style={{ padding: '9px 18px', fontSize: '14px' }}>
            Log In
          </Link>
          <Link to="/contact" className="btn-nav-cta" style={{ padding: '9px 22px', fontSize: '14px' }}>
            <span className="nav-cta-icon"><ShoppingCart size={14} /></span>
            Get Started
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
            <Link to="/contact" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Log In
            </Link>
            <Link to="/contact" className="btn-nav-cta" style={{ width: '100%', justifyContent: 'center' }}>
              <span className="nav-cta-icon"><ShoppingCart size={14} /></span> Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
