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
              <a href="#" className="social-btn"><Twitter size={16} /></a>
              <a href="#" className="social-btn"><Linkedin size={16} /></a>
              <a href="mailto:hello@bulkbazaar.in" className="social-btn"><Mail size={16} /></a>
            </div>
            <div className="footer-badge">
              🏆 MSME Idea Hackathon 6.0 — Industry 4.0 & 5.0
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
              <li><a href="#">Demand Forecasting</a></li>
              <li><a href="#">Dead Stock ID</a></li>
              <li><a href="#">Smart Matching</a></li>
              <li><a href="#">Dynamic Pricing</a></li>
              <li><a href="#">Inventory Engine</a></li>
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
                <span>+91 98765 43210</span>
              </li>
              <li>
                <MapPin size={14} />
                <span>India — MSME Hackathon 6.0</span>
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
          <p>© 2025 BulkBazaar. All rights reserved. | Submitted under MSME Idea Hackathon 6.0</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
