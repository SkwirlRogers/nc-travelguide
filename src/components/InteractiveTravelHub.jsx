import React, { useState } from 'react';
import { MapPin, Navigation, Star, Compass, TrendingUp, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';

const CORRIDORS = [
  {
    id: 'brp',
    name: 'Blue Ridge Parkway (NC Section)',
    region: 'Mountain',
    status: 'Scenic Advisory',
    statusType: 'amber',
    miles: '252 miles (Milepost 217–469)',
    highlights: 'Linn Cove Viaduct, Grandfather Mountain, Craggy Gardens, Mount Mitchell',
    advisory: 'Check seasonal fog & high-elevation weather advisories near Milepost 305–355.'
  },
  {
    id: 'i40',
    name: 'I-40 Mountain-to-Coast Corridor',
    region: 'Statewide',
    status: 'Clear',
    statusType: 'emerald',
    miles: '420 miles (Tennessee Line to Wilmington)',
    highlights: 'Asheville, Winston-Salem, Greensboro, Raleigh, Wilmington',
    advisory: 'Normal traffic flow across Piedmont & Coastal sections.'
  },
  {
    id: 'nc12',
    name: 'Outer Banks Scenic Byway (NC-12)',
    region: 'Atlantic Coastal',
    status: 'Ferry & Tide Watch',
    statusType: 'blue',
    miles: '138 miles (Corolla to Beaufort)',
    highlights: 'Cape Hatteras Lighthouse, Ocracoke Island Ferry, Jockey’s Ridge',
    advisory: 'NCDOT Ocracoke–Cedar Island & Hatteras ferries operating on regular schedule.'
  },
  {
    id: 'i85',
    name: 'I-85 Piedmont Crescent',
    region: 'Central Piedmont',
    status: 'Clear',
    statusType: 'emerald',
    miles: '166 miles (Gastonia to Henderson)',
    highlights: 'Charlotte Metro, Concord, Lexington BBQ, Greensboro, Durham',
    advisory: 'Peak commuter hours 7:30–9:00 AM & 4:30–6:30 PM near Charlotte & Durham.'
  }
];

const TRIPADVISOR_PICKS = [
  {
    title: 'Biltmore Estate & Gardens',
    location: 'Asheville, Buncombe County',
    rating: 4.8,
    reviews: '24,310',
    category: 'Historic Landmark',
    quote: '"An unforgettable Gilded Age masterpiece surrounded by the Blue Ridge Mountains."'
  },
  {
    title: 'Wright Brothers National Memorial',
    location: 'Kill Devil Hills, Dare County',
    rating: 4.7,
    reviews: '8,940',
    category: 'National Park',
    quote: '"Standing on the exact spot of the first flight is awe-inspiring."'
  },
  {
    title: 'North Carolina Zoo',
    location: 'Asheboro, Randolph County',
    rating: 4.7,
    reviews: '11,250',
    category: 'Family & Wildlife',
    quote: '"The largest natural-habitat zoo in the world—plan a full day!"'
  },
  {
    title: 'USS North Carolina Battleship',
    location: 'Wilmington, New Hanover County',
    rating: 4.8,
    reviews: '9,620',
    category: 'Maritime History',
    quote: '"Incredible self-guided tour through WWII naval history on the Cape Fear River."'
  }
];

const NC_TRIPPING_GUIDES = [
  {
    title: 'The Ultimate Waterfalls Road Trip',
    tag: 'NC Tripping Pick',
    readTime: '60+ Waterfalls',
    summary: 'Follow US-64 through Brevard (Transylvania County) to see Looking Glass Falls, Sliding Rock, and Dry Falls in one weekend.'
  },
  {
    title: 'Eastern vs. Lexington BBQ Trail',
    tag: 'Culinary Guide',
    readTime: '25+ Historic Pits',
    summary: 'Compare whole-hog vinegar-pepper barbecue in Wilson & Greenville with hickory-smoked pork shoulder in Lexington.'
  },
  {
    title: 'Small-Town Main Streets & Hidden Gems',
    tag: 'Weekend Escapes',
    readTime: '15 Towns',
    summary: 'Stroll historic downtowns in Beaufort, Blowing Rock, Hillsborough, Edenton, and Sylva.'
  }
];

export default function InteractiveTravelHub({ navigate }) {
  const [selectedCorridor, setSelectedCorridor] = useState(CORRIDORS[0]);

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.35)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
            <Compass size={15} /> Integrated State Travel Intelligence
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Live Corridors, Traveler Ratings & <span className="text-gradient-amber">Local Guides</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Real-time NCDOT/DriveNC corridor status, top-rated traveler picks, NC Tripping weekend guides, and EDPNC tourism highlights—built right into your trip planner.
          </p>
        </div>

        {/* 1. DriveNC / NCDOT Interactive Corridor & Map Board */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-amber-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={22} color="var(--accent-amber)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>NC Corridor & Travel Status (DriveNC / NCDOT)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select a major North Carolina highway or scenic byway to view route highlights & advisories</p>
              </div>
            </div>
            <a href="https://drivenc.gov/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Live DriveNC Map <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {CORRIDORS.map((c) => {
              const active = selectedCorridor.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCorridor(c)}
                  style={{
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: active ? 'rgba(75, 156, 211, 0.12)' : 'rgba(0,0,0,0.03)',
                    border: active ? '2px solid #4B9CD3' : '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{c.name}</div>
                  <span className={`badge badge-${c.statusType}`} style={{ fontSize: '0.7rem' }}>{c.status}</span>
                </button>
              );
            })}
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Route & Distance</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{selectedCorridor.miles}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key Stops Along Route</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{selectedCorridor.highlights}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Traveler Advisory</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                {selectedCorridor.statusType === 'emerald' ? <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} /> : <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />}
                <span>{selectedCorridor.advisory}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TripAdvisor Top-Rated & NC Tripping Guides Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* TripAdvisor Style Reviews */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #00aa6c' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} color="#00aa6c" fill="#00aa6c" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Top-Rated NC Experiences</h3>
              </div>
              <span className="badge badge-emerald">Traveler Choice</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {TRIPADVISOR_PICKS.map((pick, i) => (
                <div key={i} style={{ paddingBottom: '0.85rem', borderBottom: i < TRIPADVISOR_PICKS.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>{pick.title}</strong>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00aa6c' }}>★ {pick.rating} ({pick.reviews})</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{pick.location} • {pick.category}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{pick.quote}</div>
                </div>
              ))}
            </div>
          </div>

          {/* NC Tripping Style Local Guides */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #3b82f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="var(--accent-blue)" />
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Curated NC Road Trips & Guides</h3>
                </div>
                <span className="badge badge-blue">Local Guides</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {NC_TRIPPING_GUIDES.map((guide, i) => (
                  <div key={i} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>{guide.title}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{guide.readTime}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{guide.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => navigate('/travel-ideas')} className="btn btn-secondary" style={{ marginTop: '1.25rem', width: '100%', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>
              Explore All Travel Ideas & Trails
            </button>
          </div>
        </div>

        {/* 3. EDPNC Tourism Fast Facts */}
        <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} color="var(--accent-blue)" />
            <div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>North Carolina Tourism Snapshot (EDPNC)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>One of the top 5 most-visited states in the U.S. for domestic travelers.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue)' }}>43M+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual Visitors</div>
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-amber)' }}>300+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Miles of Beaches</div>
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>41</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>State Parks & Rec Areas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
