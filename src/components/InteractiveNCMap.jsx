import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ArrowRight } from 'lucide-react';
import { getAllCounties } from '../utils/countyDirectoryHelpers';

// Simplified representative coordinates/positions for key North Carolina counties across regions for SVG visualization
const REGION_COLORS = {
  'Mountain': '#f59e0b',
  'Central Piedmont': '#3b82f6',
  'Atlantic Coastal': '#14b8a6',
  'Inland-Inner Coastal': '#8b5cf6'
};

export default function InteractiveNCMap({ navigate }) {
  const counties = getAllCounties();
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCounties = counties.filter(c => {
    const matchesRegion = selectedRegion === 'ALL' || c.Region === selectedRegion;
    const matchesQuery = !filterQuery || c.County.toLowerCase().includes(filterQuery.toLowerCase()) || 
      (c['Major Cities'] && c['Major Cities'].toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesRegion && matchesQuery;
  });

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.5)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
            <Layers size={14} /> Interactive County Atlas
          </div>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Explore All <span className="text-gradient-amber">100 NC Counties</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            Filter by macro-region or search any of North Carolina's 100 counties to instantly view regional hubs, population, and jump into deep guides.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {['ALL', 'Mountain', 'Central Piedmont', 'Inland-Inner Coastal', 'Atlantic Coastal'].map((r) => {
            const active = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className="btn"
                style={{
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-full)',
                  background: active ? 'var(--bg-dark)' : 'rgba(255, 255, 255, 0.9)',
                  color: active ? '#fff' : 'var(--text-primary)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: active ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                {r === 'ALL' ? 'All 100 Counties' : r}
              </button>
            );
          })}
        </div>

        {/* Map Visualization & Selected County Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Visual SVG Map Banner of NC */}
          <div className="glass-card" style={{ padding: '2rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="var(--accent-blue)" /> Regional Distribution
              </h3>
              <span className="badge badge-blue">{filteredCounties.length} Counties Displayed</span>
            </div>

            {/* Stylized SVG Map of North Carolina */}
            <div style={{
              position: 'relative',
              width: '100%',
              background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <svg viewBox="0 0 900 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <linearGradient id="mountainsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="piedmontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="innerCoastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="coastalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>

                {/* Mountain Region Shape */}
                <path
                  d="M 40,110 L 180,60 L 260,130 L 220,230 L 100,230 L 40,170 Z"
                  fill="url(#mountainsGrad)"
                  opacity={selectedRegion === 'ALL' || selectedRegion === 'Mountain' ? 0.95 : 0.3}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedRegion('Mountain')}
                />

                {/* Central Piedmont Shape */}
                <path
                  d="M 260,130 L 180,60 L 510,50 L 530,170 L 410,240 L 220,230 Z"
                  fill="url(#piedmontGrad)"
                  opacity={selectedRegion === 'ALL' || selectedRegion === 'Central Piedmont' ? 0.95 : 0.3}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedRegion('Central Piedmont')}
                />

                {/* Inland-Inner Coastal (Sandhills) Shape */}
                <path
                  d="M 510,50 L 660,65 L 670,220 L 530,260 L 410,240 L 530,170 Z"
                  fill="url(#innerCoastGrad)"
                  opacity={selectedRegion === 'ALL' || selectedRegion === 'Inland-Inner Coastal' ? 0.95 : 0.3}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedRegion('Inland-Inner Coastal')}
                />

                {/* Atlantic Coastal & Outer Banks Shape */}
                <path
                  d="M 660,65 L 810,40 L 880,110 L 860,200 L 750,290 L 670,220 Z"
                  fill="url(#coastalGrad)"
                  opacity={selectedRegion === 'ALL' || selectedRegion === 'Atlantic Coastal' ? 0.95 : 0.3}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedRegion('Atlantic Coastal')}
                />

                {/* Outer Banks Barrier Island Strip */}
                <path
                  d="M 790,45 Q 870,90 855,160 Q 820,220 740,285"
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="6"
                  strokeDasharray="4 6"
                />

                {/* Region Labels */}
                <text x="130" y="150" fill="#fff" fontWeight="800" fontSize="16" textAnchor="middle">MOUNTAIN</text>
                <text x="360" y="140" fill="#fff" fontWeight="800" fontSize="16" textAnchor="middle">CENTRAL PIEDMONT</text>
                <text x="590" y="150" fill="#fff" fontWeight="800" fontSize="15" textAnchor="middle">INNER COASTAL</text>
                <text x="760" y="150" fill="#fff" fontWeight="800" fontSize="15" textAnchor="middle">ATLANTIC COAST</text>
                <text x="830" y="80" fill="#065f46" fontWeight="700" fontSize="12" textAnchor="middle">OUTER BANKS</text>
              </svg>
            </div>

            {/* Quick search input */}
            <div style={{ marginTop: '1.25rem' }}>
              <input
                type="text"
                placeholder="Search counties or cities (e.g. Buncombe, Dare, Charlotte, Raleigh)..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '0.92rem',
                  background: '#f8fafc',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Counties Directory Scroll Grid */}
          <div className="glass-card" style={{ padding: '1.75rem', maxHeight: '540px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Counties in Selection
            </h3>
            <div style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingRight: '0.5rem'
            }}>
              {filteredCounties.map((c) => (
                <div
                  key={c.Slug}
                  onClick={() => navigate(`/counties/${c.Slug}`)}
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#f8fafc',
                    border: '1px solid rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {c.County}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Hubs: {c['Major Cities'] || 'County seat'} • Pop. {c.Population}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge" style={{
                      fontSize: '0.7rem',
                      background: `${REGION_COLORS[c.Region] || '#3b82f6'}20`,
                      color: REGION_COLORS[c.Region] || '#3b82f6'
                    }}>
                      {c.Region}
                    </span>
                    <ArrowRight size={15} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
