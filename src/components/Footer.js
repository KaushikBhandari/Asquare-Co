import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.jpeg" alt="Asquaretravelgoa" className="footer-logo-img" />
              <div>
                <div className="footer-logo-name"><strong>Asquaretravelgoa</strong></div>
                <div className="footer-logo-sub">Tours &amp; Travels · Goa Specialists</div>
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
    </footer>
  );
}
