import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight, Brain, TrendingUp, Users,
  Layers, Repeat, CheckCircle2,
  PackageSearch, BarChart, ChevronRight,
  ShoppingCart, Truck, Zap, Star,
  Building2, Activity, TrendingDown, AlertCircle
} from 'lucide-react';
import './Home.css';

const StatCard = ({ value, suffix, label, prefix }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="stat-card">
      <div className="stat-value">
        {prefix && <span className="stat-prefix">{prefix}</span>}
        {inView ? <CountUp end={value} duration={2.5} separator="," /> : '0'}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const aiFeatures = [
    {
      icon: <TrendingUp size={26} />,
      title: 'Demand Forecasting',
      desc: 'Predicts future demand trends and product movement across regions using advanced ML models.',
      color: '#f15a24',
      bg: 'rgba(241,90,36,0.08)',
      tag: 'AI Powered',
      stat: '94% accuracy',
    },
    {
      icon: <PackageSearch size={26} />,
      title: 'Dead Stock ID',
      desc: 'Identifies slow-moving and unsold inventory before it becomes a liability to your business.',
      color: '#00b894',
      bg: 'rgba(0,184,148,0.08)',
      tag: 'Real-time',
      stat: '3× faster detection',
    },
    {
      icon: <Users size={26} />,
      title: 'Smart Matching',
      desc: 'Matches products with the most qualified buyers — spare parts to repair shops, fabrics to retailers.',
      color: '#6c5ce7',
      bg: 'rgba(108,92,231,0.08)',
      tag: 'Auto-Match',
      stat: '89% match rate',
    },
    {
      icon: <BarChart size={26} />,
      title: 'Dynamic Pricing',
      desc: 'Suggests optimal prices that maximize clearance speed while preserving your profit margins.',
      color: '#f6a623',
      bg: 'rgba(246,166,35,0.08)',
      tag: 'Profit-Max',
      stat: '32% better recovery',
    },
  ];

  const problemPoints = [
    { icon: <AlertCircle size={16} />, text: 'Blocked working capital in unsold stock', severity: 'high' },
    { icon: <TrendingDown size={16} />, text: 'Rising warehouse & storage costs', severity: 'high' },
    { icon: <Activity size={16} />, text: 'Products losing value day by day', severity: 'med' },
    { icon: <Building2 size={16} />, text: 'Buyers can\'t find reliable suppliers', severity: 'med' },
    { icon: <AlertCircle size={16} />, text: 'Small businesses paying inflated prices', severity: 'low' },
    { icon: <Zap size={16} />, text: 'Procurement remains deeply inefficient', severity: 'low' },
  ];

  const outcomes = [
    { icon: '💰', title: 'Revive Dead Stock', desc: 'Turn unsold inventory into revenue instead of warehouse waste.' },
    { icon: '📈', title: 'Improve Cash Flow', desc: 'Release blocked working capital and reinvest in your business.' },
    { icon: '🎯', title: 'Smarter Procurement', desc: 'Buyers access quality products at competitive AI-priced rates.' },
    { icon: '🤝', title: 'Stronger Network', desc: 'Build verified supplier-buyer relationships with trust & transparency.' },
    { icon: '♻️', title: 'Reduce Waste', desc: 'Drive sustainability by minimizing industrial inventory waste.' },
    { icon: '📊', title: 'Data Insights', desc: 'Make decisions backed by inventory analytics, not guesswork.' },
  ];

  const industries = [
    { emoji: '🚗', label: 'Automobile' },
    { emoji: '👕', label: 'Textile' },
    { emoji: '💊', label: 'Pharma' },
    { emoji: '📱', label: 'Electronics' },
    { emoji: '🏗️', label: 'Construction' },
    { emoji: '🛒', label: 'FMCG' },
    { emoji: '⚙️', label: 'Manufacturing' },
    { emoji: '🍽️', label: 'Hospitality' },
  ];

  const tickerItems = [
    '🏭 Spare Parts → 12 Repair Shops matched in 6 min',
    '📦 Textile overstock recovered ₹18L in 3 days',
    '💊 Pharma near-expiry cleared at 40% margin',
    '🚗 Auto parts matched across 8 cities instantly',
    '🛒 FMCG slow movers found buyers in 24 hrs',
    '📱 Electronics stock recovered 65% of book value',
    '🏗️ Construction materials moved in 2 days',
  ];

  return (
    <div className="home">

      {/* ── TICKER ── */}
      <div className="ticker-bar">
        <div className="ticker-label"><Zap size={12} /> LIVE</div>
        <div
          className={`ticker-track ${tickerPaused ? 'ticker-paused' : ''}`}
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
        >
          <div className="ticker-content">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="ticker-item">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-dots" />
        <div className="hero-gradient-orb hero-orb-1" />
        <div className="hero-gradient-orb hero-orb-2" />
        <div className="hero-gradient-orb hero-orb-3" />

        <div className="container">
          <div className="hero-layout">

            {/* Left */}
            <div className="hero-left">
              <div className="hero-badges">
                <span className="hero-badge hero-badge-gold">
                  <Star size={12} fill="currentColor" /> spartaX
                </span>
                <span className="hero-badge hero-badge-teal">
                  Industry 4.0 & 5.0
                </span>
              </div>

              <h1 className="hero-title">
                Turn{' '}
                <span className="hero-gradient-word">Dead Stock</span>
                <br />
                Into Business<br />
                <span className="hero-teal-word">Opportunity</span>
              </h1>

              <p className="hero-desc">
                India's first AI-powered B2B marketplace that identifies unsold inventory,
                forecasts demand, smart-matches buyers, and dynamically prices products —
                so your stock <strong>never goes to waste again.</strong>
              </p>

              <div className="hero-actions">
                <Link to="/contact" className="btn-truck hero-btn-primary">
                  <span className="btn-icon-truck"><Truck size={18} /></span>
                  Start For Free
                </Link>
                <Link to="/how-it-works" className="hero-btn-outline">
                  <span className="btn-icon-cart"><ShoppingCart size={15} /></span>
                  See How It Works
                </Link>
              </div>

              {/* Mini trust strip */}
              <div className="hero-trust">
                <div className="trust-avatars">
                  {['M', 'W', 'D', 'R', 'S'].map((l, i) => (
                    <div key={i} className="trust-av" style={{ '--i': i }}>{l}</div>
                  ))}
                </div>
                <div className="trust-info">
                  <div className="trust-rating">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#f6a623" color="#f6a623" />)}
                    <span>4.9/5</span>
                  </div>
                  <div className="trust-text"><strong>5,000+</strong> businesses joining Year 1</div>
                </div>
              </div>

              {/* Hero quick stats */}
              <div className="hero-quick-stats">
                <div className="hqs-item">
                  <span className="hqs-val">₹12K Cr</span>
                  <span className="hqs-label">Dead stock annually</span>
                </div>
                <div className="hqs-div" />
                <div className="hqs-item">
                  <span className="hqs-val">63M+</span>
                  <span className="hqs-label">MSMEs in India</span>
                </div>
                <div className="hqs-div" />
                <div className="hqs-item">
                  <span className="hqs-val">2%</span>
                  <span className="hqs-label">Commission only</span>
                </div>
              </div>
            </div>

            {/* Right — dashboard card */}
            <div className="hero-right">
              <div className="hero-dashboard">
                <div className="hd-header">
                  <div className="hd-dots">
                    <span className="hd-dot red" />
                    <span className="hd-dot yellow" />
                    <span className="hd-dot green" />
                  </div>
                  <span className="hd-title">Inventory Intelligence Dashboard</span>
                  <span className="hd-live"><span className="hd-pulse" />Live</span>
                </div>

                <div className="hd-stats-row">
                  {[
                    { label: 'Dead Stock', value: '₹42.8L', change: '+127 items', up: false },
                    { label: 'Matched Buyers', value: '89', change: '+23 new', up: true },
                    { label: 'Revenue', value: '₹18.2L', change: '+42%', up: true },
                  ].map((s, i) => (
                    <div key={i} className="hd-stat">
                      <div className="hd-stat-label">{s.label}</div>
                      <div className="hd-stat-val">{s.value}</div>
                      <div className={`hd-stat-change ${s.up ? 'hd-up' : 'hd-down'}`}>{s.change}</div>
                    </div>
                  ))}
                </div>

                <div className="hd-chart">
                  <div className="hd-chart-label">Weekly Recovery</div>
                  <div className="hd-bars">
                    {[
                      { h: 55, day: 'Mon' },
                      { h: 40, day: 'Tue' },
                      { h: 70, day: 'Wed' },
                      { h: 48, day: 'Thu' },
                      { h: 85, day: 'Fri' },
                      { h: 68, day: 'Sat' },
                      { h: 92, day: 'Sun' },
                    ].map((b, i) => (
                      <div key={i} className="hd-bar-wrap">
                        <div
                          className="hd-bar"
                          style={{ height: `${b.h}%`, animationDelay: `${i * 0.12}s` }}
                        />
                        <span className="hd-bar-day">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hd-matches">
                  <div className="hd-match-label">Recent AI Matches</div>
                  {[
                    { from: 'Spare parts (Auto)', to: '12 repair shops', tag: '🚗', pct: 94 },
                    { from: 'Cotton fabric surplus', to: '8 garment units', tag: '👕', pct: 87 },
                  ].map((m, i) => (
                    <div key={i} className="hd-match-row">
                      <span className="hd-match-tag">{m.tag}</span>
                      <div className="hd-match-info">
                        <div className="hd-match-text">{m.from} → {m.to}</div>
                        <div className="hd-match-bar-bg">
                          <div className="hd-match-bar-fill" style={{ width: `${m.pct}%`, animationDelay: `${i * 0.2}s` }} />
                        </div>
                      </div>
                      <span className="hd-match-pct">{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification cards */}
              <div className="hero-notif hero-notif-1">
                <div className="notif-icon notif-green"><Brain size={14} /></div>
                <div>
                  <div className="notif-title">AI Match Found!</div>
                  <div className="notif-desc">Spare parts → 12 repair shops</div>
                </div>
                <div className="notif-badge notif-new">NEW</div>
              </div>

              <div className="hero-notif hero-notif-2">
                <div className="notif-icon notif-orange"><TrendingUp size={14} /></div>
                <div>
                  <div className="notif-title">Price Optimized</div>
                  <div className="notif-desc">Save 32% vs market rate</div>
                </div>
              </div>

              <div className="hero-notif hero-notif-3">
                <div className="notif-icon notif-purple"><CheckCircle2 size={14} /></div>
                <div>
                  <div className="notif-title">Deal Closed 🎉</div>
                  <div className="notif-desc">₹4.2L recovered</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-row">
            <StatCard value={63} suffix="M+" label="MSMEs in India" />
            <div className="stats-div" />
            <StatCard prefix="$" value={60} suffix="B" label="B2B Market by 2025" />
            <div className="stats-div" />
            <StatCard value={30} suffix="%" label="GDP from MSMEs" />
            <div className="stats-div" />
            <StatCard prefix="₹" value={1500} suffix="Cr+" label="Year 3 GMV Target" />
            <div className="stats-div" />
            <StatCard value={2} suffix="%" label="Commission only" />
          </div>
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section className="section problem-section">
        <div className="container">
          <div className="problem-layout">
            <div className="problem-left">
              <p className="section-label">The Problem</p>
              <h2 className="section-title">
                Billions in Inventory<br />
                <span className="gradient-text">Sitting Idle Every Year</span>
              </h2>
              <p className="section-subtitle">
                Every year, manufacturers, wholesalers, and distributors are left with
                massive unsold inventory — capital stays locked, warehouses fill up, and profits shrink.
              </p>

              <div className="problem-points">
                {problemPoints.map((p, i) => (
                  <div key={i} className={`problem-point pp-${p.severity}`}>
                    <span className="pp-icon">{p.icon}</span>
                    <span>{p.text}</span>
                    <span className={`pp-dot pp-dot-${p.severity}`} />
                  </div>
                ))}
              </div>

              <Link to="/how-it-works" className="btn-truck" style={{ marginTop: '32px', width: 'fit-content' }}>
                <span className="btn-icon-truck"><Truck size={16} /></span>
                See Our Solution
              </Link>
            </div>

            <div className="problem-right">
              <div className="loss-card">
                <div className="loss-header">
                  <AlertCircle size={18} color="#f15a24" />
                  <span>Annual Dead Stock Loss — India</span>
                </div>
                <div className="loss-big">₹12,000 Cr+</div>
                <div className="loss-sub">lost to unsold inventory annually</div>

                <div className="loss-sectors">
                  {[
                    { label: 'Textile', pct: 23, color: '#f15a24' },
                    { label: 'Electronics', pct: 19, color: '#00b894' },
                    { label: 'Pharma', pct: 17, color: '#6c5ce7' },
                    { label: 'FMCG', pct: 15, color: '#f6a623' },
                    { label: 'Automobile', pct: 14, color: '#2d82f5' },
                    { label: 'Others', pct: 12, color: '#94a3b8' },
                  ].map((s, i) => (
                    <div key={i} className="loss-sector">
                      <div className="ls-label">
                        <span className="ls-dot" style={{ background: s.color }} />
                        {s.label}
                      </div>
                      <div className="ls-bar-bg">
                        <div className="ls-bar-fill" style={{ width: `${s.pct * 4}%`, background: s.color, animationDelay: `${i * 0.15}s` }} />
                      </div>
                      <span className="ls-pct">{s.pct}%</span>
                    </div>
                  ))}
                </div>

                <div className="loss-footer">
                  <div className="lf-item">
                    <span className="lf-val">3-6 months</span>
                    <span className="lf-label">avg. stock age before clearance</span>
                  </div>
                  <div className="lf-item">
                    <span className="lf-val orange">40–70%</span>
                    <span className="lf-label">value lost without AI pricing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="section ai-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="section-label">Core Innovation</p>
            <h2 className="section-title">
              AI-Powered Dead Stock<br />
              <span className="gradient-text">Revival System</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Unlike traditional marketplaces that simply list products, Bulk Bazaar uses
              intelligence to transform unsold inventory into recoverable business assets.
            </p>
          </div>

          <div className="ai-grid">
            {aiFeatures.map((feat, i) => (
              <div
                key={i}
                className={`ai-card ${activeFeature === i ? 'ai-card-active' : ''}`}
                onMouseEnter={() => setActiveFeature(i)}
                style={{ '--fc': feat.color, '--fb': feat.bg }}
              >
                <div className="ai-card-top">
                  <div className="ai-icon-ring">
                    <div className="ai-icon-inner" style={{ color: feat.color, background: feat.bg }}>
                      {feat.icon}
                    </div>
                  </div>
                  <span className="ai-tag" style={{ color: feat.color, background: feat.bg }}>{feat.tag}</span>
                </div>
                <h3 className="ai-title">{feat.title}</h3>
                <p className="ai-desc">{feat.desc}</p>
                <div className="ai-stat-row">
                  <span className="ai-stat" style={{ color: feat.color }}>↑ {feat.stat}</span>
                </div>
                <div className="ai-progress" style={{ background: feat.color, opacity: activeFeature === i ? 1 : 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="section-label">How It Works</p>
            <h2 className="section-title">From Upload to <span className="gradient-text-accent">Revenue</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Our 4-step AI process gets your dead stock moving in days, not months.
            </p>
          </div>

          <div className="how-steps-row">
            {[
              { icon: <Layers size={22} />, step: '01', title: 'Upload Inventory', desc: 'Sellers upload product details, quantity, price, and stock age in minutes.', color: '#f15a24' },
              { icon: <Brain size={22} />, step: '02', title: 'AI Analyzes', desc: 'Our AI engine scans product history, regional demand, and market trends.', color: '#6c5ce7' },
              { icon: <Users size={22} />, step: '03', title: 'Smart Match', desc: 'Platform finds and connects you with the most relevant buyers automatically.', color: '#00b894' },
              { icon: <Repeat size={22} />, step: '04', title: 'Close the Deal', desc: 'Process orders, payments, logistics, and delivery — all in one platform.', color: '#f6a623' },
            ].map((step, i) => (
              <div key={i} className="how-step-card">
                <div className="hsc-num" style={{ color: step.color }}>{step.step}</div>
                <div className="hsc-icon" style={{ background: `${step.color}18`, color: step.color }}>
                  {step.icon}
                </div>
                <h3 className="hsc-title">{step.title}</h3>
                <p className="hsc-desc">{step.desc}</p>
                {i < 3 && <div className="hsc-connector" />}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/how-it-works" className="btn-primary">
              Explore All 8 Steps <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="ind-marquee-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="section-label">Industries We Serve</p>
            <h2 className="section-title" style={{ fontSize: '30px' }}>
              Across <span className="gradient-text">8 Major Sectors</span>
            </h2>
          </div>
        </div>
        <div className="ind-scroll-track">
          <div className="ind-scroll-inner">
            {[...industries, ...industries].map((ind, i) => (
              <div key={i} className="ind-pill">
                <span className="ind-pill-emoji">{ind.emoji}</span>
                <span>{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/industries" className="btn-primary">
            Explore All Industries <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="section outcomes-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="section-label">Business Outcomes</p>
            <h2 className="section-title">
              Real Results for<br /><span className="gradient-text">Real Businesses</span>
            </h2>
          </div>
          <div className="outcomes-grid">
            {outcomes.map((o, i) => (
              <div key={i} className="outcome-card">
                <div className="oc-emoji">{o.icon}</div>
                <h3 className="oc-title">{o.title}</h3>
                <p className="oc-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVENUE MODEL ── */}
      <section className="section revenue-section">
        <div className="container">
          <div className="revenue-layout">
            <div>
              <p className="section-label">Revenue Model</p>
              <h2 className="section-title">
                How We <span className="gradient-text">Make Money</span>
              </h2>
              <p className="section-subtitle">
                A transparent, performance-aligned model where we succeed only when our partners succeed.
              </p>
              <div className="revenue-items">
                {[
                  { icon: '💱', title: 'Commission', pct: '2%', desc: 'Per successful transaction on the platform', highlight: true },
                  { icon: '⭐', title: 'Premium Subscriptions', pct: '+15%', desc: 'Advanced analytics, inventory reports, market insights' },
                  { icon: '📢', title: 'Advertising', pct: '+5%', desc: 'Featured listings and sponsored products' },
                ].map((r, i) => (
                  <div key={i} className={`rev-item ${r.highlight ? 'rev-item-highlight' : ''}`}>
                    <div className="rev-emoji">{r.icon}</div>
                    <div className="rev-body">
                      <div className="rev-title-row">
                        <span className="rev-title">{r.title}</span>
                        <span className="rev-pct">{r.pct}</span>
                      </div>
                      <p className="rev-desc">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="growth-card">
              <h3 className="gc-title">📈 Growth Projections</h3>
              {[
                { year: 'Year 1', biz: '5,000', gmv: '₹100 Cr', rev: '₹2 Cr', prog: 20, color: '#f15a24' },
                { year: 'Year 2', biz: '30,000', gmv: '₹500 Cr', rev: '₹10 Cr', prog: 50, color: '#6c5ce7' },
                { year: 'Year 3', biz: '1,50,000', gmv: '₹1,500 Cr', rev: '₹40 Cr', prog: 100, color: '#00b894' },
              ].map((g, i) => (
                <div key={i} className="gc-row">
                  <div className="gc-year" style={{ color: g.color }}>{g.year}</div>
                  <div className="gc-details">
                    <div className="gc-stats">
                      <span>{g.biz} businesses</span>
                      <span className="gc-gmv">{g.gmv} GMV</span>
                      <strong className="gc-rev">{g.rev}</strong>
                    </div>
                    <div className="gc-bar-bg">
                      <div
                        className="gc-bar-fill"
                        style={{ width: `${g.prog}%`, background: g.color, animationDelay: `${i * 0.25}s` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="gc-note">
                <CheckCircle2 size={14} color="#00b894" />
                Based on 2% commission on projected GMV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-gradient-1" />
            <div className="cta-gradient-2" />
            <div className="cta-dots" />

            <span className="cta-pill">🚀 Join the Waitlist — Free</span>

            <h2 className="cta-title">
              Ready to Recover Your<br />
              <span className="gradient-text">Lost Revenue?</span>
            </h2>
            <p className="cta-subtitle">
              Join 5,000+ businesses in Year 1 transforming dead stock into working capital
              with AI-powered inventory intelligence.
            </p>

            <div className="cta-actions">
              <Link to="/contact" className="btn-truck cta-btn-main">
                <span className="btn-icon-truck"><Truck size={18} /></span>
                Get Started Free
              </Link>
              <Link to="/market" className="cta-btn-ghost">
                <span className="btn-icon-cart"><ShoppingCart size={15} /></span>
                View Market Data
              </Link>
            </div>

            <div className="cta-features">
              {['No setup fee', 'Free for sellers', '2% only on success', '24/7 AI support'].map((f, i) => (
                <div key={i} className="cta-feature">
                  <CheckCircle2 size={14} color="#00b894" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
