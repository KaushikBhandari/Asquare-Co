import React, { useState, useEffect } from 'react';
import { getEnquiries } from '../../firebase/config';
import { MessageSquare, Mail, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

// Format date helpers
const todayStr = new Date().toISOString().split('T')[0];
const todayDate = new Date(todayStr);

// Helper to check if a trip is currently active or ended today
const getTripStatus = (departureDate, returnDate) => {
  if (!departureDate || !returnDate) return 'unknown';
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  
  if (todayDate < start) return 'upcoming';
  if (todayDate > end) return 'ended';
  return 'active';
};

export default function FollowUpPanel() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const enqs = await getEnquiries();
      
      // Filter to only converted or active trips that have dates
      const activeOrEndedTrips = enqs.filter(e => {
        if (!e.departureDate || !e.returnDate) return false;
        // Include if they are marked as 'converted' or 'contacted'
        if (e.status === 'new' || e.status === 'closed') return false;
        
        const status = getTripStatus(e.departureDate, e.returnDate);
        return status === 'active' || status === 'ended';
      });

      // Sort so ended trips are at the top (feedback needed)
      activeOrEndedTrips.sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
      
      setTrips(activeOrEndedTrips);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  // Helper to get dynamic message based on trip day
  const getDynamicMessage = (trip, isEnded) => {
    if (isEnded) {
      return {
        subject: `Welcome back from ${trip.packageDestinations}!`,
        body: `Hi ${trip.firstName || trip.customerName},\n\nWe hope you had a fantastic trip to ${trip.packageDestinations}! Welcome back.\n\nWe would love to hear about your experience. Please take a minute to fill out our feedback form:\n${window.location.origin}/feedback/${trip.id}\n\nWarm regards,\nAsquare & Co. Tours & Travels`
      };
    }

    const start = new Date(trip.departureDate);
    const diffTime = todayDate - start;
    const dayOfTrip = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Day 1, Day 2, etc.

    if (dayOfTrip === 1) {
      return {
        subject: `Welcome to ${trip.packageDestinations}!`,
        body: `Hi ${trip.firstName || trip.customerName},\n\nWelcome to ${trip.packageDestinations}! We hope you had a smooth arrival and are getting settled in.\n\nIf you need anything at all as you start your journey, please don't hesitate to reach out. Enjoy your first day!\n\nWarm regards,\nAsquare & Co. Tours & Travels`
      };
    } else if (dayOfTrip === 2) {
      return {
        subject: `Day 2 in ${trip.packageDestinations}`,
        body: `Hi ${trip.firstName || trip.customerName},\n\nGood morning! Ready for an exciting Day 2 in ${trip.packageDestinations}? \n\nWe hope you have a wonderful time exploring today. Let us know if you need any local recommendations!\n\nWarm regards,\nAsquare & Co. Tours & Travels`
      };
    } else {
      return {
        subject: `Checking in on your trip to ${trip.packageDestinations}`,
        body: `Hi ${trip.firstName || trip.customerName},\n\nJust checking in on Day ${dayOfTrip} of your trip to ${trip.packageDestinations}! We hope everything is going wonderfully.\n\nLet us know if you need any assistance.\n\nWarm regards,\nAsquare & Co. Tours & Travels`
      };
    }
  };

  const getWaUrl = (trip, isEnded) => {
    const raw = trip.whatsapp || trip.phone || '';
    const num = raw.replace(/[^0-9]/g, '');
    const { body } = getDynamicMessage(trip, isEnded);
    return `https://wa.me/${num}?text=${encodeURIComponent(body)}`;
  };

  const getEmailUrl = (trip, isEnded) => {
    const { subject, body } = getDynamicMessage(trip, isEnded);
    return `mailto:${trip.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) return <div className="empty-page-state"><div className="spinner" />Loading trips...</div>;

  if (trips.length === 0) {
    return (
      <div className="empty-page-state">
        <MessageSquare size={44} />
        <h3>No active trips for follow-ups today</h3>
        <p>Trips that are currently happening or just ended will appear here.</p>
      </div>
    );
  }

  return (
    <div className="enquiries-list">
      {trips.map(trip => {
        const status = getTripStatus(trip.departureDate, trip.returnDate);
        const isEnded = status === 'ended';
        const hasWa = !!trip.whatsapp || !!trip.phone;
        
        return (
          <div key={trip.id} className="enquiry-card">
            <div className="eq-header">
              <div className="eq-customer">
                <div className="eq-avatar">{trip.customerName?.[0]?.toUpperCase()||'?'}</div>
                <div>
                  <div className="eq-name">{trip.customerName}</div>
                  <div className="eq-time">{trip.packageDestinations}</div>
                </div>
              </div>
              <div className="eq-actions">
                <span className={`status-badge ${isEnded ? 'confirmed' : 'pending'}`}>
                  {isEnded ? 'Trip Ended (Feedback)' : 'Active Trip'}
                </span>
              </div>
            </div>
            
            <div className="eq-body">
              <div className="eq-section">
                <div className="eq-section-title">Schedule</div>
                <div className="eq-fields">
                  <div className="eq-field"><Calendar size={11}/><span>{trip.departureDate} → {trip.returnDate}</span></div>
                  <div className="eq-field"><Clock size={11}/><span>{trip.packageDuration}</span></div>
                </div>
              </div>
              <div className="eq-section">
                <div className="eq-section-title">Contact</div>
                <div className="eq-fields">
                  <div className="eq-field"><Mail size={11}/><span>{trip.email}</span></div>
                  {hasWa && <div className="eq-field"><i className="fa-brands fa-whatsapp"></i><span>{trip.whatsapp || trip.phone}</span></div>}
                </div>
              </div>
            </div>

            <div className="eq-footer">
              {hasWa && (
                <a 
                  href={getWaUrl(trip, isEnded)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary eq-contact-btn whatsapp-btn"
                >
                  <i className="fa-brands fa-whatsapp"></i> Send WhatsApp
                </a>
              )}
              <a 
                href={getEmailUrl(trip, isEnded)}
                className="btn-primary eq-contact-btn"
              >
                <Mail size={13} /> Send Email
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
