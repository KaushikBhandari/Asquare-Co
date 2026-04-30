import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginWithGoogle as fbGoogle,
  registerWithEmail as fbRegister,
  loginWithEmail as fbLogin,
  logoutUser,
  onAuthChange
} from '../firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email)}&background=FF6B35&color=fff`,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    const { user: u, error } = await fbGoogle();
    if (error) { toast.error('Google sign-in failed. Check Firebase config.'); return false; }
    toast.success(`Welcome, ${u.displayName || 'Traveler'}! ✈️`);
    setShowAuthModal(false);
    return true;
  };

  const register = async (name, email, password) => {
    const { user: u, error } = await fbRegister(name, email, password);
    if (error) { toast.error(error.replace('Firebase: ', '')); return false; }
    toast.success(`Account created! Welcome, ${name}! 🎉`);
    setShowAuthModal(false);
    return true;
  };

  const login = async (email, password) => {
    const { user: u, error } = await fbLogin(email, password);
    if (error) { toast.error('Invalid email or password.'); return false; }
    toast.success(`Welcome back! ✈️`);
    setShowAuthModal(false);
    return true;
  };

  const logout = async () => {
    await logoutUser();
    toast('Logged out. Safe travels! ✈️');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, register, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
