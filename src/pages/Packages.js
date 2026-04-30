import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllDestinations, useAllPackages } from '../hooks/useAllData';
import { MapPin, Clock, Check, ArrowRight, Star } from 'lucide-react';
import './Packages.css';

export default function Packages() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { destinations } = useAllDestinations();
  const { packages } = useAllPackages();

  const filters = [
    { id: 'all',       label: 'All Packages' },
    { id: 'goa',       label: 'Goa' },
    { id: 'honeymoon', label: 'Honeymoon' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'luxury',    label: 'Luxury' },
    { id: 'india',     label: 'India' },
  ];

  const filteredPackages = packages.filter(pkg => {
    if (activeFilter === 'all') return true;
    const t = pkg.tag?.toLowerCase() || '';
    const dests = pkg.destinations?.map(d => d.toLowerCase()).join(',') || '';
    if (activeFilter === 'goa')       return t.includes('goa') || dests.includes('goa');
    if (activeFilter === 'honeymoon') return t.includes('honeymoon');
    if (activeFilter === 'adventure') return t.includes('adventure');
    if (activeFilter === 'luxury')    return t.includes('luxury');
    if (activeFilter === 'india')     return t.includes('india') || t.includes('goa');
    return true;
  });

  return (
    <div className="page-wrap packages-page">

      {/* HERO */}
      <div className="page-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1587922546307-776227941871?w=1600&q=80)` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-body container">
          <div className="eyebrow" style={{ color: '#FFB899' }}>Holiday Packages</div>
          <h1 className="page-hero-title">Curated <em>Packages</em></h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>Goa specials to global getaways — all-inclusive, perfectly planned, zero hassle.</p>
        </div>
      </div>

      {/* FILTER TABS — NO promo strip */}
      <div className="pkg-filters-section">
        <div className="container">
          <div className="pkg-filters">
            {filters.map(f => (
              <button
                key={f.id}
                className={`pkg-filter-btn ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container page-body">

        {/* Goa highlight banner — only on goa/all filter */}
        {(activeFilter === 'all' || activeFilter === 'goa') && (
          <div className="goa-pkg-hero">
            <div className="goa-pkg-hero-text">
              <div className="goa-pkg-hero-eyebrow">Goa's #1 Specialist — 15 Years Experience</div>
              <h2 className="goa-pkg-hero-title">Goa Packages <em>Built Different.</em></h2>
              <p className="goa-pkg-hero-sub">We know every secret beach, hidden shack, and magical sunset spot. Our Goa packages are crafted from real experience — not Google searches.</p>
            </div>
            <Link to="/booking" className="goa-pkg-hero-btn">
              Plan My Goa Trip <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Section label */}
        <div className="pkg-section-label">
          <div className="eyebrow">{activeFilter === 'goa' ? 'Goa Packages' : 'All-Inclusive Packages'}</div>
          <h2 className="display-title">Our <em>Bestsellers</em></h2>
        </div>

        {/* Package cards — NO pricing */}
        <div className="featured-pkgs">
          {filteredPackages.map((pkg, i) => (
            <div key={pkg.id} className="feat-pkg-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="fpkg-img">
                <img src={pkg.image} alt={pkg.name} />
                <div className="fpkg-tags">
                  <span className="fpkg-tag" style={{ background: pkg.color }}>{pkg.tag}</span>
                </div>
                <div className="fpkg-img-overlay" />
              </div>
              <div className="fpkg-body">
                <div>
                  <div className="fpkg-dests">
                    {pkg.destinations.map(d => (
                      <span key={d} className="fpkg-dest"><MapPin size={9} /> {d}</span>
                    ))}
                  </div>
                  <h3 className="fpkg-name">{pkg.name}</h3>
                  <div className="fpkg-meta">
                    <span className="fpkg-meta-item"><Clock size={12} /> {pkg.duration}</span>
                    <span className="fpkg-meta-item"><Star size={12} fill="#F9A825" style={{ color: '#F9A825' }} /> {pkg.rating}</span>
                    <span className="tag-all-inc">All Inclusive</span>
                  </div>
                  <div className="fpkg-includes">
                    {pkg.includes.map(inc => (
                      <div key={inc} className="fpkg-inc"><Check size={11} /> {inc}</div>
                    ))}
                  </div>
                </div>
                <div className="fpkg-footer">
                  <div className="fpkg-contact-note">Contact us for pricing & availability</div>
                  <Link to="/booking" state={{ package: pkg }} className="btn-primary fpkg-btn">
                    Enquire Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Individual Destinations */}
        <div className="pkg-section-label" style={{ marginTop: 64 }}>
          <div className="eyebrow">Individual Destinations</div>
          <h2 className="display-title">Pick Your <em className="teal-em">Paradise</em></h2>
        </div>

        <div className="single-dest-grid">
          {destinations.map(d => (
            <div key={d.id} className="sd-card">
              <div className="sd-img-wrap">
                <img src={d.image} alt={d.name} loading="lazy" />
                <span className="sd-badge" style={{ background: d.category === 'Goa' ? 'var(--coral)' : 'var(--teal)' }}>{d.tag}</span>
                {d.category === 'Goa' && <span className="sd-goa-badge">Goa</span>}
              </div>
              <div className="sd-body">
                <div className="sd-loc"><MapPin size={9} /> {d.country}</div>
                <h4 className="sd-name">{d.name}</h4>
                <div className="sd-meta">
                  <Star size={11} fill="#F9A825" style={{ color: '#F9A825' }} /> {d.rating}
                  <span>· {d.duration}</span>
                </div>
                <Link to="/booking" state={{ destination: d }} className="sd-enquire-btn">
                  Enquire <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
