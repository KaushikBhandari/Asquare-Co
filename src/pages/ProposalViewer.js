import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItineraryById, updateItineraryStatus } from '../firebase/config';
import { MapPin, Calendar, CheckCircle, Info, Check, Plane, Car, Bed, Download, Share2, X, Coffee, Soup, Utensils, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_PHONE } from '../config/adminConfig';
import './ProposalViewer.css';

const SUPPORT_NUMBER = '919529338747'; // Admin / Support number

export default function ProposalViewer() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItin = async () => {
      const res = await getItineraryById(id);
      if (!res.error) {
        setItinerary(res);
      } else {
        toast.error('Proposal not found');
      }
      setLoading(false);
    };
    fetchItin();
  }, [id]);

  const handleConfirm = async () => {
    setConfirming(true);
    const { error } = await updateItineraryStatus(id, 'confirmed');
    if (!error) {
      toast.success('Trip confirmed! Redirecting to WhatsApp...', { duration: 4000 });
      setItinerary(prev => ({ ...prev, status: 'confirmed' }));
      
      const waMessage = `Hello Asquaretravelgoa team!%0A%0AI would like to CONFIRM my trip:%0A*${itinerary.title}*%0AClient Name: ${itinerary.clientName}%0AProposal Link: ${window.location.href}%0A%0APlease let me know the next steps for payment and booking.`;
      const waUrl = `https://wa.me/${SUPPORT_NUMBER}?text=${waMessage}`;
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1500);
      
    } else {
      toast.error('Failed to confirm trip. Please try again.');
    }
    setConfirming(false);
  };

  if (loading) {
    return (
      <div className="proposal-loader">
        <div className="spinner"></div>
        <p>Curating your experience...</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="proposal-not-found">
        <h2>Proposal Not Found</h2>
        <p>The link might be invalid or expired.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Return to Home</button>
      </div>
    );
  }

  const isConfirmed = itinerary.status === 'confirmed';

  return (
    <div className="tf-proposal-wrapper">
      {/* TOP NAVBAR */}
      <nav className="tf-navbar">
        <div className="tf-container navbar-inner">
          <div className="tf-brand">
            <img src="/logo.jpeg" alt="Asquaretravelgoa" />
            <span>Asquaretravelgoa</span>
          </div>
          <div className="tf-nav-actions">
            <button className="tf-icon-btn" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}><Share2 size={18}/> Share</button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="tf-hero">
        {itinerary.coverImage ? (
          <div className="tf-hero-bg" style={{ backgroundImage: `url(${itinerary.coverImage})` }} />
        ) : (
          <div className="tf-hero-bg fallback-bg" />
        )}
        <div className="tf-hero-overlay"></div>
        <div className="tf-container tf-hero-content animate-up">
          <div className="tf-badge">Specially crafted for {itinerary.clientName}</div>
          <h1>{itinerary.title}</h1>
          <div className="tf-hero-meta">
            <span><Calendar size={16}/> {itinerary.days?.length || 0} Days</span>
            <span><MapPin size={16}/> {itinerary.title.includes('Maldives') ? 'Maldives' : itinerary.title.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <div className="tf-container tf-main-layout">
        
        {/* LEFT COLUMN - CONTENT */}
        <div className="tf-content-col">
          
          {isConfirmed && (
            <div className="tf-success-banner animate-up">
              <CheckCircle size={24} color="#059669" />
              <div>
                <h3>Trip Confirmed Successfully</h3>
                <p>Our team has been notified and will reach out to you shortly with next steps.</p>
              </div>
            </div>
          )}

          {/* TAB BAR */}
          <div className="tf-tabs animate-up" style={{ animationDelay: '0.1s' }}>
            <button className={`tf-tab ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>Itinerary</button>
            <button className={`tf-tab ${activeTab === 'inclusions' ? 'active' : ''}`} onClick={() => setActiveTab('inclusions')}>Inclusions</button>
            <button className={`tf-tab ${activeTab === 'exclusions' ? 'active' : ''}`} onClick={() => setActiveTab('exclusions')}>Exclusions</button>
          </div>

          {/* TAB CONTENT: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="tf-tab-content animate-up" style={{ animationDelay: '0.2s' }}>
              <div className="tf-itinerary-summary" style={{ marginBottom: '30px', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '18px', color: '#1E293B', marginBottom: '15px' }}>Itinerary at a Glance</h3>
                {itinerary.summary ? (
                  <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '15px' }}>{itinerary.summary}</p>
                ) : (
                  <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '15px' }}>
                    Welcome to your curated {itinerary.days?.length || 0}-day experience: <strong>{itinerary.title}</strong>. 
                    {itinerary.days?.length > 1 && ` Starting with ${itinerary.days[0].title?.toLowerCase() || 'your arrival'} and culminating with ${itinerary.days[itinerary.days.length - 1].title?.toLowerCase() || 'your departure'}, this itinerary has been thoughtfully designed to provide a perfect balance of exploration and relaxation.`} 
                    {' '}Enjoy seamless transfers, comfortable accommodations, and memorable activities tailored just for you.
                  </p>
                )}
                {itinerary.days && itinerary.days.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {itinerary.days.map((day, idx) => (
                      <li key={idx} style={{ marginBottom: '8px', color: '#334155', display: 'flex', gap: '10px' }}>
                        <strong style={{ minWidth: '55px', color: '#059669' }}>Day {idx + 1}:</strong> 
                        <span>{day.title || `Day ${idx + 1} Schedule`}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="tf-timeline">
                {itinerary.days?.map((day, idx) => (
                  <div key={idx} className="tf-day-card-v2">
                    {day.image && (
                      <div className="tf-day-image-side">
                        <img src={day.image} alt={day.title || 'Day activities'} />
                      </div>
                    )}
                    
                    <div className="tf-day-info-side">
                      <div className="tf-day-header">
                        <div className="tf-day-badge">Day {idx + 1}</div>
                        <h3 className="tf-day-title">{day.title || `Day ${idx + 1} Schedule`}</h3>
                      </div>

                      {day.description && (
                        <div className="tf-day-description" style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                          {day.description}
                        </div>
                      )}

                      <div className="tf-modules">
                        {/* FLIGHT MODULE */}
                        {day.flight && (
                          <div className="tf-module flight">
                            <div className="tf-mod-icon"><Plane size={18}/></div>
                            <div className="tf-mod-content">
                              <h4>Flight Details</h4>
                              <p>{day.flight}</p>
                            </div>
                          </div>
                        )}

                        {/* TRANSFER MODULE */}
                        {day.transfer && (
                          <div className="tf-module transfer">
                            <div className="tf-mod-icon"><Car size={18}/></div>
                            <div className="tf-mod-content">
                              <h4>Transfer</h4>
                              <p>{day.transfer}</p>
                            </div>
                          </div>
                        )}

                        {/* HOTEL MODULE */}
                        {day.hotel && (
                          <div className="tf-module hotel">
                            <div className="tf-mod-icon"><Bed size={18}/></div>
                            <div className="tf-mod-content">
                              <h4>Check-in to Hotel</h4>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{day.hotel}</p>
                            </div>
                          </div>
                        )}

                        {/* ACTIVITY MODULE */}
                        {day.activity && (
                          <div className="tf-module activity">
                            <div className="tf-mod-icon"><MapPin size={18}/></div>
                            <div className="tf-mod-content">
                              <h4>Activities & Leisure</h4>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{day.activity}</p>
                            </div>
                          </div>
                        )}

                        {/* MEALS MODULE */}
                        {(day.breakfast || day.lunch || day.dinner) && (
                          <div className="tf-module meals">
                            <div className="tf-mod-icon"><UtensilsCrossed size={18}/></div>
                            <div className="tf-mod-content">
                              <h4>Meals Included</h4>
                              <p style={{ display: 'flex', gap: '15px', color: '#475569', fontWeight: 500 }}>
                                {day.breakfast && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Coffee size={14} color="#EA580C"/> Breakfast</span>}
                                {day.lunch && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Soup size={14} color="#EA580C"/> Lunch</span>}
                                {day.dinner && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Utensils size={14} color="#EA580C"/> Dinner</span>}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: INCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="tf-tab-content animate-up">
              <div className="tf-inc-card">
                <h3 style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <CheckCircle size={22} /> Included in your package
                </h3>
                <ul className="tf-inc-list">
                  {itinerary.incBreakfast && <li><Check size={16} color="#059669"/> <span>Breakfast</span></li>}
                  {itinerary.incLunch && <li><Check size={16} color="#059669"/> <span>Lunch</span></li>}
                  {itinerary.incDinner && <li><Check size={16} color="#059669"/> <span>Dinner</span></li>}
                  {itinerary.inclusions?.split('\n').map((item, i) => item.trim() ? (
                    <li key={`inc-${i}`}><Check size={16} color="#059669"/> <span>{item.replace(/^-\s*/, '')}</span></li>
                  ) : null)}
                </ul>
              </div>
            </div>
          )}

          {/* TAB CONTENT: EXCLUSIONS */}
          {activeTab === 'exclusions' && (
            <div className="tf-tab-content animate-up">
              <div className="tf-inc-card">
                <h3 style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Info size={22} /> Not Included
                </h3>
                <ul className="tf-inc-list">
                  {itinerary.excBreakfast && <li><X size={16} color="#DC2626"/> <span>Breakfast</span></li>}
                  {itinerary.excLunch && <li><X size={16} color="#DC2626"/> <span>Lunch</span></li>}
                  {itinerary.excDinner && <li><X size={16} color="#DC2626"/> <span>Dinner</span></li>}
                  {itinerary.exclusions?.split('\n').map((item, i) => item.trim() ? (
                    <li key={`exc-${i}`}><X size={16} color="#DC2626"/> <span>{item.replace(/^-\s*/, '')}</span></li>
                  ) : null)}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - STICKY SIDEBAR */}
        <div className="tf-sidebar-col">
          <div className="tf-pricing-card animate-up" style={{ animationDelay: '0.3s' }}>
            <div className="tf-price-header">
              <span className="tf-price-label">Total Package Price</span>
              <span className="tf-price-val">{itinerary.totalPrice?.includes('₹') || itinerary.totalPrice?.toLowerCase().includes('rs') ? itinerary.totalPrice : `₹ ${itinerary.totalPrice}`}</span>
              <span className="tf-price-sub">For all travelers, inclusive of taxes</span>
            </div>
            
            <div className="tf-price-summary">
              <div className="tps-row">
                <span>Duration</span>
                <span>{itinerary.days?.length || 0} Days</span>
              </div>
              {itinerary.checkIn && (
                <div className="tps-row">
                  <span>Check-In</span>
                  <span>{itinerary.checkIn}</span>
                </div>
              )}
              {itinerary.checkOut && (
                <div className="tps-row">
                  <span>Check-Out</span>
                  <span>{itinerary.checkOut}</span>
                </div>
              )}
              <div className="tps-row">
                <span>Destinations</span>
                <span>{itinerary.days?.length || 0}</span>
              </div>
            </div>

            <button 
              className={`tf-book-btn ${isConfirmed ? 'is-confirmed' : ''}`}
              onClick={handleConfirm}
              disabled={confirming || isConfirmed}
            >
              {confirming ? (
                <span className="spinner small"></span>
              ) : isConfirmed ? (
                <><CheckCircle size={20} /> Booking Confirmed</>
              ) : (
                'Book Now'
              )}
            </button>
            {!isConfirmed && <p className="tf-book-hint">Clicking Book Now will confirm your intent and notify our team.</p>}
            
            <div className="tf-need-help">
              <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '5px' }}>Need help?</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Call our travel experts anytime</div>
              <a href={`tel:+91${SUPPORT_NUMBER}`} className="tf-phone-link">+91 95293 38747</a>
            </div>
          </div>
        </div>

      </div>
      
      <div className="tf-footer">
        <p>© {new Date().getFullYear()} Asquaretravelgoa Tours & Travels. All rights reserved.</p>
      </div>
    </div>
  );
}
