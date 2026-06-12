import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './StaticPage.css';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Thanks for reaching out! We'll get back to you soon.");
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="static-page container">
      <h1 className="display-title">Contact Us</h1>
      <p className="section-lead" style={{textAlign: 'center', marginBottom: '40px'}}>
        Have a question or need help planning your trip? We're here for you!
      </p>

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
        
        {/* Left Side: Info */}
        <div className="contact-info">
          <div className="static-content" style={{ height: '100%' }}>
            <h3 style={{ marginTop: 0 }}>Get in Touch</h3>
            <p style={{ color: 'var(--ink-soft)' }}>
              Whether you want to book a custom package, need help with an existing reservation, or just want to say hi, feel free to drop us a message.
            </p>

            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--coral-pale)', color: 'var(--coral)', borderRadius: '50%' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Call Us</div>
                  <div style={{ fontWeight: 600 }}>+91 95293 38747 (Company)</div>
                  <div style={{ fontWeight: 600 }}>+91 87671 17090 (Support)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--coral-pale)', color: 'var(--coral)', borderRadius: '50%' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Email Us</div>
                  <div style={{ fontWeight: 600 }}>info@asquaretravelgoa.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--coral-pale)', color: 'var(--coral)', borderRadius: '50%' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Visit Us</div>
                  <div style={{ fontWeight: 600 }}>Cuncolim, India, Goa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-wrap">
          <div className="static-content">
            <h3 style={{ marginTop: 0 }}>Send a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--sand)', outline: 'none' }} 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--sand)', outline: 'none' }} 
                    placeholder="+91 95293 38747"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--sand)', outline: 'none' }} 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Your Message</label>
                <textarea 
                  required 
                  rows="4"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--sand)', outline: 'none', resize: 'vertical' }} 
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
