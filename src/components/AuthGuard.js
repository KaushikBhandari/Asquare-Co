import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthGuard.css';

export default function AuthGuard({ children }) {
  const { loading } = useAuth();

  // Hide the HTML initial loader once Firebase auth check completes
  useEffect(() => {
    if (!loading) {
      if (window.__hideInitialLoader) {
        window.__hideInitialLoader();
      }
    }
  }, [loading]);

  // While Firebase is checking auth — show spinner (index.html loader is still visible)
  if (loading) {
    return (
      <div className="auth-guard-loading">
        <img src="/logo.jpeg" alt="Asquaretravelgoa" className="agl-logo-img" />
        <div className="agl-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Allow everyone to view the site; login is handled via Navbar and specific protected pages
  return <>{children}</>;
}