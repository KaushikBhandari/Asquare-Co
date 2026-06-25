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
import FeedbackForm from './pages/FeedbackForm';
import ChatBot from './components/ChatBot';
import TaxiWidget from './components/TaxiWidget';
import Footer from './components/Footer';
import HelpCenter from './pages/HelpCenter';
import Cancellations from './pages/Cancellations';
import Insurance from './pages/Insurance';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ContactUs from './pages/ContactUs';
import ProposalViewer from './pages/ProposalViewer';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* AuthGuard handles sign-in wall + modal internally */}
          <AuthGuard>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/feedback/:bookingId" element={<FeedbackForm />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/cancellations" element={<Cancellations />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/proposal/:id" element={<ProposalViewer />} />
              </Routes>
            </main>
            <TaxiWidget />
            <ChatBot />
            <Footer />
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
