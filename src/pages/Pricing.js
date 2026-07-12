import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, ArrowRight, Zap } from 'lucide-react';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    tag: 'Free to sell',
    price: 0,
    priceSuffix: '/month',
    desc: 'Perfect for MSMEs getting started with digital inventory liquidation.',
    color: 'var(--text-secondary)',
    border: 'var(--border)',
    features: [
      'List up to 50 products',
      'Basic buyer matching',
      '2% commission per sale',
      'Basic analytics dashboard',
      'Email support',
      'Standard listing visibility',
      null,
      null,
    ],
    cta: 'Start Free',
    ctaClass: 'btn-secondary',
  },
  {
    name: 'Growth',
    tag: 'Most Popular',
    price: 2999,
    priceSuffix: '/month',
    desc: 'For growing businesses ready to accelerate inventory clearance.',
    color: 'var(--primary)',
    border: 'var(--primary)',
    highlighted: true,
    features: [
      'Unlimited product listings',
      'AI-powered smart matching',
      '1.5% commission per sale',
      'Advanced analytics & reports',
      'Priority buyer notifications',
      'Dynamic pricing suggestions',
      'Dedicated account manager',
      'Featured listing (2/month)',
    ],
    cta: 'Start Growth',
    ctaClass: 'btn-primary',
  },
  {
    name: 'Enterprise',
    tag: 'Custom',
    price: null,
    priceSuffix: '',
    desc: 'For large manufacturers and distributors with complex inventory needs.',
    color: 'var(--accent)',
    border: 'var(--accent)',
    features: [
      'Everything in Growth',
      'Custom AI model training',
      'API integration',
      'White-label dashboard option',
      'Bulk upload & automation',
      'Dedicated logistics support',
      'Custom commission structure',
      'SLA & compliance support',
    ],
    cta: 'Contact Sales',
    ctaClass: 'btn-accent',
  },
];

const faq = [
  { q: 'Is there a cost to list products on Bulk Bazaar?', a: 'No! Listing products is completely free. We only charge a 2% commission on successful transactions.' },
  { q: 'How does the commission model work?', a: 'For every successful sale on the platform, Bulk Bazaar takes a 2% commission on the transaction value. Growth plan sellers pay 1.5%.' },
  { q: 'What is included in Premium Subscriptions?', a: 'Premium plans include advanced inventory analytics, AI demand forecasting reports, priority buyer matching, and dedicated support — driving 10-20% additional revenue for sellers.' },
  { q: 'Can buyers use Bulk Bazaar for free?', a: 'Yes, buyers can search, browse, and place orders completely free. No subscription required.' },
  { q: 'Is there a minimum order quantity?', a: 'Sellers set their own MOQs. The platform supports bulk orders starting from as low as 10 units.' },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <div className="glow-orb glow-orb-primary" style={{ width: '400px', height: '400px', top: '-100px', left: '5%' }} />
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <p className="section-label">Pricing</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              We Win When <span className="gradient-text">You Win</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              No hidden fees. No upfront costs. Pay only when you close a deal.
              Premium plans unlock the full power of AI for faster inventory clearance.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`plan-card ${plan.highlighted ? 'plan-highlighted' : ''}`}
                style={{ '--plan-color': plan.color, '--plan-border': plan.border }}
              >
                {plan.highlighted && (
                  <div className="plan-popular-badge">
                    <Zap size={12} /> Most Popular
                  </div>
                )}

                <div className="plan-header">
                  <div className="plan-tag">{plan.tag}</div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.desc}</p>
                </div>

                <div className="plan-price">
                  {plan.price !== null ? (
                    <>
                      <span className="plan-currency">₹</span>
                      <span className="plan-amount">{plan.price.toLocaleString()}</span>
                      <span className="plan-period">{plan.priceSuffix}</span>
                    </>
                  ) : (
                    <span className="plan-custom">Custom</span>
                  )}
                </div>

                <ul className="plan-features">
                  {plan.features.map((feat, j) => (
                    <li key={j} className={feat ? '' : 'plan-feat-disabled'}>
                      {feat ? (
                        <CheckCircle2 size={15} color={plan.color} />
                      ) : (
                        <X size={15} color="var(--text-muted)" />
                      )}
                      <span>{feat || 'Not included'}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className={plan.ctaClass} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Model */}
      <section className="section commission-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="section-label">Commission Model</p>
            <h2 className="section-title"><span className="gradient-text">2%</span> That Works For You</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Our success is tied to yours. We only earn when you sell.
            </p>
          </div>
          <div className="commission-grid">
            {[
              { label: 'Transaction Value', example: '₹10,00,000', icon: '💼' },
              { label: 'BulkBazaar Commission', example: '₹20,000 (2%)', icon: '📊' },
              { label: 'You Keep', example: '₹9,80,000 (98%)', icon: '💰', highlight: true },
            ].map((c, i) => (
              <div key={i} className={`commission-card card ${c.highlight ? 'commission-highlight' : ''}`}>
                <div className="comm-icon">{c.icon}</div>
                <div className="comm-label">{c.label}</div>
                <div className={`comm-value ${c.highlight ? 'comm-value-accent' : ''}`}>{c.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Common <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="faq-list">
            {faq.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
