import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatBot from './components/ChatBot';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          {/* AuthGuard handles sign-in wall + modal internally */}
          <AuthGuard>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <ChatBot />
          </AuthGuard>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#fff', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', borderRadius: 12, boxShadow: '0 8px 32px rgba(26,26,46,0.12)' },
              success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
