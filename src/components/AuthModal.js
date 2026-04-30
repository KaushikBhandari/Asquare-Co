import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Chrome, Eye, EyeOff } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal() {
  const { loginWithGoogle, register, login, setShowAuthModal } = useAuth();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'signup') {
      await register(name, email, password);
    } else {
      await login(email, password);
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && setShowAuthModal(false)}>
      <div className="auth-modal">
        {/* Decorative top */}
        <div className="auth-deco">
          <div className="auth-deco-blob1" />
          <div className="auth-deco-blob2" />
        </div>

        <button className="auth-close" onClick={() => setShowAuthModal(false)}><X size={18} /></button>

        <div className="auth-content">
          <div className="auth-emoji">✈️</div>
          <h2 className="auth-title">{mode === 'signin' ? 'Welcome Back!' : 'Join Asquare & Co.'}</h2>
          <p className="auth-sub">
            {mode === 'signin' ? 'Sign in to access exclusive deals & bookings' : 'Create an account with Asquare & Co. to start exploring the world'}
          </p>

          {/* Google */}
          <button className="google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.165 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-sep"><span>or continue with email</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="field-label">Full Name</label>
                <div className="input-icon-wrap">
                  <User size={15} className="input-icon" />
                  <input className="field-input has-icon" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
            )}
            <div className="auth-field">
              <label className="field-label">Email</label>
              <div className="input-icon-wrap">
                <Mail size={15} className="input-icon" />
                <input className="field-input has-icon" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="auth-field">
              <label className="field-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={15} className="input-icon" />
                <input className="field-input has-icon" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? <div className="spinner" /> : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}>
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p className="auth-note">
            🔒 Your data is securely stored with Firebase &amp; Google Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
