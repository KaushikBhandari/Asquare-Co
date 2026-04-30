import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testimonials, stats, goaExperiences } from '../data/travelData';
import { useAllDestinations, useAllPackages } from '../hooks/useAllData';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Check, Shield, Headphones, Award, ChevronLeft, ChevronRight, Plane, Heart } from 'lucide-react';
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
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [tIdx, setTIdx] = useState(0);
  const [statsRef, statsInView] = useInView();
  const [wishlist, setWishlist] = useState([]);

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
                <select className="field-input" value={travelers} onChange={e => setTravelers(e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                </select>
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
              <div className="eyebrow">Why Asquare &amp; Co.</div>
              <h2 className="display-title">Goa Experts.<br /><em>Genuine Care.</em></h2>
              <p className="section-lead">We're Goa specialists first. 15 years on the ground means we know every tide, every shack owner, every hidden trail — and we use it all to craft your perfect trip.</p>

              <div className="why-features">
                {[
                  { icon: <Shield size={20} />, color: '#FF5722', title: '15 Years of Expertise', desc: 'Goa specialists since 2009 — we know every hidden beach, shack and secret spot on the island.' },
                  { icon: <Headphones size={20} />, color: '#00897B', title: '24/7 Goa Helpline', desc: 'Our on-ground Goa team is always reachable. Pre-trip or mid-trip, we\'ve got you.' },
                  { icon: <Award size={20} />, color: '#F9A825', title: 'Goa\'s #1 Specialist', desc: 'Voted Best Goa Travel Agency 4 years running. 2,000+ trips. 98% satisfaction.' },
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

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/logo.jpeg" alt="Asquare & Co." className="footer-logo-img" />
                <div>
                  <div className="footer-logo-name">Asquare <strong>&amp; Co.</strong></div>
                  <div className="footer-logo-sub">Tours &amp; Travels · Goa Specialists</div>
                </div>
              </div>
              <p className="footer-tagline">Goa's most trusted travel partner since 2009. We craft extraordinary journeys across Goa and beyond — your dream trip is our mission.</p>
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn"><Instagram size={16} /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn"><Facebook size={16} /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn"><Twitter size={16} /></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn"><Youtube size={16} /></a>
              </div>
            </div>
            <div className="footer-links-grid">
              {[
                { heading: 'Goa Trips', links: ['North Goa', 'South Goa', 'Old Goa Heritage', 'Goa Honeymoon', 'Goa Adventure', 'Luxury Goa'] },
                { heading: 'Beyond Goa', links: ['Kerala', 'Rajasthan', 'Maldives', 'Bali', 'Europe', 'Dubai'] },
                { heading: 'Support', links: ['Plan My Trip', 'Help Center', 'Cancellations', 'Travel Insurance', 'Contact Us'] },
              ].map(col => (
                <div key={col.heading} className="footer-col">
                  <h4 className="footer-heading">{col.heading}</h4>
                  {col.links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Asquare &amp; Co. Tours &amp; Travels. All rights reserved.</span>
            <a href="https://crelante.com" target="_blank" rel="noreferrer" className="powered-by">
              Powered by <strong>Crelante</strong>
            </a>
            <div className="footer-legal">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
