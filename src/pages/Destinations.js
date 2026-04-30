import React, { useState } from 'react';
import { useAllDestinations } from '../hooks/useAllData';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Star, ArrowRight, Heart } from 'lucide-react';
import './Destinations.css';

const CATS = ['All', 'Goa', 'India', 'Asia', 'Europe', 'Middle East', 'South America'];

export default function Destinations() {
  const [cat, setCat]   = useState('All');
  const [q, setQ]       = useState('');
  const [sort, setSort] = useState('newest');
  const { destinations } = useAllDestinations();
  const [wishlist, setWishlist] = useState([]);

  const list = destinations
    .filter(d => cat === 'All' || d.category === cat)
    .filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.country.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const toggleWish = id => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <div className="page-wrap">

      {/* HERO */}
      <div className="page-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80)` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-body container">
          <div className="eyebrow" style={{ color: '#FFB899' }}>Destinations</div>
          <h1 className="page-hero-title">Explore <em>The World</em></h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>Goa's finest spots and handpicked destinations worldwide — find your next adventure.</p>
        </div>
      </div>

      {/* STICKY CONTROLS */}
      <div className="dest-controls-section">
        <div className="container">
          {/* Row 1: search + sort */}
          <div className="dest-search-row">
            <div className="dest-search-wrap">
              <Search size={15} className="dsearch-icon" />
              <input
                className="dest-search"
                placeholder="Search destinations..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <div className="sort-wrap">
              <Filter size={13} />
              <select value={sort} onChange={e => setSort(e.target.value)} className="sort-sel">
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
          {/* Row 2: category pills — always scroll horizontal */}
          <div className="cat-bar">
            {CATS.map(c => (
              <button
                key={c}
                className={`cat-pill ${cat === c ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Goa spotlight — compact */}
          {(cat === 'All' || cat === 'Goa') && (
            <div className="goa-spotlight">
              <div className="goa-spotlight-text">
                <div className="goa-spotlight-label">Goa's #1 Specialist</div>
                <div className="goa-spotlight-title">5 Destinations, Infinite Experiences</div>
              </div>
              <Link to="/booking" className="goa-spotlight-btn">
                Plan My Goa Trip <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="container">
        <p className="results-count"><strong>{list.length}</strong> destinations found</p>
        <div className="dest-grid">
          {list.map((d, i) => (
            <div className="dest-card" key={d.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="dc-img-wrap">
                <img src={d.image} alt={d.name} loading="lazy" />
                <button className={`wish-btn ${wishlist.includes(d.id) ? 'wished' : ''}`} onClick={() => toggleWish(d.id)}>
                  <Heart size={13} fill={wishlist.includes(d.id) ? 'currentColor' : 'none'} />
                </button>
                <span className="dc-badge">{d.tag}</span>
                {d.isNew && <span className="dc-new-badge">NEW</span>}
                {d.category === 'Goa' && <span className="dc-goa-badge">Goa</span>}
              </div>
              <div className="dc-body">
                <div className="dc-loc"><MapPin size={10} /> {d.country}</div>
                <h3 className="dc-name">{d.name}</h3>
                <p className="dc-desc">{d.description}</p>
                <div className="dc-chips">
                  {d.highlights.slice(0, 3).map(h => <span key={h} className="dc-chip">✓ {h}</span>)}
                </div>
                <div className="dc-footer">
                  <div className="dc-rating">
                    <Star size={11} fill="#F9A825" style={{ color: '#F9A825' }} /> {d.rating}
                    <span className="dc-reviews">({d.reviews?.toLocaleString()})</span>
                    <span className="dc-dur"> · {d.duration}</span>
                  </div>
                  <Link to="/booking" state={{ destination: d }} className="dc-enquire-btn">
                    Enquire <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && (
          <div className="no-results">
            <div style={{ fontSize: 48 }}>🌍</div>
            <h3>No destinations found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
