import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Car, X, MapPin, Navigation, User, Phone, Calendar, Users, Route } from 'lucide-react';
import toast from 'react-hot-toast';
import './TaxiWidget.css';

export default function TaxiWidget() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [tripType, setTripType] = useState('One Way');
  const [gettingLocation, setGettingLocation] = useState(false);

  if (isAdminRoute) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding using a free public API for demo purposes
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          const cityOrAddress = data.address.city || data.address.town || data.address.village || data.display_name.split(',')[0];
          setFromLocation(cityOrAddress);
          toast.success('Location found!');
        } catch (err) {
          setFromLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        }
        setGettingLocation(false);
      },
      () => {
        toast.error('Unable to retrieve your location');
        setGettingLocation(false);
      }
    );
  };

  const handleSendWhatsApp = () => {
    if (!name.trim() || !phone.trim() || !fromLocation.trim() || !toLocation.trim() || !travelDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Using plain text without emojis to avoid encoding issues
    const message = `Hello Asquaretravelgoa!\n\nI would like to enquire about a taxi booking:\n\n*Name:* ${name}\n*WhatsApp Number:* ${phone}\n*Pickup:* ${fromLocation}\n*Drop:* ${toLocation}\n*Date:* ${travelDate}\n*Travellers:* ${travellers}\n*Trip Type:* ${tripType}\n\nPlease let me know the pricing and availability. Thank you!`;
    const whatsappUrl = `https://wa.me/919529338747?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <button className="taxi-trigger" onClick={() => setOpen(true)}>
          <Car size={22} />
          <span>Book Taxi</span>
        </button>
      )}

      {open && (
        <div className="taxi-window">
          <div className="taxi-header">
            <div className="taxi-title-box">
              <Car size={18} />
              <span className="taxi-title">Need a Taxi?</span>
            </div>
            <button className="taxi-close-btn" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="taxi-body">
            <p className="taxi-desc">Book a reliable ride for your trip! Enter your details below to get pricing instantly via WhatsApp.</p>
            
            <div className="taxi-input-group">
              <label>Your Name</label>
              <div className="taxi-input-wrapper">
                <User size={16} className="taxi-input-icon text-[#00A896]" />
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="taxi-input-group">
              <label>WhatsApp Number</label>
              <div className="taxi-input-wrapper">
                <Phone size={16} className="taxi-input-icon text-[#00A896]" />
                <input 
                  type="tel" 
                  placeholder="Enter WhatsApp number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="taxi-input-group">
              <label>Pickup Location</label>
              <div className="taxi-input-wrapper">
                <MapPin size={16} className="taxi-input-icon text-[#00A896]" />
                <input 
                  type="text" 
                  placeholder="Enter pickup address" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
                <button 
                  className="taxi-location-btn" 
                  title="Use current location"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                >
                  <Navigation size={14} className={gettingLocation ? "animate-pulse" : ""} />
                </button>
              </div>
            </div>

            <div className="taxi-input-group">
              <label>Drop Destination</label>
              <div className="taxi-input-wrapper">
                <MapPin size={16} className="taxi-input-icon text-[#FF6B35]" />
                <input 
                  type="text" 
                  placeholder="Enter drop destination" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="taxi-row">
              <div className="taxi-input-group">
                <label>Travel Date</label>
                <div className="taxi-input-wrapper">
                  <Calendar size={16} className="taxi-input-icon text-[#00A896]" />
                  <input 
                    type="date" 
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="taxi-input-group">
                <label>Travellers</label>
                <div className="taxi-input-wrapper">
                  <Users size={16} className="taxi-input-icon text-[#00A896]" />
                  <input 
                    type="number" 
                    min="1"
                    value={travellers}
                    onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>

            <div className="taxi-input-group">
              <label>Trip Type (Optional)</label>
              <div className="taxi-input-wrapper">
                <Route size={16} className="taxi-input-icon text-[#00A896]" />
                <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
                  <option value="One Way">One Way</option>
                  <option value="Round Trip">Round Trip</option>
                  <option value="Multi-City">Multi-City</option>
                </select>
              </div>
            </div>

            <button className="taxi-submit-btn" onClick={handleSendWhatsApp}>
              <i className="fa-brands fa-whatsapp text-lg"></i>
              Enquire on WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
