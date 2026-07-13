import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, X as Twitter, Globe as Linkedin, Mail, ArrowRight, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <Zap size={18} />
              </div>
              <span className="logo-text">Bulk<span className="logo-accent">Bazaar</span></span>
            </Link>
            <p className="footer-tagline">
              AI-Powered Dead Stock Revival & Smart Procurement Platform — transforming India's wholesale ecosystem.
            </p>
            <div className="footer-socials">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-btn"><Twitter size={16} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn"><Linkedin size={16} /></a>
              <a href="mailto:hello@bulkbazaar.in" className="social-btn"><Mail size={16} /></a>
            </div>
            <div className="footer-badge">
              🏆 VentureX — Industry 4.0 & 5.0
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/industries">Industries</Link></li>
              <li><Link to="/market">Market Opportunity</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>AI Features</h4>
            <ul>
              <li><Link to="/how-it-works">Demand Forecasting</Link></li>
              <li><Link to="/how-it-works">Dead Stock ID</Link></li>
              <li><Link to="/how-it-works">Smart Matching</Link></li>
              <li><Link to="/how-it-works">Dynamic Pricing</Link></li>
              <li><Link to="/how-it-works">Inventory Engine</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li>
                <Mail size={14} />
                <span>hello@bulkbazaar.in</span>
              </li>
              <li>
                <Phone size={14} />
                <span>000-000-0000</span>
              </li>
              <li>
                <MapPin size={14} />
                <span>India — VentureX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-cta">
          <h3>Ready to Revive Your Dead Stock?</h3>
          <p>Join thousands of businesses recovering capital through AI-powered inventory intelligence.</p>
          <div className="footer-cta-actions">
            <Link to="/contact" className="btn-primary">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/how-it-works" className="btn-secondary">
              See How It Works
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 BulkBazaar. All rights reserved. | Submitted under VentureX | Design inspired by{' '}
            <a href="https://karolbinkow.ski/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>
              karolbinkow.ski
            </a>
          </p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
