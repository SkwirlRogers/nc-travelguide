import React, { useState } from 'react';
import { Sparkles, Utensils, Mountain, Sun, Heart, ExternalLink, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { searchExperiences } from '../utils/dataHelpers';

export default function TravelIdeasPage({ navigate, onToggleSave, isSaved }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Travel Trails' },
    { id: 'coastal', label: 'Coastal Escapes & Beaches' },
    { id: 'mountains', label: 'Mountain Summits & Waterfalls' },
    { id: 'family', label: 'Family Fun & Theme Parks' },
    { id: 'culinary', label: 'Culinary Trails & NC BBQ' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
            <Sparkles size={16} /> Curated Destination Collections
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Featured Travel Ideas & <span className="text-gradient-amber">NC Hotspots</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Handpicked thematic itineraries: oceanfront beaches, 6,000 ft mountain peaks, world-famous barbecue pits, theme parks, and roaring waterfalls.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: COASTAL ESCAPES */}
        {(activeCategory === 'all' || activeCategory === 'coastal') && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Sun size={26} color="var(--accent-teal)" />
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Coastal Escapes & Atlantic Beaches</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'Cape Hatteras National Seashore', county: 'Dare County', desc: 'Unspoiled barrier islands, iconic black-and-white spiraled lighthouse, world-class surf, and wild Atlantic waves.' },
                { title: 'Emerald Isle & Crystal Coast', county: 'Carteret County', desc: 'Crystal-clear emerald waters, family beach cottages, Fort Macon State Park, and wild horses of Shackleford Banks.' },
                { title: 'Wrightsville Beach', county: 'New Hanover County', desc: 'Vibrant coastal watersports hub famous for paddleboarding, oceanfront dining, and proximity to historic Wilmington.' },
                { title: 'Sunset Beach & Bald Head Island', county: 'Brunswick County', desc: 'Car-free island sanctuary with Old Baldy Lighthouse, maritime forests, and serene southern coast beaches.' }
              ].map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-teal)' }}>
                  <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>{item.county}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>{item.desc}</p>
                  <button 
                    onClick={() => navigate(`/counties/${item.county.toLowerCase().replace(/\s+/g, '-')}`)}
                    style={{ fontSize: '0.85rem', color: '#2dd4bf', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    View {item.county} Guide <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: MOUNTAIN SUMMITS */}
        {(activeCategory === 'all' || activeCategory === 'mountains') && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Mountain size={26} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Mountain Summits & Waterfalls</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'Blue Ridge Parkway & Linn Cove Viaduct', county: 'Avery / Watauga County', desc: 'America’s favorite scenic drive wrapping around Grandfather Mountain with breathtaking autumn foliage views.' },
                { title: 'Grandfather Mountain Swinging Bridge', county: 'Avery County', desc: 'Mile-High Swinging Bridge spanning a 80-foot chasm with 360-degree panoramic mountain ridge vistas.' },
                { title: 'Mount Mitchell State Park', county: 'Yancey County', desc: 'The highest peak east of the Mississippi River at 6,684 feet elevation with cool spruce-fir forests.' },
                { title: 'Looking Glass Falls & Sliding Rock', county: 'Transylvania County', desc: 'Land of Waterfalls hero spot featuring a 60-foot cascading falls and natural 60-foot mountain rock waterslide.' }
              ].map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-amber)' }}>
                  <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>{item.county}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>{item.desc}</p>
                  <button 
                    onClick={() => navigate('/experiences?query=' + encodeURIComponent(item.title))}
                    style={{ fontSize: '0.85rem', color: 'var(--accent-amber-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    Explore Experience Details <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: FAMILY FUN & THEME PARKS */}
        {(activeCategory === 'all' || activeCategory === 'family') && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Sparkles size={26} color="var(--accent-blue)" />
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Family Fun & Theme Parks</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'Carowinds Amusement Park', county: 'Mecklenburg County', desc: 'Roller coaster capital of the Carolinas straddling the NC/SC state line with Fury 325 giga-coaster.' },
                { title: 'U.S. National Whitewater Center', county: 'Mecklenburg County', desc: 'World’s largest man-made whitewater river facility with Olympic rafting, ziplining, and trails.' },
                { title: 'North Carolina Zoo', county: 'Randolph County', desc: 'The world’s largest natural-habitat zoo spanning 2,600 acres with over 1,800 animals from Africa & North America.' },
                { title: 'Tweetsie Railroad', county: 'Watauga County', desc: 'Historic Wild West theme park in Blowing Rock featuring steam locomotive rides and mountain family shows.' }
              ].map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-blue)' }}>
                  <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{item.county}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>{item.desc}</p>
                  <button 
                    onClick={() => navigate('/experiences?query=' + encodeURIComponent(item.title))}
                    style={{ fontSize: '0.85rem', color: 'var(--accent-blue-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    View Theme Park Listing <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: CULINARY & BBQ TRAILS */}
        {(activeCategory === 'all' || activeCategory === 'culinary') && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Utensils size={26} color="#f87171" />
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Culinary Trails & Legendary NC BBQ</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#f87171' }}>
                The Great North Carolina Barbecue Debate: Eastern vs. Lexington
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Eastern NC Style</span>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Whole-Hog & Vinegar Pepper Sauce</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Uses the whole pig slow-roasted over hardwood coals, chopped fine, and doused in a fiery vinegar-and-red-pepper sauce. Served with mayonnaise coleslaw. Landmark spots: <strong>Skylight Inn (Ayden)</strong>, <strong>B's Barbecue (Greenville)</strong>.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <span className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>Piedmont / Lexington Style</span>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Pork Shoulder & Sweet Tomato Dip</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Focuses exclusively on pork shoulder, chopped or sliced, dressed with a vinegar sauce enhanced with ketchup and sweet spices. Served with red BBQ slaw. Landmark spots: <strong>Lexington BBQ (Lexington)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
