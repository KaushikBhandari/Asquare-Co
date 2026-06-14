import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [mainLogoModalOpen, setMainLogoModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.jpeg" alt="Asquaretravelgoa" className="footer-logo-img" style={{ cursor: 'zoom-in' }} onClick={() => setMainLogoModalOpen(true)} />
              <div>
                <div className="footer-logo-name"><strong>AsquareTravelGoa</strong></div>
                <div className="footer-logo-sub">Tours &amp; Travels · Goa Specialists</div>
              </div>
            </div>
            <div style={{ marginTop: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>A proud enterprise of</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/logo2.png" alt="Asquare & Co." className="footer-logo-img" style={{ background: '#fff', cursor: 'zoom-in' }} onClick={() => setLogoModalOpen(true)} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '0.02em' }}>Asquare & Co.</span>
              </div>
            </div>
            <p className="footer-tagline">Goa's most trusted travel partner since 2009. We craft extraordinary journeys across Goa and beyond — your dream trip is our mission.</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/asquaretravelgoa?igsh=bWdmNzRlZWQ2aXcw" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="https://www.facebook.com/share/1JEQczXjQ3/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="mailto:info@asquaretravelgoa.com" className="social-btn" aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <Link to="/booking" className="footer-link">Plan My Trip</Link>
              <Link to="/help-center" className="footer-link">Help Center</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Legal</h4>
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
              <Link to="/cookie-policy" className="footer-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Asquaretravelgoa Tours &amp; Travels. All rights reserved.</span>
          <a href="https://crelante.com" target="_blank" rel="noreferrer" className="powered-by">
            Powered by <strong>Crelante</strong>
          </a>
        </div>
      </div>

      {/* Parent Logo Modal */}
      {logoModalOpen && (
        <div className="logo-modal-overlay" onClick={e => e.target === e.currentTarget && setLogoModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="logo-modal-content" style={{ background: '#fff', padding: '32px', borderRadius: '24px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <img src="/logo2.png" alt="Asquare & Co. Logo" style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => { setLogoModalOpen(false); window.scrollTo(0,0); navigate('/'); }} style={{ padding: '12px 24px', borderRadius: '12px' }}>Go to Home</button>
              <button className="btn-ghost" onClick={() => setLogoModalOpen(false)} style={{ background: '#f3f4f6', color: '#111', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Logo Modal */}
      {mainLogoModalOpen && (
        <div className="logo-modal-overlay" onClick={e => e.target === e.currentTarget && setMainLogoModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="logo-modal-content" style={{ background: '#fff', padding: '32px', borderRadius: '24px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <img src="/logo.jpeg" alt="AsquareTravelGoa Logo" style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain', borderRadius: '16px' }} />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => { setMainLogoModalOpen(false); window.scrollTo(0,0); navigate('/'); }} style={{ padding: '12px 24px', borderRadius: '12px' }}>Go to Home</button>
              <button className="btn-ghost" onClick={() => setMainLogoModalOpen(false)} style={{ background: '#f3f4f6', color: '#111', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
