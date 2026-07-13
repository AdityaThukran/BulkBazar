import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, Brain, PackageSearch, Users, BarChart, ShoppingCart,
  HeadphonesIcon, ArrowRight, ArrowDown, CheckCircle2, Zap
} from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <Upload size={28} />,
    step: '01',
    title: 'Inventory Upload',
    color: 'var(--primary)',
    bg: 'rgba(255,107,53,0.12)',
    details: [
      'Manufacturers, wholesalers, and distributors log in to the platform',
      'Upload product details: name, category, SKU, images',
      'Enter quantity, price expectations, and stock age',
      'Set minimum order quantities and shipping preferences',
    ],
    timeline: '< 5 minutes',
  },
  {
    icon: <Brain size={28} />,
    step: '02',
    title: 'AI Analysis Layer',
    color: 'var(--accent)',
    bg: 'rgba(0,212,170,0.12)',
    details: [
      'AI engine scans product movement history and trends',
      'Cross-references with regional sales data and buyer patterns',
      'Analyzes inventory health and aging metrics',
      'Generates a comprehensive inventory health score',
    ],
    timeline: 'Instant',
  },
  {
    icon: <PackageSearch size={28} />,
    step: '03',
    title: 'Dead Stock Identification',
    color: 'var(--purple)',
    bg: 'rgba(124,58,237,0.12)',
    details: [
      'Platform automatically flags unsold products',
      'Categorizes inventory: slow-moving, dead stock, overstocked',
      'Sends alerts to sellers with actionable recommendations',
      'Prioritizes liquidation based on age and capital locked',
    ],
    timeline: 'Real-time',
  },
  {
    icon: <BarChart size={28} />,
    step: '04',
    title: 'Demand Forecasting',
    color: 'var(--blue)',
    bg: 'rgba(59,130,246,0.12)',
    details: [
      'AI predicts future demand across product categories',
      'Analyzes seasonal trends and regional requirements',
      'Forecasts price movement and market demand windows',
      'Provides 30/60/90 day procurement outlook for buyers',
    ],
    timeline: 'Daily updates',
  },
  {
    icon: <Users size={28} />,
    step: '05',
    title: 'Smart Matching',
    color: 'var(--accent)',
    bg: 'rgba(0,212,170,0.12)',
    details: [
      'Platform matches products to the most relevant buyers',
      'Spare parts → repair shops; Fabrics → clothing retailers',
      'Medical supplies → clinics; FMCG → local distributors',
      'Sends personalized recommendations via email & dashboard',
    ],
    timeline: 'Auto-triggered',
  },
  {
    icon: <Zap size={28} />,
    step: '06',
    title: 'Dynamic Pricing',
    color: 'var(--yellow)',
    bg: 'rgba(255,209,102,0.12)',
    details: [
      'AI suggests optimal discount percentages for fast clearance',
      'Balances urgency of liquidation with profit maximization',
      'Competitive pricing benchmarked against market rates',
      'Real-time price adjustments based on demand signals',
    ],
    timeline: 'AI-driven',
  },
  {
    icon: <ShoppingCart size={28} />,
    step: '07',
    title: 'Order Processing',
    color: 'var(--primary)',
    bg: 'rgba(255,107,53,0.12)',
    details: [
      'Bulk order placement with one-click checkout',
      'Automated invoice generation and GST compliance',
      'Integrated payment gateway with escrow protection',
      'Real-time shipment tracking and delivery updates',
    ],
    timeline: '< 24 hours',
  },
  {
    icon: <HeadphonesIcon size={28} />,
    step: '08',
    title: 'After-Sales Support',
    color: 'var(--purple)',
    bg: 'rgba(124,58,237,0.12)',
    details: [
      '24/7 customer support via chat, email, and phone',
      'Hassle-free returns and refund processing',
      'Dispute resolution with neutral arbitration',
      'Post-delivery feedback and ratings system',
    ],
    timeline: '24/7',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="hiw-page">
      {/* Hero */}
      <section className="hiw-hero">
        <div className="glow-orb glow-orb-primary" style={{ width: '400px', height: '400px', top: '-100px', right: '10%' }} />
        <div className="container">
          <div className="hiw-hero-content">
            <p className="section-label">How It Works</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              From Idle Stock to<br /><span className="gradient-text">Active Revenue</span>
            </h1>
            <p className="section-subtitle">
              A streamlined 8-step AI-powered process that transforms unsold inventory
              into recovered business capital — in days, not months.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">Get Started <ArrowRight size={16} /></Link>
              <Link to="/pricing" className="btn-secondary">See Plans</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section hiw-steps-section">
        <div className="container">
          <div className="hiw-steps">
            {steps.map((step, i) => (
              <div key={i} className={`hiw-step-wrapper ${i % 2 === 1 ? 'hiw-step-right' : ''}`}>
                <div
                  className={`hiw-step-card ${activeStep === i ? 'hiw-step-active' : ''}`}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  style={{ '--s-color': step.color, '--s-bg': step.bg }}
                >
                  <div className="hiw-step-header">
                    <div className="hiw-step-num">{step.step}</div>
                    <div className="hiw-step-icon-wrap">
                      {step.icon}
                    </div>
                    <div className="hiw-step-info">
                      <h3 className="hiw-step-title">{step.title}</h3>
                      <span className="hiw-step-timeline">{step.timeline}</span>
                    </div>
                  </div>

                  {activeStep === i && (
                    <div className="hiw-step-details">
                      {step.details.map((d, j) => (
                        <div key={j} className="hiw-step-detail">
                          <CheckCircle2 size={14} color={step.color} />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {i < steps.length - 1 && (
                  <div className="hiw-step-connector">
                    <ArrowDown size={20} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section className="section hiw-features-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-label">Platform Features</p>
            <h2 className="section-title"><span className="gradient-text">Everything</span> You Need</h2>
          </div>
          <div className="hiw-features-grid">
            {[
              { title: 'Marketplace', icon: '🛒', items: ['Verified buyers & sellers', 'Real-time product listings', 'Secure transactions', 'Ratings & reviews'] },
              { title: 'Operations', icon: '⚙️', items: ['Order management', 'Payment gateway', 'Logistics integration', 'Delivery tracking'] },
              { title: 'AI Engine', icon: '🧠', items: ['Demand forecasting', 'Smart matching', 'Dynamic pricing', 'Dead stock detection'] },
              { title: 'Intelligence', icon: '📊', items: ['Inventory analytics', 'Stock health monitoring', 'Procurement insights', 'Market reports'] },
            ].map((f, i) => (
              <div key={i} className="hiw-feature-card card">
                <div className="hiw-feat-icon">{f.icon}</div>
                <h3 className="hiw-feat-title">{f.title}</h3>
                <ul className="hiw-feat-list">
                  {f.items.map((item, j) => (
                    <li key={j}>
                      <CheckCircle2 size={14} color="var(--accent)" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm hiw-cta">
        <div className="container">
          <div className="hiw-cta-box">
            <h2>Ready to Get Started?</h2>
            <p>Join now and start converting your dead stock into revenue in just minutes.</p>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '15px' }}>
              Start Free Today <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
