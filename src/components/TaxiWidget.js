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
  const [travellers, setTravellers] = useState('');
  const [tripLocation, setTripLocation] = useState('Within Goa');
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

    // Smart Validation
    const goaKeywords = [
      // Core/Districts/Airports
      'goa', 'dabolim', 'mopa', 'airport', 'panjim', 'panaji', 'margao', 'madgaon', 'vasco', 'mapusa', 'ponda',
      // North Goa Beaches & Hubs
      'calangute', 'baga', 'candolim', 'anjuna', 'vagator', 'morjim', 'arambol', 'ashwem', 'mandrem',
      'sinquerim', 'miramar', 'dona paula', 'bambolim', 'arpora', 'saligao', 'assagao', 'siolim', 'chapora',
      'porvorim', 'nerul', 'reis magos', 'sangolda', 'guirim', 'parra', 'aldona', 'moira', 'tivim', 'thivim',
      'old goa', 'ribandar', 'corlim', 'bicholim', 'sanquelim', 'valpoi', 'pernem',
      // South Goa Beaches & Hubs
      'colva', 'benaulim', 'palolem', 'agonda', 'patnem', 'majorda', 'betalbatim', 'varca', 'cavelossim',
      'mobor', 'betul', 'bogmalo', 'canacona', 'chaudi', 'verna', 'nuvem', 'loutolim', 'raia', 'curtorim',
      'chandor', 'navelim', 'chinchinim', 'cuncolim', 'assolna', 'velim', 'quepem', 'sanguem', 'curchorem',
      'shiroda', 'cabo de rama', 'karmali',
      // Generic local keywords
      'hotel', 'resort', 'beach', 'station', 'bus stand', 'villa', 'guest house'
    ];

    const allowedOutstation = [
      'maharashtra', 'mumbai', 'pune', 'nagpur', 'nashik', 'kolhapur', 'aurangabad',
      'delhi', 'new delhi', 'ncr', 'noida', 'gurgaon', 'gurugram', 'faridabad',
      'himachal', 'shimla', 'manali', 'dharamshala', 'kullu', 'dalhousie', 'spiti',
      'uttarakhand', 'dehradun', 'rishikesh', 'haridwar', 'nainital', 'mussoorie',
      'chandigarh',
      'punjab', 'amritsar', 'ludhiana', 'jalandhar', 'patiala',
      'tamil nadu', 'chennai', 'coimbatore', 'madurai', 'ooty', 'kodaikanal',
      'kerala', 'kochi', 'cochin', 'munnar', 'alleppey', 'trivandrum', 'wayanad',
      'kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'jammu',
      'haryana', 'panipat', 'ambala',
      'uttar pradesh', 'up', 'lucknow', 'kanpur', 'agra', 'varanasi', 'mathura',
      'madhya pradesh', 'mp', 'indore', 'bhopal', 'gwalior', 'ujjain',
      'rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'pushkar',
      'karnataka', 'bangalore', 'bengaluru', 'mysore', 'mangalore', 'hampi', 'gokarna', 'udupi'
    ];

    const unsupportedOutstation = [
      'gujarat', 'gujrat', 'ahmedabad', 'surat', 'vadodara', 'rajkot',
      'assam', 'guwahati', 'bihar', 'patna', 'odisha', 'orissa', 'bhubaneswar',
      'west bengal', 'kolkata', 'andhra', 'telangana', 'hyderabad', 'jharkhand', 'ranchi',
      'chhattisgarh', 'raipur', 'sikkim', 'gangtok', 'meghalaya', 'tripura', 'mizoram',
      'manipur', 'nagaland', 'arunachal', 'andaman'
    ];

    const locString = `${fromLocation} ${toLocation}`.toLowerCase();

    const hasGoa = goaKeywords.some(k => locString.includes(k));
    const hasAllowedOutstation = allowedOutstation.some(k => locString.includes(k));
    const hasUnsupportedOutstation = unsupportedOutstation.some(k => locString.includes(k));

    // 1. Immediately block if an unsupported location is detected
    if (hasUnsupportedOutstation) {
      toast.error("Sorry, currently we are not available in this location.", { duration: 5000 });
      return;
    }

    // 2. Validate "Within Goa" selections
    if (tripLocation === 'Within Goa') {
      if (hasAllowedOutstation && !hasGoa) {
        toast.error("This looks like an outstation trip! Please change 'Where is the trip?' to 'Outside Goa'.", { duration: 5000 });
        return;
      }
    }
    // 3. Validate "Outside Goa" selections
    else if (tripLocation === 'Outside Goa (Outstation)') {
      if (hasGoa && !hasAllowedOutstation) {
        toast.error("It looks like your trip is purely in Goa! Please change 'Where is the trip?' to 'Within Goa'.", { duration: 5000 });
        return;
      }
      if (!hasAllowedOutstation) {
        toast.error("Sorry, currently we are not available in this location.", { duration: 5000 });
        return;
      }
    }

    const finalTravellers = travellers || 1;
    const message = `Hello Asquaretravelgoa!\n\nI would like to enquire about a taxi booking:\n\n*Name:* ${name}\n*WhatsApp Number:* ${phone}\n*Location:* ${tripLocation}\n*Pickup:* ${fromLocation}\n*Drop:* ${toLocation}\n*Date:* ${travelDate}\n*Travellers:* ${finalTravellers}\n*Trip Type:* ${tripType}\n\nPlease let me know the pricing and availability. Thank you!`;

    // Choose WhatsApp number based on location
    const waNumber = tripLocation === 'Within Goa' ? '9921632931' : '8767117090';
    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

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
              <label>Where is the trip?</label>
              <div className="taxi-input-wrapper">
                <MapPin size={16} className="taxi-input-icon text-[#00A896]" />
                <select value={tripLocation} onChange={(e) => setTripLocation(e.target.value)}>
                  <option value="Within Goa">Within Goa</option>
                  <option value="Outside Goa (Outstation)">Outside Goa (Outstation)</option>
                </select>
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
                    placeholder="e.g. 2"
                    value={travellers}
                    onChange={(e) => setTravellers(e.target.value)}
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
