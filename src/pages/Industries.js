import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import './Industries.css';

const industries = [
  {
    emoji: '🚗',
    title: 'Automobile',
    color: 'var(--primary)',
    bg: 'rgba(255,107,53,0.1)',
    desc: 'Manage spare parts, vehicle accessories, and after-market components with AI-driven demand forecasting.',
    products: ['Unsold spare parts', 'Vehicle accessories', 'Tyres & batteries', 'Auto components'],
    sellers: 'Auto part manufacturers, OEM suppliers',
    buyers: 'Repair shops, car dealerships, fleet operators',
    painPoint: '₹2,400 Cr tied up in unsold auto parts annually',
    solution: 'Match parts to regional repair shop networks via smart targeting',
  },
  {
    emoji: '👕',
    title: 'Textile & Apparel',
    color: 'var(--purple)',
    bg: 'rgba(124,58,237,0.1)',
    desc: 'Clear end-of-season clothing and surplus fabrics before they lose market value entirely.',
    products: ['End-of-season clothing', 'Surplus fabrics', 'Thread & accessories', 'Export surplus'],
    sellers: 'Garment exporters, fabric mills, fashion brands',
    buyers: 'Clothing retailers, boutiques, institutional buyers',
    painPoint: '₹3,100 Cr in fashion dead stock across India',
    solution: 'Season-aware pricing with regional buyer matching',
  },
  {
    emoji: '💊',
    title: 'Pharma & Healthcare',
    color: 'var(--accent)',
    bg: 'rgba(0,212,170,0.1)',
    desc: 'Safely manage near-expiry medical supplies and surplus pharmaceutical inventory with compliance-aware tools.',
    products: ['Medical supplies', 'Near-expiry inventory', 'Surgical equipment', 'OTC medicines'],
    sellers: 'Pharma distributors, medical manufacturers',
    buyers: 'Clinics, small hospitals, pharmacy chains',
    painPoint: 'Healthcare inventory waste estimated at ₹1,800 Cr/year',
    solution: 'Expiry-aware dynamic pricing with licensed buyer verification',
  },
  {
    emoji: '📱',
    title: 'Electronics',
    color: 'var(--blue)',
    bg: 'rgba(59,130,246,0.1)',
    desc: 'Clear phones, TVs, and appliances before newer models make them obsolete and unsellable.',
    products: ['Smartphones & tablets', 'TVs & appliances', 'Electronic components', 'B-grade products'],
    sellers: 'Consumer electronics brands, importers',
    buyers: 'Retailers, distributors, e-commerce sellers',
    painPoint: 'Electronics obsolescence costs brands ₹4,200 Cr annually',
    solution: 'Rapid matching with tier-2 & tier-3 market buyers',
  },
  {
    emoji: '🏗️',
    title: 'Construction',
    color: 'var(--yellow)',
    bg: 'rgba(255,209,102,0.1)',
    desc: 'Move excess cement, steel, tiles, and construction materials from completed projects.',
    products: ['Cement & concrete', 'Steel & iron', 'Tiles & stones', 'Plumbing & electrical'],
    sellers: 'Construction companies, material distributors',
    buyers: 'Contractors, builders, real estate firms',
    painPoint: 'Post-project material waste worth ₹2,700 Cr/year',
    solution: 'Project completion alerts trigger instant buyer matching',
  },
  {
    emoji: '🛒',
    title: 'FMCG & Grocery',
    color: 'var(--accent)',
    bg: 'rgba(0,212,170,0.1)',
    desc: 'Prevent waste and recover value from near-expiry dairy, packaged foods, and pulses.',
    products: ['Dairy products', 'Pulses & grains', 'Packaged foods', 'Beverages'],
    sellers: 'FMCG manufacturers, distributors',
    buyers: 'Retailers, restaurants, institutional kitchens',
    painPoint: 'FMCG waste costs Indian supply chains ₹5,000 Cr annually',
    solution: 'Shelf-life aware pricing with hyper-local buyer targeting',
  },
  {
    emoji: '⚙️',
    title: 'Manufacturing',
    color: 'var(--primary)',
    bg: 'rgba(255,107,53,0.1)',
    desc: 'Liquidate excess raw materials, chemicals, and metals to free up warehouse and working capital.',
    products: ['Raw materials', 'Chemicals', 'Metals & alloys', 'Industrial tools'],
    sellers: 'Factories, raw material traders',
    buyers: 'Other manufacturers, SMEs, industrial buyers',
    painPoint: 'Manufacturing overstock costing SMEs ₹6,500 Cr/year',
    solution: 'Industry-to-industry smart matching across sectors',
  },
  {
    emoji: '🍽️',
    title: 'Hospitality',
    color: 'var(--purple)',
    bg: 'rgba(124,58,237,0.1)',
    desc: 'Quickly liquidate kitchenware, catering inventory, and hospitality equipment.',
    products: ['Kitchenware', 'Catering supplies', 'Linen & uniforms', 'Furniture & fixtures'],
    sellers: 'Hotels, restaurants, catering companies',
    buyers: 'Event planners, new restaurants, caterers',
    painPoint: 'Restaurant closures generate ₹800 Cr in stranded assets',
    solution: 'Event & seasonal demand triggers instant buyer alerts',
  },
];

