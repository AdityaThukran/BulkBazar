import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: 'seller', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: form.name,
            email: form.email,
            company: form.company || null,
            role: form.role,
            phone: form.phone || null,
            message: form.message || null
          }
        ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Supabase Error:', err);
      alert('Error joining waitlist: ' + (err.message || 'Something went wrong. Please check your connection.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="glow-orb glow-orb-primary" style={{ width: '500px', height: '500px', top: '-200px', right: '-100px' }} />
        <div className="container">
          <div className="contact-hero-inner">
            <div className="contact-hero-left">
              <p className="section-label">Contact Us</p>
              <h1 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                Let's Start Your<br /><span className="gradient-text">Inventory Revolution</span>
              </h1>
              <p className="section-subtitle">
                Whether you're a manufacturer with dead stock, a buyer looking for bulk deals,
                or an investor in India's B2B future — we'd love to connect.
              </p>

              <div className="contact-info">
                {[
                  { icon: <Mail size={20} />, label: 'Email', value: 'hello@bulkbazaar.in', link: 'mailto:hello@bulkbazaar.in' },
                  { icon: <Phone size={20} />, label: 'Phone', value: '000-000-0000', link: 'tel:000-000-0000' },
                  { icon: <MapPin size={20} />, label: 'Submitted under', value: 'VentureX — India' },
                ].map((item, i) => (
                  <div key={i} className="contact-info-item">
                    <div className="contact-info-icon">{item.icon}</div>
                    <div>
                      <div className="contact-info-label">{item.label}</div>
                      {item.link ? (
                        <a href={item.link} className="contact-info-value">{item.value}</a>
                      ) : (
                        <div className="contact-info-value">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-hackathon">
                <div className="hackathon-badge">
                  <Zap size={16} color="var(--yellow)" />
                  <span>VentureX</span>
                </div>
                <p>Bulk Bazaar was submitted under Industry 4.0 & 5.0 innovation track, aimed at transforming India's wholesale B2B ecosystem with AI.</p>
              </div>
            </div>

            <div className="contact-form-wrap">
              {!submitted ? (
                <form className="contact-form card" onSubmit={handleSubmit}>
                  <h3 className="form-title">Get Early Access</h3>
                  <p className="form-subtitle">Join the waitlist and be among the first to use Bulk Bazaar.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company</label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>I am a *</label>
                    <div className="role-selector">
                      {['seller', 'buyer', 'investor', 'other'].map(role => (
                        <button
                          key={role}
                          type="button"
                          className={`role-btn ${form.role === role ? 'role-btn-active' : ''}`}
                          onClick={() => setForm({ ...form, role })}
                        >
                          {{ seller: '🏭 Seller', buyer: '🛒 Buyer', investor: '💼 Investor', other: '💬 Other' }[role]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your inventory needs or investment interest..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="btn-primary form-submit" disabled={loading}>
                    {loading ? (
                      <span className="loading-spinner" />
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>

                  <p className="form-disclaimer">
                    Your information is secure. No spam, ever.
                  </p>
                </form>
              ) : (
                <div className="success-card card">
                  <div className="success-icon">
                    <CheckCircle2 size={48} color="var(--accent)" />
                  </div>
                  <h3>You're on the list! 🎉</h3>
                  <p>
                    Thanks <strong>{form.name}</strong>! We've received your interest and will reach out
                    to you at <strong>{form.email}</strong> with early access details.
                  </p>
                  <div className="success-details">
                    <div className="success-detail">
                      <span className="success-label">Role</span>
                      <span className="success-value">{form.role.charAt(0).toUpperCase() + form.role.slice(1)}</span>
                    </div>
                    {form.company && (
                      <div className="success-detail">
                        <span className="success-label">Company</span>
                        <span className="success-value">{form.company}</span>
                      </div>
                    )}
                  </div>
                  <p className="success-note">Expected response within 24 hours.</p>
                  <button className="btn-secondary" onClick={() => setSubmitted(false)}>
                    Submit Another <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section vision-section">
        <div className="container">
          <div className="vision-box">
            <div className="vision-quote">"</div>
            <blockquote className="vision-text">
              Bulk Bazaar aims to transform India's wholesale ecosystem by using Artificial Intelligence
              to reduce inventory waste, unlock working capital, and make B2B commerce smarter, faster, and more sustainable.
            </blockquote>
            <div className="vision-caption">— Bulk Bazaar Vision Statement</div>
            <div className="vision-pitch">
              <div className="pitch-card">
                <div className="pitch-label">One-Line Pitch</div>
                <p>"Bulk Bazaar converts dead stock into business opportunities through AI-powered inventory intelligence and smart procurement."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
