import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../config/adminConfig';
import { X, LogOut, LayoutDashboard, ChevronDown, User, Menu } from 'lucide-react';
import AuthModal from './AuthModal';
import './Navbar.css';

const navLinks = [
  { path: '/',            label: 'Home' },
  { path: '/destinations', label: 'Destinations' },
  { path: '/packages',    label: 'Packages' },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, setShowAuthModal, showAuthModal } = useAuth();
  const location  = useLocation();
  const dropRef   = useRef(null);

  // Scroll effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner container">

          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo.jpeg" alt="Asquare & Co." className="nav-logo-img" />
            <div className="nav-logo-text">
              <span className="nav-logo-name">Asquare <strong>&amp; Co.</strong></span>
              <span className="nav-logo-sub">
                Tours &amp; Travels
                <span className="nav-logo-goa">GOA</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-actions">
            <Link to="/booking" className="btn-primary nav-book">Plan My Trip</Link>

            {!user && (
              <button className="nav-signin" onClick={() => setShowAuthModal(true)}>
                <User size={14} /> Sign In
              </button>
            )}

            {user && (
              <div className="user-pill" ref={dropRef} onClick={() => setUserMenuOpen(o => !o)}>
                <img src={user.photo} alt={user.name} className="user-pill-avatar" />
                <span className="user-pill-name">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={13} className={`ud-chevron ${userMenuOpen ? 'open' : ''}`} />
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="ud-user">
                      <div className="ud-name">{user.name}</div>
                      <div className="ud-email">{user.email}</div>
                    </div>
                    {isAdmin(user) && (
                      <Link to="/admin" className="ud-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <button className="ud-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger — always visible on mobile */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {/* User card if logged in */}
        {user && (
          <div className="mobile-user-card">
            <img src={user.photo} alt={user.name} />
            <div>
              <div className="mobile-user-name">{user.name}</div>
              <div className="mobile-user-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="mobile-nav">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`mobile-nav-link ${location.pathname === l.path ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-divider" />

        {/* CTA */}
        <Link to="/booking" className="btn-primary mobile-book-btn" onClick={() => setMenuOpen(false)}>
          ✈️ Plan My Trip
        </Link>

        {/* Auth actions */}
        {!user && (
          <button
            className="btn-ghost mobile-sign-btn"
            onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
          >
            <User size={14} /> Sign In
          </button>
        )}

        {user && (
          <div className="mobile-user-actions">
            {isAdmin(user) && (
              <Link
                to="/admin"
                className="mobile-admin-btn"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={14} /> Admin Dashboard
              </Link>
            )}
            <button className="mobile-signout-btn" onClick={handleLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="auth-modal-overlay"
          onClick={e => e.target === e.currentTarget && setShowAuthModal(false)}
        >
          <AuthModal onClose={() => setShowAuthModal(false)} />
        </div>
      )}
    </>
  );
}
