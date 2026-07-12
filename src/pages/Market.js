import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, TrendingUp, Target, Globe } from 'lucide-react';
import './Market.css';

const Stat = ({ value, suffix, prefix, label, desc, color }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="market-stat-card card">
      <div className="mstat-value" style={{ color: color || 'var(--primary)' }}>
        {prefix}{inView ? <CountUp end={value} duration={2} separator="," /> : '0'}{suffix}
      </div>
      <div className="mstat-label">{label}</div>
      <div className="mstat-desc">{desc}</div>
    </div>
  );
};

const Market = () => {
  return (
    <div className="market-page">
      {/* Hero */}
      <section className="market-hero">
        <div className="glow-orb glow-orb-accent" style={{ width: '400px', height: '400px', top: '-80px', right: '10%' }} />
        <div className="container">
          <div className="market-hero-content">
            <p className="section-label">Market Opportunity</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              A <span className="gradient-text">$60 Billion</span><br />
              Opportunity Awaits
            </h1>
            <p className="section-subtitle">
              India's B2B e-commerce market is at an inflection point. With 63 million MSMEs
              and only a fraction operating digitally, Bulk Bazaar arrives at exactly the right time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section market-stats">
        <div className="container">
          <div className="grid-3">
            <Stat value={63} suffix="M" prefix="" label="MSMEs in India" desc="The target seller base for Bulk Bazaar's platform" color="var(--primary)" />
            <Stat value={30} suffix="%" prefix="" label="GDP Contribution" desc="MSMEs represent a massive share of India's economy" color="var(--accent)" />
            <Stat value={60} suffix="B" prefix="$" label="B2B Market by 2025" desc="Projected size of India's B2B e-commerce market" color="var(--blue)" />
          </div>
        </div>
      </section>

      {/* TAM SAM SOM */}
      <section className="section tam-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-label">Market Sizing</p>
            <h2 className="section-title">TAM · SAM · <span className="gradient-text-accent">SOM</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A clear path from total addressable market to our 3-year capture target.
            </p>
          </div>

          <div className="tam-funnel">
            <div className="tam-card tam-tam">
              <div className="tam-label">TAM</div>
              <div className="tam-name">Total Addressable Market</div>
              <div className="tam-value">$60 Billion</div>
              <div className="tam-desc">India's entire B2B e-commerce market by 2025</div>
              <div className="tam-bar" style={{ width: '100%' }} />
            </div>
            <div className="tam-arrow">▼</div>
            <div className="tam-card tam-sam">
              <div className="tam-label">SAM</div>
              <div className="tam-name">Serviceable Addressable Market</div>
              <div className="tam-value">$5–6 Billion</div>
              <div className="tam-desc">Inventory-heavy sectors: Auto, Pharma, FMCG, Electronics, Textile</div>
              <div className="tam-bar" style={{ width: '12%' }} />
            </div>
            <div className="tam-arrow">▼</div>
            <div className="tam-card tam-som">
              <div className="tam-label">SOM</div>
              <div className="tam-name">Serviceable Obtainable Market (3-Year)</div>
              <div className="tam-value">$250–600M GMV</div>
              <div className="tam-desc">5–10% of SAM, captured through AI-powered matching and onboarding</div>
              <div className="tam-bar" style={{ width: '5%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Growth Projections */}
      <section className="section market-growth">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-label">Growth Projections</p>
            <h2 className="section-title">3-Year <span className="gradient-text">Roadmap</span></h2>
          </div>

          <div className="growth-table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Milestone</th>
                  <th>Year 1</th>
                  <th>Year 2</th>
                  <th>Year 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Businesses Onboarded</td>
                  <td><span className="table-badge table-badge-1">5,000</span></td>
                  <td><span className="table-badge table-badge-2">30,000</span></td>
                  <td><span className="table-badge table-badge-3">1,50,000</span></td>
                </tr>
                <tr>
                  <td>Gross Merchandise Value</td>
                  <td>₹100 Crore</td>
                  <td>₹500 Crore</td>
                  <td>₹1,500–2,000 Crore</td>
                </tr>
                <tr>
                  <td>Revenue (2% Commission)</td>
                  <td>₹2 Crore</td>
                  <td>₹10 Crore</td>
                  <td>₹30–40 Crore</td>
                </tr>
                <tr>
                  <td>Industries Covered</td>
                  <td>3 sectors</td>
                  <td>6 sectors</td>
                  <td>8+ sectors</td>
                </tr>
                <tr>
                  <td>Cities Present</td>
                  <td>10 Pilot Cities</td>
                  <td>50+ Cities</td>
                  <td>Pan-India</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Year cards */}
          <div className="year-cards">
            {[
              {
                year: 'Year 1', icon: '🌱', color: 'var(--accent)',
                items: ['Launch in 10 pilot cities', 'Onboard 5,000 businesses', 'Focus: Pharma, FMCG, Textile', '₹100 Cr GMV target', 'MSME training programs'],
              },
              {
                year: 'Year 2', icon: '🚀', color: 'var(--primary)',
                items: ['Expand to 50+ cities', 'Scale to 30,000 businesses', 'Add 3 more sectors', '₹500 Cr GMV target', 'Logistics partnerships'],
              },
              {
                year: 'Year 3', icon: '🌍', color: 'var(--purple)',
                items: ['Pan-India coverage', '1.5 Lakh businesses', '8+ industry verticals', '₹2,000 Cr GMV target', 'SE Asia expansion'],
              },
            ].map((y, i) => (
              <div key={i} className="year-card card" style={{ '--yc': y.color }}>
                <div className="yc-header">
                  <span className="yc-icon">{y.icon}</span>
                  <span className="yc-year">{y.year}</span>
                </div>
                <ul className="yc-list">
                  {y.items.map((item, j) => (
                    <li key={j}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="section challenges-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="section-label">Risk Mitigation</p>
            <h2 className="section-title">Challenges & <span className="gradient-text">Solutions</span></h2>
          </div>
          <div className="challenges-grid">
            {[
              { challenge: 'MSMEs not digitally active', solution: 'Local pilot programs, training workshops, and multilingual onboarding support', icon: '📱' },
              { challenge: 'Trust issues between parties', solution: 'Verified profiles, buyer/seller ratings, escrow payments, and dispute resolution', icon: '🔒' },
              { challenge: 'Logistics complexity', solution: 'Partnerships with major shipping providers: Delhivery, Ecom Express, DTDC', icon: '🚚' },
              { challenge: 'Competition from incumbents', solution: 'AI-powered dead stock intelligence — no other platform offers this niche capability', icon: '🧠' },
            ].map((c, i) => (
              <div key={i} className="challenge-card card">
                <div className="ch-icon">{c.icon}</div>
                <div className="ch-challenge">
                  <div className="ch-label">Challenge</div>
                  <div className="ch-text">{c.challenge}</div>
                </div>
                <div className="ch-arrow">→</div>
                <div className="ch-solution">
                  <div className="ch-label">Solution</div>
                  <div className="ch-text solution-text">{c.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="market-cta card" style={{ textAlign: 'center' }}>
            <Globe size={40} color="var(--accent)" style={{ margin: '0 auto' }} />
            <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Be Part of the Revolution</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
              India's B2B commerce is moving online. Position your business at the forefront with Bulk Bazaar.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
              <Link to="/contact" className="btn-primary">Join Waitlist <ArrowRight size={16} /></Link>
              <Link to="/pricing" className="btn-secondary">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Market;
