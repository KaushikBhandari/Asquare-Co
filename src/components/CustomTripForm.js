import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Coffee, Users, Baby, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveEnquiry } from '../firebase/config';
import './CustomTripForm.css';

export default function CustomTripForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    duration: '',
    meal: 'CP',
    travellers: 1,
    child: 0,
    category: 'Standard'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to Firebase via saveEnquiry
      // Convert to format expected by AdminDashboard
      const enquiryPayload = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone,
        selectedPackage: 'Custom Trip',
        packageDestinations: formData.destination,
        packageDuration: formData.duration,
        travelers: `${formData.travellers} Adults, ${formData.child} Children`,
        tripType: formData.category,
        roomType: formData.meal,
        customerMessage: 'Custom Trip Enquiry',
        departureDate: 'Flexible',
        returnDate: 'Flexible',
        source: 'Custom Trip Form',
        submittedAt: new Date().toISOString()
      };

      const { id, error, code } = await saveEnquiry(enquiryPayload);
      const finalId = id || 'ASQ' + Date.now();

      if (error) {
        console.error('Firebase saveEnquiry failed:', code, error);
      }

      // Always persist locally so no data is lost
      const enquiries = JSON.parse(localStorage.getItem('wl_enquiries') || '[]');
      enquiries.unshift({ ...enquiryPayload, id: finalId });
      localStorage.setItem('wl_enquiries', JSON.stringify(enquiries));

      // 2. Prepare WhatsApp Message
      const message = `*New Custom Trip Request*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Email:* ${formData.email}\n` +
        `*Destination:* ${formData.destination}\n` +
        `*Duration:* ${formData.duration}\n` +
        `*Meal Plan:* ${formData.meal}\n` +
        `*Travellers:* ${formData.travellers}\n` +
        `*Children (<6 yrs):* ${formData.child}\n` +
        `*Tour Category:* ${formData.category}\n\n` +
        `Please arrange a package accordingly.`;

      const whatsappUrl = `https://wa.me/919921632931?text=${encodeURIComponent(message)}`;
      
      toast.success("Request sent successfully!");
      setFormData({
        name: '', phone: '', email: '', destination: '', duration: '',
        meal: 'CP', travellers: 1, child: 0, category: 'Standard'
      });

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="custom-trip-section">
      <div className="custom-trip-container">
        <div className="custom-trip-header">
          <div className="custom-trip-eyebrow">Didn't find your perfect package?</div>
          <h2 className="custom-trip-title">Let Us Craft Your Custom Trip</h2>
          <p className="custom-trip-subtitle">
            Tell us where you want to go, who you're travelling with, and what you need. Our experts will design a tailor-made package just for you.
          </p>
        </div>

        <form className="custom-trip-body" onSubmit={handleSubmit}>
          
          <div className="custom-trip-row">
            <div className="custom-trip-group">
              <label className="custom-trip-label">Full Name</label>
              <div className="custom-trip-input-wrapper">
                <User size={18} className="custom-trip-icon" />
                <input 
                  type="text" 
                  name="name"
                  className="custom-trip-input" 
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-trip-group">
              <label className="custom-trip-label">Phone Number</label>
              <div className="custom-trip-input-wrapper">
                <Phone size={18} className="custom-trip-icon" />
                <input 
                  type="tel" 
                  name="phone"
                  className="custom-trip-input" 
                  placeholder="WhatsApp Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="custom-trip-row">
            <div className="custom-trip-group">
              <label className="custom-trip-label">Email Address</label>
              <div className="custom-trip-input-wrapper">
                <Mail size={18} className="custom-trip-icon" />
                <input 
                  type="email" 
                  name="email"
                  className="custom-trip-input" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-trip-group">
              <label className="custom-trip-label">Destination</label>
              <div className="custom-trip-input-wrapper">
                <MapPin size={18} className="custom-trip-icon" />
                <input 
                  type="text" 
                  name="destination"
                  className="custom-trip-input" 
                  placeholder="Where do you want to go?"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="custom-trip-row">
            <div className="custom-trip-group">
              <label className="custom-trip-label">Duration</label>
              <div className="custom-trip-input-wrapper">
                <Calendar size={18} className="custom-trip-icon" />
                <input 
                  type="text" 
                  name="duration"
                  className="custom-trip-input" 
                  placeholder="e.g., 5 Days / 4 Nights"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-trip-group">
              <label className="custom-trip-label">Meal Plan</label>
              <div className="custom-trip-input-wrapper">
                <Coffee size={18} className="custom-trip-icon" />
                <select name="meal" className="custom-trip-select" value={formData.meal} onChange={handleChange}>
                  <option value="CP">CP (Breakfast only)</option>
                  <option value="MAP">MAP (Breakfast + 1 Meal)</option>
                  <option value="APAI">APAI (All Meals Included)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="custom-trip-row">
            <div className="custom-trip-group" style={{ flex: 0.5 }}>
              <label className="custom-trip-label">Travellers</label>
              <div className="custom-trip-input-wrapper">
                <Users size={18} className="custom-trip-icon" />
                <input 
                  type="number" 
                  name="travellers"
                  min="1"
                  className="custom-trip-input" 
                  value={formData.travellers}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-trip-group" style={{ flex: 0.5 }}>
              <label className="custom-trip-label">Children (Below 6)</label>
              <div className="custom-trip-input-wrapper">
                <Baby size={18} className="custom-trip-icon" />
                <input 
                  type="number" 
                  name="child"
                  min="0"
                  className="custom-trip-input" 
                  value={formData.child}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-trip-group" style={{ flex: 1 }}>
              <label className="custom-trip-label">Tour Category</label>
              <div className="custom-trip-input-wrapper">
                <Star size={18} className="custom-trip-icon" />
                <select name="category" className="custom-trip-select" value={formData.category} onChange={handleChange}>
                  <option value="Standard">Standard (2–3 star cozy)</option>
                  <option value="Comfort">Comfort (4-star with amenities)</option>
                  <option value="Premium">Premium (5-star luxury)</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary custom-trip-submit" disabled={loading}>
            {loading ? 'Sending Request...' : <><Send size={18} /> Request Custom Package</>}
          </button>

        </form>
      </div>
    </div>
  );
}
