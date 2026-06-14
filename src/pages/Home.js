import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testimonials, stats, goaExperiences } from '../data/travelData';
import { useAllDestinations, useAllPackages } from '../hooks/useAllData';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Check, Shield, Headphones, Award, ChevronLeft, ChevronRight, Plane, Heart, Briefcase, GraduationCap, Compass, CheckCircle, Sparkles } from 'lucide-react';
import CustomTripForm from '../components/CustomTripForm';
import './Home.css';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

/* ── Animated counter ── */
function Counter({ value, suffix, active }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0, end = value, dur = 2200, step = end / (dur / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setN(end); clearInterval(t); } else setN(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [active, value]);
  return <>{n.toLocaleString()}{suffix}</>;
}

function useInView(threshold = 0.3) {
  const ref = useRef();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, seen];
}

// 🌴 GOA-FIRST hero slides
const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1800&q=85',
    label: "GOA'S FINEST BEACHES", title: 'Sun, Sand &', titleLine2: 'Pure Freedom.',
    sub: "Golden beaches, crimson sunsets, and a spirit of celebration that lasts well past midnight — this is Goa.",
    dest: 'North Goa, India',
  },
  {
    bg: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=1800&q=85',
    label: 'SOUTH GOA PARADISE', title: 'Where Palms', titleLine2: 'Kiss The Sea.',
    sub: 'Pristine coves, swaying coconut trees and languid afternoons — the softer, soul-stirring side of Goa.',
    dest: 'South Goa, India',
  },
  {
    bg: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1800&q=85',
    label: 'HERITAGE & CULTURE', title: 'Five Centuries', titleLine2: 'Of Beauty.',
    sub: "Golden Portuguese cathedrals, spice-scented lanes, and Goan cuisine that haunts your dreams.",
    dest: 'Old Goa Heritage, India',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [tIdx, setTIdx] = useState(0);
  const [statsRef, statsInView] = useInView();
  const [wishlist, setWishlist] = useState([]);
  const [showIntroMore, setShowIntroMore] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const toggleWish = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const handleSearch = () => {
    navigate(`/packages${to ? `?q=${to}` : ''}`);
  };

  const { destinations } = useAllDestinations();
  const { packages } = useAllPackages();
  const cur = HERO_SLIDES[slide];

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`hero-bg ${i === slide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.bg})` }} />
        ))}
        <div className="hero-overlay" />

        {/* Floating chips */}
        <div className="hero-chips">
          <div className="hero-chip chip1"><span className="hero-chip-dot" /> Goa · 4.9★ Rated</div>
          <div className="hero-chip chip2">🏆 #1 Goa Travel Specialist</div>
          <div className="hero-chip chip3"><Plane size={11} /> 2,000+ Goa Trips Planned</div>
        </div>

        <div className="hero-content-wrap container">
          <div className="hero-content">
            <div className="hero-label">
              <span className="hero-label-dot" />{cur.label}
            </div>
            <h1 className="hero-title">
              <span key={cur.title}>{cur.title}</span>
              <em key={cur.titleLine2}>{cur.titleLine2}</em>
            </h1>
            <p className="hero-sub">{cur.sub}</p>
            <div className="hero-dest"><MapPin size={13} /> {cur.dest}</div>
            <div className="hero-ctas">
              <Link to="/packages" className="btn-primary hero-cta-main">
                Explore Goa Packages <ArrowRight size={16} />
              </Link>
              <Link to="/destinations" className="hero-cta-ghost">
                All Destinations →
              </Link>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="hero-controls">
          <button className="hero-arrow" onClick={() => setSlide(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>
            <ChevronLeft size={18} />
          </button>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
            ))}
          </div>
          <button className="hero-arrow" onClick={() => setSlide(i => (i + 1) % HERO_SLIDES.length)}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="search-lift">
        <div className="container">
          <div className="search-card">
            <div className="search-label">Find Your Perfect Trip</div>
            <div className="search-row">
              <div className="sf">
                <label className="field-label"><MapPin size={11} /> Destination</label>
                <input className="field-input" placeholder="North Goa, South Goa, Palolem..." value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <div className="sf">
                <label className="field-label"><Calendar size={11} /> Travel Date</label>
                <input className="field-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="sf">
                <label className="field-label"><Users size={11} /> Travelers</label>
                <input 
                  type="number" 
                  min="1" 
                  className="field-input" 
                  placeholder="No. of travelers" 
                  value={travelers} 
                  onChange={e => setTravelers(e.target.value)} 
                />
              </div>
              <button className="search-go btn-primary" onClick={handleSearch}>
                <Search size={17} /> Search Trips
              </button>
            </div>
            <div className="search-tags">
              {['🏖️ Beach Goa', '🌴 South Goa', '🏄 Water Sports', '💑 Honeymoon', '🏛️ Heritage', '🌿 Hinterland'].map(t => (
                <button key={t} className="stag" onClick={() => setTo(t.split(' ').slice(1).join(' '))}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO / ABOUT US ── */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-visuals">
              <div className="intro-img-wrapper img-1">
                <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80" alt="Goa Beach" />
              </div>
              <div className="intro-img-wrapper img-2">
                <img src="https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80" alt="South Goa" />
              </div>
              <div className="intro-experience-badge">
                <span className="badge-number">5+</span>
                <span className="badge-text">Years of<br/>Excellence</span>
              </div>
            </div>

            <div className="intro-content-new">
              <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span>Discover Our Story</span>
                <span className="enterprise-badge">
                  <span style={{ opacity: 0.8 }}>A proud enterprise of</span>
                  <img src="/logo2.png" alt="Asquare & Co." style={{ height: '32px', objectFit: 'contain', cursor: 'zoom-in' }} onClick={() => setLogoModalOpen(true)} />
                </span>
              </div>
              <h2 className="display-title" style={{marginBottom: '12px'}}>Welcome to <br/><em>Asquaretour&traveller</em></h2>
              <h3 className="intro-subtitle-new">Crafting Your Memories, One Journey at a Time.</h3>
              
              <p className="intro-text-new">
                Welcome to Asquaretour&traveller, your premier Goa-based travel partner. We don't just book trips—we design experiences and craft lifelong memories. Whether you are looking for a relaxing getaway, a meticulously planned corporate event, or an action-packed student adventure, we handle all the logistics so you can focus entirely on the journey.
              </p>
              <p className="intro-text-new">
                Born and bred in Goa, we take immense pride in being one of the region’s most trusted travel agencies, offering round-the-clock local expertise and a seamless, stress-free travel experience across the length and breadth of India.
              </p>

              {!showIntroMore && (
                <button className="btn-primary" style={{marginTop: '20px', padding: '14px 28px'}} onClick={() => setShowIntroMore(true)}>
                  Discover More <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {showIntroMore && (
            <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <div className="bento-grid" style={{ animation: 'none' }}>
                {/* WHAT WE DO */}
                <div className="bento-card bento-what">
                  <div className="bento-header">
                    <div className="bento-icon"><Compass size={20} /></div>
                    <h4>Our Expertise</h4>
                  </div>
                  <p className="bento-sub">We handle all the logistics so you can focus entirely on the journey. Here's what we do best:</p>
                  <div className="bento-services-grid">
                    <div className="svc-chip">
                      <Compass size={18} className="svc-chip-icon" />
                      <div>
                        <strong>Customized Tours</strong>
                        <span>Tailored exactly to your pace</span>
                      </div>
                    </div>
                    <div className="svc-chip">
                      <MapPin size={18} className="svc-chip-icon" />
                      <div>
                        <strong>Curated Packages</strong>
                        <span>Professionally designed itineraries</span>
                      </div>
                    </div>
                    <div className="svc-chip">
                      <Briefcase size={18} className="svc-chip-icon" />
                      <div>
                        <strong>Corporate & MICE</strong>
                        <span>Seamlessly managed retreats</span>
                      </div>
                    </div>
                    <div className="svc-chip">
                      <GraduationCap size={18} className="svc-chip-icon" />
                      <div>
                        <strong>Educational Travel</strong>
                        <span>Safe, engaging student tours</span>
                      </div>
                    </div>
                    <div className="svc-chip">
                      <Plane size={18} className="svc-chip-icon" />
                      <div>
                        <strong>End-to-End Logistics</strong>
                        <span>Flights, trains, and reliable transit</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHY CHOOSE US */}
                <div className="bento-card bento-why">
                  <div className="bento-header">
                    <div className="bento-icon dark"><Award size={20} /></div>
                    <h4 style={{color: '#fff'}}>Why Choose Us?</h4>
                  </div>
                  <div className="bento-why-list">
                    <div className="bwhy-item">
                      <div className="bwhy-top">
                        <MapPin size={16} color="var(--coral-light)" />
                        <h5>Proudly Goa-Based</h5>
                      </div>
                      <p>Deeply rooted in Goa, offering unmatched local insights and connections.</p>
                    </div>
                    <div className="bwhy-line" />
                    <div className="bwhy-item">
                      <div className="bwhy-top">
                        <Headphones size={16} color="var(--coral-light)" />
                        <h5>24/7 Local Support</h5>
                      </div>
                      <p>Dedicated assistance right here from Goa, every step of your journey.</p>
                    </div>
                    <div className="bwhy-line" />
                    <div className="bwhy-item">
                      <div className="bwhy-top">
                        <Shield size={16} color="var(--coral-light)" />
                        <h5>Trust & Reliability</h5>
                      </div>
                      <p>Transparent pricing, verified stays, and absolute priority on your safety.</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bento-card bento-cta">
                  <div className="bcta-content">
                    <div>
                      <h4>Ready to Start Your Adventure?</h4>
                      <p>Let’s plan a journey that is uniquely yours today.</p>
                    </div>
                  </div>
                  <div className="bcta-actions">
                    <Link to="/packages" className="btn-primary" style={{background: '#fff', color: 'var(--coral)'}}>Explore Packages</Link>
                    <Link to="/contact" className="btn-ghost" style={{borderColor: 'rgba(255,255,255,0.4)', color: '#fff'}}>Contact Us</Link>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <button className="btn-ghost" style={{ padding: '12px 24px', color: 'var(--coral)', borderColor: 'var(--coral)', border: '1px solid' }} onClick={() => setShowIntroMore(false)}>
                  <ChevronLeft size={16} /> Show Less
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) => (
            <React.Fragment key={ri}>
              {['North Goa', 'South Goa', 'Palolem Beach', 'Dudhsagar', 'Anjuna', 'Calangute', 'Fontainhas', 'Baga Beach', 'Old Goa', 'Candolim', 'Vagator', 'Arambol'].map(d => (
                <span key={d} className="marquee-item">{d}</span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── GOA EXPERIENCES ── */}
      <section className="section experiences-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Only in Goa</div>
              <h2 className="display-title">Experiences That <em>Define Goa</em></h2>
              <p className="section-lead">Beyond the beach — the moments that make your Goa story unforgettable.</p>
            </div>
          </div>
          <div className="exp-grid">
            {goaExperiences.map((exp) => (
              <div className="exp-card" key={exp.title}>
                <span className="exp-icon">{exp.icon}</span>
                <div className="exp-title">{exp.title}</div>
                <div className="exp-desc">{exp.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-emoji">{s.icon}</div>
                <div className="stat-value">
                  <Counter value={s.value} suffix={s.suffix} active={statsInView} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS (Goa first) ── */}
      <section className="section destinations-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Top Destinations</div>
              <h2 className="display-title">Where Will You Go <em>Next?</em></h2>
              <p className="section-lead">Goa's finest spots and beyond — your next adventure starts here.</p>
            </div>
            <Link to="/destinations" className="btn-ghost">See All <ArrowRight size={14} /></Link>
          </div>

          {destinations.length > 0 && (
            <div className="dest-bento">
              {destinations.slice(0, 6).map((d, i) => (
                <div key={d.id} className={`dest-tile tile-${i}`}>
                  <img src={d.image} alt={d.name} loading="lazy" />
                  <div className="dest-tile-overlay" />
                  <button
                    className={`wish-btn ${wishlist.includes(d.id) ? 'wished' : ''}`}
                    onClick={() => toggleWish(d.id)}
                  >
                    <Heart size={14} fill={wishlist.includes(d.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="dest-tile-tag">{d.tag}</div>
                  <div className="dest-tile-info">
                    <div className="dest-tile-country"><MapPin size={10} /> {d.country}</div>
                    <h3 className="dest-tile-name">{d.name}</h3>
                    <div className="dest-tile-row">
                      <Link to="/booking" state={{ destination: d }} className="tile-book-btn">
                        Book <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {destinations.length === 0 && (
            <div className="text-center" style={{ padding: '10px 20px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Amazing Destinations Adding Soon!</h3>
              <p style={{ color: 'var(--ink-soft)' }}>We're currently curating the best spots for you.</p>
            </div>
          )}

          <div>
            <CustomTripForm />
          </div>
        </div>
      </section>

      {/* ── GOA HIGHLIGHT BANNER ── */}
      <div className="goa-banner">
        <div className="container">
          <div className="goa-banner-inner">
            <div className="goa-banner-text">
              <div className="goa-banner-eyebrow">Goa's #1 Travel Specialist</div>
              <h2 className="goa-banner-title">
                Goa Done <em>Right.</em><br />Every Single Time.
              </h2>
              <p className="goa-banner-sub">
                We've planned 2,000+ Goa trips. We know the hidden shacks, the secret beaches, 
                the best sunset spots, and how to avoid the tourist traps — so you get the 
                real Goa, not the brochure version.
              </p>
              <div className="goa-banner-actions">
                <Link to="/packages" className="goa-banner-btn">
                  See Goa Packages <ArrowRight size={15} />
                </Link>
                <Link to="/booking" className="goa-banner-ghost">
                  Talk to a Goa Expert →
                </Link>
              </div>
            </div>
            <div className="goa-banner-imgs">
              <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80" alt="Goa Beach" className="goa-banner-img" />
              <img src="https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80" alt="South Goa" className="goa-banner-img" />
              <img src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80" alt="Old Goa" className="goa-banner-img" />
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80" alt="Luxury Goa" className="goa-banner-img" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PACKAGES ── */}
      <section className="section packages-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Holiday Packages</div>
              <h2 className="display-title">All-Inclusive <em className="teal-em">Getaways</em></h2>
              <p className="section-lead">Goa packages and beyond — everything included for one unforgettable price.</p>
            </div>
          </div>
          <div className="pkg-grid">
            {packages.slice(0, 6).map((pkg, i) => (
              <div key={pkg.id} className="pkg-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="pkg-img-wrap">
                  <img src={pkg.image} alt={pkg.name} loading="lazy" />
                  <div className="pkg-tag-wrap">
                    <span className="pkg-cat-tag" style={{ background: pkg.color }}>{pkg.tag}</span>
                  </div>
                  <div className="pkg-overlay" />
                </div>
                <div className="pkg-body">
                  <div className="pkg-dests">
                    {pkg.destinations.map(d => (
                      <span key={d} className="pkg-dest"><MapPin size={9} /> {d}</span>
                    ))}
                  </div>
                  <h3 className="pkg-name">{pkg.name}</h3>
                  <p className="pkg-duration">{pkg.duration} · All Inclusive · ⭐ {pkg.rating}</p>
                  <div className="pkg-includes">
                    {pkg.includes.slice(0, 4).map(inc => (
                      <div key={inc} className="pkg-inc"><Check size={11} /> {inc}</div>
                    ))}
                    {pkg.includes.length > 4 && <div className="pkg-more">+{pkg.includes.length - 4} more</div>}
                  </div>
                  <div className="pkg-footer">
                    <Link to="/booking" state={{ package: pkg }} className="btn-primary" style={{ padding: '11px 20px', fontSize: '13px' }}>
                      Enquire Now <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <div className="eyebrow">Why Asquaretravelgoa</div>
              <h2 className="display-title">Goa Experts.<br /><em>Genuine Care.</em></h2>
              <p className="section-lead">We're Goa specialists first. 5 years on the ground means we know every tide, every shack owner, every hidden trail — and we use it all to craft your perfect trip.</p>

              <div className="why-features">
                {[
                  { icon: <Shield size={20} />, color: '#FF5722', title: '5 Years of Expertise', desc: 'Goa specialists since 2019 — we know every hidden beach, shack and secret spot on the island.' },
                  { icon: <Headphones size={20} />, color: '#00897B', title: '24/7 Goa Helpline', desc: 'Our on-ground Goa team is always reachable. Pre-trip or mid-trip, we\'ve got you.' },
                  { icon: <Award size={20} />, color: '#F9A825', title: 'Goa\'s #1 Specialist', desc: 'Voted Best Goa Travel Agency 4 years running. 1,000+ trips. 98% satisfaction.' },
                  { icon: <Check size={20} />, color: '#3949AB', title: 'Free Cancellation', desc: 'Cancel up to 15 days before — no fees, full refund. Travel worry-free.' },
                ].map(f => (
                  <div className="why-feat" key={f.title}>
                    <div className="why-feat-icon" style={{ background: f.color + '18', color: f.color }}>{f.icon}</div>
                    <div>
                      <div className="why-feat-title">{f.title}</div>
                      <div className="why-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/packages" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '24px' }}>
                Plan My Goa Trip <ArrowRight size={16} />
              </Link>
            </div>

            <div className="why-right">
              <div className="why-mosaic">
                <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80" alt="" className="wm-1" />
                <img src="https://images.unsplash.com/photo-1587922546307-776227941871?w=500&q=80" alt="" className="wm-2" />
                <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&q=80" alt="" className="wm-3" />
                <div className="why-badge">
                  <div className="wb-value">2K+</div>
                  <div className="wb-label">Goa Trips Planned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="text-center mb-32">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Traveler Stories</div>
            <h2 className="display-title" style={{marginBottom: '15px'}}>Real Stories, <em>Real Magic</em></h2>
          </div>
          <div className="testimonials-row">
            {testimonials.map((t, i) => (
              <div key={t.id} className={`t-card ${i === tIdx ? 'featured' : ''}`} onClick={() => setTIdx(i)}>
                <div className="t-stars">{'★'.repeat(t.rating)}</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-meta">{t.location} · {t.trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-bg" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80)` }} />
        <div className="cta-overlay" />
        <div className="cta-content container">
          <h2 className="cta-title">Your Perfect <br /><em>Goa Trip Awaits</em></h2>
          <p className="cta-sub">Tell us your dream trip and our Goa experts will craft a personalised itinerary just for you — completely free.</p>
          <div className="cta-actions">
            <Link to="/booking" className="btn-primary cta-btn">
              Plan My Goa Trip <ArrowRight size={16} />
            </Link>
            <div className="cta-perks">
              <span>✓ Free consultation</span>
              <span>✓ Expert guidance</span>
              <span>✓ Customised itinerary</span>
            </div>
          </div>
        </div>
      </section>
      {/* Logo Modal */}
      {logoModalOpen && (
        <div className="logo-modal-overlay" onClick={e => e.target === e.currentTarget && setLogoModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="logo-modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '24px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <img src="/logo2.png" alt="Asquare & Co. Logo" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
            <button className="btn-ghost" onClick={() => setLogoModalOpen(false)} style={{ background: '#f3f4f6', color: '#111', padding: '10px 24px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>← Back</button>
          </div>
        </div>
      )}

    </div>
  );
}
