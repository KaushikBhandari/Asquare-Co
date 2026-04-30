import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import './AuthGuard.css';

// Inline sign-in form — cannot be dismissed until logged in
function SignInWall() {
  const { loginWithGoogle, register, login } = useAuth();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const ok = await loginWithGoogle();
    if (!ok) setError('Google sign-in failed. Please try again.');
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    let ok;
    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
      ok = await register(name, email, password);
    } else {
      ok = await login(email, password);
    }
    if (!ok) setError(mode === 'signup' ? 'Registration failed. Try a different email.' : 'Invalid email or password.');
    setLoading(false);
  };

  return (
    <div className="auth-guard-wall">
      <div className="agw-card">
        {/* Logo + Branding */}
        <img src="/logo.jpeg" alt="Asquare & Co." className="agw-logo" />
        <h1 className="agw-title">Asquare <strong>&amp; Co.</strong></h1>
        <p className="agw-sub">Tours &amp; Travels</p>
        <div className="agw-divider" />

        <h2 className="agw-heading">
          {mode === 'signin' ? 'Welcome Back! ✈️' : 'Create Account 🎉'}
        </h2>
        <p className="agw-desc">
          {mode === 'signin'
            ? 'Sign in to explore our exclusive travel packages'
            : 'Join Asquare & Co. and start planning your dream trip'}
        </p>

        {/* Google Button */}
        <button className="agw-google-btn" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.165 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="agw-sep"><span>or use email</span></div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="agw-form">
          {mode === 'signup' && (
            <div className="agw-field">
              <div className="agw-input-wrap">
                <User size={14} className="agw-input-icon" />
                <input
                  className="agw-input"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="agw-field">
            <div className="agw-input-wrap">
              <Mail size={14} className="agw-input-icon" />
              <input
                className="agw-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="agw-field">
            <div className="agw-input-wrap">
              <Lock size={14} className="agw-input-icon" />
              <input
                className="agw-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="button" className="agw-pw-toggle" onClick={() => setShowPw(s => !s)}>
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {error && <div className="agw-error">⚠️ {error}</div>}

          <button type="submit" className="btn-primary agw-submit" disabled={loading}>
            {loading
              ? <><div className="spinner-sm" /> Please wait...</>
              : mode === 'signin' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <p className="agw-switch">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); }}
          >
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        <p className="agw-secure">🔒 Secured by Firebase &amp; Google Cloud</p>
      </div>
    </div>
  );
}

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();

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
        <img src="/logo.jpeg" alt="Asquare & Co." className="agl-logo-img" />
        <div className="agl-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in — show sign-in wall, NO way to bypass
  if (!user) {
    return <SignInWall />;
  }

  // Logged in — show the full site
  return <>{children}</>;
}