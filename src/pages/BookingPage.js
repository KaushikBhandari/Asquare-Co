import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAllDestinations, useAllPackages } from '../hooks/useAllData';
import { saveEnquiry } from '../firebase/config';
import { sendCustomerConfirmation, sendAdminNotification } from '../services/emailService';
import {
  MapPin, Calendar, Users, ArrowRight, ArrowLeft,
  Check, LogIn, Phone, Mail, User,
  MessageSquare, Star, Clock, Send, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import './BookingPage.css';
import { FaWhatsapp } from "react-icons/fa";

const STEPS = [
  { label: 'Choose Trip', icon: '🌍' },
  { label: 'Your Details', icon: '👤' },
  { label: 'Review & Send', icon: '📋' },
  { label: 'Done!', icon: '🎉' },
];

const ROOM_TYPES = ['Standard Room', 'Deluxe Room', 'Suite', 'Private Villa'];
const BUDGETS = ['Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,00,000', '₹2,00,000+', 'Flexible'];
const TRIP_TYPES = ['Leisure / Holiday', 'Honeymoon', 'Family Trip', 'Adventure', 'Business', 'Group Tour'];

function SignInGate({ onClose, onSignIn }) {
  return (
    <div className="gate-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="gate-card animate-scale">
        <div className="gate-icon-wrap">🔐</div>
        <h3 className="gate-title">Sign in to Submit Enquiry</h3>
        <p className="gate-sub">Sign in so we can save your enquiry and contact you with the best deals!</p>
        <div className="gate-perks">
          {[
            ['✅', 'Your enquiry gets saved securely'],
            ['📧', "We'll email you the best packages"],
            ['🔄', 'Track your enquiry status anytime'],
            ['🎁', 'Get exclusive member-only deals'],
          ].map(([icon, text]) => (
            <div key={text} className="gate-perk"><span>{icon}</span><span>{text}</span></div>
          ))}
        </div>
        <button className="btn-primary gate-signin-btn" onClick={onSignIn}>
          <LogIn size={16} /> Sign In / Register Free
        </button>
        <button className="gate-guest-btn" onClick={onClose}>Continue as guest</button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowAuthModal } = useAuth();

  const preItem = location.state?.destination || location.state?.package || null;
  const preType = location.state?.destination ? 'destination' : location.state?.package ? 'package' : null;

  const [step, setStep] = useState(preItem ? 1 : 0);
  const [item, setItem] = useState(preItem);
  const [itemType, setItemType] = useState(preType);
  const [loading, setLoading] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', whatsapp: '', city: '',
    departureDate: '', returnDate: '', travelers: '2',
    tripType: 'Leisure / Holiday', roomType: 'Deluxe Room',
    budget: 'Flexible',
    message: '',
    newsletter: true,
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        firstName: f.firstName || user.name?.split(' ')[0] || '',
        lastName:  f.lastName  || user.name?.split(' ').slice(1).join(' ') || '',
        email:     f.email     || user.email || '',
      }));
    }
  }, [user]);

  const { destinations } = useAllDestinations();
  const { packages } = useAllPackages();
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const ALL_ITEMS = [
    ...packages.map(p => ({ ...p, _type: 'package' })),
    ...destinations.map(d => ({ ...d, _type: 'destination' })),
  ];

  const handleSendEnquiry = async () => {
    if (!user) { setShowGate(true); return; }
    if (!form.firstName || !form.email || !form.phone) {
      toast.error('Please fill in your name, email and phone number.');
      return;
    }
    setLoading(true);

    const enquiryData = {
      customerName:  `${form.firstName} ${form.lastName}`.trim(),
      firstName:     form.firstName,
      lastName:      form.lastName,
      email:         form.email,
      phone:         form.phone,
      whatsapp:      form.whatsapp || form.phone,
      city:          form.city,
      userId:        user.uid || null,
      userGoogle:    user.email,
      selectedPackage:      item?.name || 'Not selected',
      packageType:          itemType || 'N/A',
      packageDestinations:  item?.destinations?.join(', ') || item?.country || 'N/A',
      packageDuration:      item?.duration || 'N/A',
      packageIncludes:      item?.includes?.join(', ') || item?.highlights?.join(', ') || 'N/A',
      packageRating:        item?.rating || 'N/A',
      departureDate:  form.departureDate || 'Flexible',
      returnDate:     form.returnDate || 'Flexible',
      travelers:      form.travelers,
      tripType:       form.tripType,
      roomType:       form.roomType,
      budget:         form.budget,
      customerMessage: form.message || 'No special requests',
      newsletter:      form.newsletter,
      submittedAt: new Date().toISOString(),
      source: 'Asquare & Co. Website',
    };

    const { id, error } = await saveEnquiry(enquiryData);
    const finalId = id || 'ASQ' + Date.now();

    if (error) {
      const enquiries = JSON.parse(localStorage.getItem('wl_enquiries') || '[]');
      enquiries.unshift({ ...enquiryData, id: finalId });
      localStorage.setItem('wl_enquiries', JSON.stringify(enquiries));
    }

    setEnquiryRef(finalId);

    const fullEnquiry = { ...enquiryData, id: finalId };
    try {
      await Promise.all([
        sendCustomerConfirmation(fullEnquiry),
        sendAdminNotification(fullEnquiry),
      ]);
    } catch (emailErr) {
      console.warn('Email sending skipped:', emailErr.message);
    }

    setStep(3);
    setLoading(false);
  };

  const goToReview = () => {
    if (!form.firstName || !form.email || !form.phone) {
      toast.error('Please fill your name, email and phone.');
      return;
    }
    if (!user) { setShowGate(true); return; }
    setStep(2);
  };

  return (
    <div className="booking-page">

      {/* HERO */}
      <div className="bk-hero">
        <div className="bk-hero-bg" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)` }} />
        <div className="bk-hero-overlay" />
        <div className="bk-hero-content container">
          <p className="bk-eyebrow">✈️ Plan Your Trip</p>
          <h1 className="bk-hero-title">Tell Us Your <em>Dream Trip</em></h1>
          <p className="bk-hero-sub">Fill in your preferences — our experts will craft the perfect itinerary for you</p>
        </div>
      </div>

      {/* STEP PROGRESS */}
      <div className="bk-progress-section">
        <div className="container">
          <div className="bk-progress-bar">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`bkp-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                  <div className="bkp-circle">
                    {i < step ? <Check size={14} strokeWidth={3} /> : s.icon}
                  </div>
                  <span className="bkp-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`bkp-line ${i < step ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bk-main">
        <div className="container">

          {/* STEP 0 — Choose Trip */}
          {step === 0 && (
            <div className="bk-panel animate-up">
              <div className="bk-panel-header">
                <h2 className="bk-panel-title">Choose Your <em>Trip</em></h2>
                <p className="bk-panel-desc">Select a package or destination you're interested in</p>
              </div>
              <div className="trip-grid">
                {ALL_ITEMS.slice(0, 9).map(it => (
                  <div
                    key={it.id}
                    className={`trip-tile ${item?.id === it.id ? 'selected' : ''}`}
                    onClick={() => { setItem(it); setItemType(it._type); setStep(1); }}
                  >
                    <div className="trip-tile-img">
                      <img src={it.image} alt={it.name} loading="lazy" />
                      <div className="trip-tile-dim" />
                      {it._type === 'package' && <span className="trip-tile-badge">Package</span>}
                      {item?.id === it.id && <div className="trip-tile-check"><Check size={15} strokeWidth={3} /></div>}
                    </div>
                    <div className="trip-tile-footer">
                      <span className="trip-tile-name">{it.name}</span>
                      {it.duration && <span className="trip-tile-dur">{it.duration}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{textAlign:'center', fontSize:13, color:'var(--ink-soft)', marginTop:8}}>
                Tap any destination or package to continue
              </p>
            </div>
          )}

          {/* STEP 1 — Your Details */}
          {step === 1 && (
            <div className="bk-panel animate-up">
              <div className="bk-panel-header">
                <h2 className="bk-panel-title">Your <em>Details</em></h2>
                <p className="bk-panel-desc">Tell us about yourself and your travel preferences</p>
              </div>

              <div className="details-grid">
                <div className="details-forms">

                  {/* Personal Info */}
                  <div className="bk-section-card">
                    <h3 className="bk-section-title"><User size={15} /> Personal Information</h3>
                    <div className="fg-2">
                      <div className="ff">
                        <label className="field-label">First Name *</label>
                        <input className="field-input" placeholder="John" value={form.firstName} onChange={e => upd('firstName', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">Last Name</label>
                        <input className="field-input" placeholder="Doe" value={form.lastName} onChange={e => upd('lastName', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">Email Address *</label>
                        <input className="field-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => upd('email', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">Phone Number *</label>
                        <input className="field-input" placeholder="+91 99999 99999" value={form.phone} onChange={e => upd('phone', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">WhatsApp Number</label>
                        <div className="wa-input-wrap">
                          <span className="wa-icon"><i class="fa-brands fa-whatsapp"></i></span>
                          <input className="field-input wa-input" placeholder="Same as phone or different number" value={form.whatsapp} onChange={e => upd('whatsapp', e.target.value)} />
                        </div>
                        <span className="field-hint">Leave blank to use phone number for WhatsApp</span>
                      </div>
                      <div className="ff">
                        <label className="field-label">City / Country</label>
                        <input className="field-input" placeholder="Mumbai, India" value={form.city} onChange={e => upd('city', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Trip Preferences */}
                  <div className="bk-section-card">
                    <h3 className="bk-section-title"><Calendar size={15} /> Trip Preferences</h3>
                    <div className="fg-2">
                      <div className="ff">
                        <label className="field-label">Departure Date</label>
                        <input className="field-input" type="date" value={form.departureDate} onChange={e => upd('departureDate', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">Return Date</label>
                        <input className="field-input" type="date" value={form.returnDate} onChange={e => upd('returnDate', e.target.value)} />
                      </div>
                      <div className="ff">
                        <label className="field-label">No. of Travelers</label>
                        <select className="field-input" value={form.travelers} onChange={e => upd('travelers', e.target.value)}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Person':'People'}</option>)}
                        </select>
                      </div>
                      <div className="ff">
                        <label className="field-label">Trip Type</label>
                        <select className="field-input" value={form.tripType} onChange={e => upd('tripType', e.target.value)}>
                          {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="ff">
                        <label className="field-label">Room Preference</label>
                        <select className="field-input" value={form.roomType} onChange={e => upd('roomType', e.target.value)}>
                          {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="ff">
                        <label className="field-label">Budget per Person</label>
                        <select className="field-input" value={form.budget} onChange={e => upd('budget', e.target.value)}>
                          {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="ff" style={{ marginTop: 4 }}>
                      <label className="field-label">Special Requests / Message to Us</label>
                      <textarea
                        className="field-input"
                        rows={4}
                        placeholder="Tell us anything — dietary needs, honeymoon surprises, accessibility, specific hotels, flight preferences..."
                        value={form.message}
                        onChange={e => upd('message', e.target.value)}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <label className="newsletter-check">
                      <input type="checkbox" checked={form.newsletter} onChange={e => upd('newsletter', e.target.checked)} />
                      <span>Send me exclusive deals and travel inspiration by email</span>
                    </label>
                  </div>
                </div>

                {/* Sidebar */}
                {item && (
                  <div className="details-sidebar">
                    <div className="sum-sidebar sticky-sidebar">
                      <img src={item.image} alt={item.name} className="ssb-img" />
                      <div className="ssb-body">
                        <div className="ssb-title">{item.name}</div>
                        <div className="ssb-rows">
                          <div className="ssb-row"><MapPin size={11} /> {item.country || (item.destinations||[]).join(' · ')}</div>
                          <div className="ssb-row"><Clock size={11} /> {item.duration || '7 Days'}</div>
                          <div className="ssb-row"><Star size={11} fill="#F59E0B" style={{color:'#F59E0B'}} /> {item.rating} rated</div>
                          <div className="ssb-row"><Users size={11} /> {form.travelers} {form.travelers>1?'Travelers':'Traveler'}</div>
                        </div>
                        <div className="ssb-note">
                          💬 Our travel expert will contact you within <strong>2 hours</strong> with a customised quote.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bk-actions">
                <button className="btn-ghost bk-cta" onClick={() => setStep(0)}><ArrowLeft size={15} /> Back</button>
                <button className="btn-primary bk-cta" onClick={goToReview}>
                  Review My Enquiry <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Review & Send */}
          {step === 2 && (
            <div className="bk-panel animate-up">
              <div className="bk-panel-header">
                <h2 className="bk-panel-title">Review & <em>Send</em></h2>
                <p className="bk-panel-desc">Check your details before we send your enquiry to our travel experts</p>
              </div>

              <div className="review-grid">
                <div className="review-left">
                  {item && (
                    <div className="review-card">
                      <h3 className="review-card-title">🌍 Selected Trip</h3>
                      <div className="review-trip-row">
                        <img src={item.image} alt={item.name} className="review-trip-img" />
                        <div>
                          <div className="review-trip-name">{item.name}</div>
                          <div className="review-trip-meta"><MapPin size={10} /> {item.country || (item.destinations||[]).join(', ')}</div>
                          <div className="review-trip-meta"><Clock size={10} /> {item.duration || '7 Days'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="review-card">
                    <h3 className="review-card-title">👤 Your Information</h3>
                    <div className="review-rows">
                      {[
                        ['Name',      `${form.firstName} ${form.lastName}`.trim()],
                        ['Email',     form.email],
                        ['Phone',     form.phone],
                        ['WhatsApp',  form.whatsapp || form.phone],
                        ['City',      form.city || '—'],
                      ].map(([l, v]) => (
                        <div key={l} className="review-row">
                          <span className="review-row-label">{l}</span>
                          <span className="review-row-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="review-card">
                    <h3 className="review-card-title">✈️ Trip Preferences</h3>
                    <div className="review-rows">
                      {[
                        ['Departure',  form.departureDate || 'Flexible'],
                        ['Return',     form.returnDate || 'Flexible'],
                        ['Travelers',  `${form.travelers} ${form.travelers > 1 ? 'People' : 'Person'}`],
                        ['Trip Type',  form.tripType],
                        ['Room',       form.roomType],
                        ['Budget',     form.budget],
                      ].map(([l, v]) => (
                        <div key={l} className="review-row">
                          <span className="review-row-label">{l}</span>
                          <span className="review-row-val">{v}</span>
                        </div>
                      ))}
                    </div>
                    {form.message && (
                      <div className="review-message">
                        <div className="review-row-label">Your Message</div>
                        <p className="review-message-text">"{form.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="review-right">
                  <div className="send-panel">
                    <div className="send-panel-top">
                      <div className="send-icon">📨</div>
                      <h3 className="send-title">Ready to Send?</h3>
                      <p className="send-desc">
                        Our travel expert will contact you within <strong>2 hours</strong> with a personalised quote via call, email or WhatsApp.
                      </p>
                    </div>

                    <div className="send-guarantees">
                      {[
                        ['🔒', 'Your data is 100% secure'],
                        ['📞', 'Expert calls you within 2 hours'],
                        [<FaWhatsapp />, 'WhatsApp support available'],
                        ['✅', 'No payment required now'],
                      ].map(([icon, text]) => (
                        <div key={text} className="send-guarantee">
                          <span>{icon}</span><span>{text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn-primary send-btn"
                      onClick={handleSendEnquiry}
                      disabled={loading}
                    >
                      {loading
                        ? <><div className="spinner" /> Sending...</>
                        : <><Send size={16} /> Send My Enquiry</>
                      }
                    </button>

                    <p className="send-note">
                      By submitting you agree to be contacted by Asquare &amp; Co. Tours &amp; Travels regarding your enquiry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bk-actions">
                <button className="btn-ghost bk-cta" onClick={() => setStep(1)}><ArrowLeft size={15} /> Edit Details</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div className="bk-panel animate-up">
              <div className="confirmed-center">
                <div className="conf-card">
                  <div className="conf-ring">
                    <div className="conf-circle"><Check size={34} strokeWidth={3} /></div>
                  </div>
                  <h2 className="conf-title">Enquiry <em>Submitted!</em> 🎉</h2>
                  <p className="conf-sub">
                    Thank you <strong>{form.firstName}</strong>! Our travel expert will review your request and <strong>contact you within 2 hours</strong> to discuss your dream trip.
                  </p>

                  <div className="conf-id">
                    Reference ID: <strong>{enquiryRef || 'ASQ' + Date.now()}</strong>
                  </div>

                  <div className="conf-details">
                    <div className="cdr"><span>Destination</span><strong>{item?.name || 'N/A'}</strong></div>
                    <div className="cdr"><span>Contact</span><strong>{form.email}</strong></div>
                    <div className="cdr"><span>Phone</span><strong>{form.phone}</strong></div>
                    <div className="cdr"><span>WhatsApp</span><strong>{form.whatsapp || form.phone}</strong></div>
                    <div className="cdr"><span>Travelers</span><strong>{form.travelers} {form.travelers > 1 ? 'People' : 'Person'}</strong></div>
                  </div>

                  <div className="whats-next">
                    <h4>What happens next?</h4>
                    <div className="next-steps">
                      <div className="next-step"><span className="ns-num">1</span><span>Our expert reviews your enquiry</span></div>
                      <div className="next-step"><span className="ns-num">2</span><span>We call / WhatsApp you within 2 hours</span></div>
                      <div className="next-step"><span className="ns-num">3</span><span>We send a customised itinerary & quote</span></div>
                      <div className="next-step"><span className="ns-num">4</span><span>You confirm and we handle everything!</span></div>
                    </div>
                  </div>

                  <div className="conf-btns">
                    <button className="btn-primary conf-home-btn" onClick={() => navigate('/')}>
                      ← Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showGate && (
        <SignInGate
          onClose={() => { setShowGate(false); setStep(step === 1 ? 2 : step); }}
          onSignIn={() => { setShowGate(false); setShowAuthModal(true); }}
        />
      )}
    </div>
  );
}