const Industries = () => {
  const [selected, setSelected] = useState(0);
  const ind = industries[selected];

  return (
    <div className="ind-page">
      {/* Hero */}
      <section className="ind-hero">
        <div className="glow-orb glow-orb-accent" style={{ width: '500px', height: '500px', top: '-100px', right: '-100px' }} />
        <div className="container">
          <div className="ind-hero-content">
            <p className="section-label">Industries</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Built for <span className="gradient-text">Every Industry</span>
            </h1>
            <p className="section-subtitle">
              Bulk Bazaar works across 8 major industry verticals, each with tailored AI models
              built to understand specific inventory behaviors and buyer patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Explorer */}
      <section className="section ind-explorer">
        <div className="container">
          <div className="ind-layout">
            {/* Sidebar */}
            <div className="ind-sidebar">
              {industries.map((i, idx) => (
                <button
                  key={idx}
                  className={`ind-tab ${selected === idx ? 'ind-tab-active' : ''}`}
                  onClick={() => setSelected(idx)}
                  style={{ '--tab-color': i.color }}
                >
                  <span className="ind-tab-emoji">{i.emoji}</span>
                  <span className="ind-tab-label">{i.title}</span>
                  <ChevronRight size={14} className="ind-tab-arrow" />
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="ind-detail" key={selected} style={{ '--ind-color': ind.color }}>
              <div className="ind-detail-header">
                <div className="ind-detail-emoji">{ind.emoji}</div>
                <div>
                  <h2 className="ind-detail-title">{ind.title}</h2>
                  <p className="ind-detail-desc">{ind.desc}</p>
                </div>
              </div>

              <div className="ind-pain-box">
                <div className="ind-pain-icon">⚠️</div>
                <div>
                  <div className="ind-pain-label">Industry Pain Point</div>
                  <div className="ind-pain-text">{ind.painPoint}</div>
                </div>
              </div>

              <div className="ind-grid-2">
                <div className="ind-card">
                  <h4>📦 Products Handled</h4>
                  <ul>
                    {ind.products.map((p, i) => (
                      <li key={i}>→ {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="ind-card">
                  <h4>🤝 Buyer–Seller Match</h4>
                  <div className="ind-match">
                    <div className="ind-match-side">
                      <div className="ind-match-label">Sellers</div>
                      <div className="ind-match-text">{ind.sellers}</div>
                    </div>
                    <div className="ind-match-arrow">→</div>
                    <div className="ind-match-side">
                      <div className="ind-match-label">Buyers</div>
                      <div className="ind-match-text">{ind.buyers}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ind-solution-box">
                <div className="ind-solution-badge">🧠 AI Solution</div>
                <p>{ind.solution}</p>
              </div>

              <Link to="/contact" className="btn-primary" style={{ width: 'fit-content' }}>
                List Your {ind.title} Inventory <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm ind-cta">
        <div className="container">
          <div className="ind-cta-box">
            <h2>Your Industry, Our Platform</h2>
            <p>No matter the sector, Bulk Bazaar has the AI intelligence to match your inventory with the right buyers.</p>
            <Link to="/contact" className="btn-accent">
              Register as Seller <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industries;
