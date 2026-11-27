import React, { useState, useMemo } from 'react';
import { MapPin, Search, ArrowRight, Building, Users, Compass, ExternalLink } from 'lucide-react';
import { getAllCounties, formatNumber, makeSlug } from '../utils/countyDirectoryHelpers';
import { getCountyMacroRegions } from '../utils/regionHelpers';

export default function CountiesPage({ navigate, initialRegion = 'all' }) {
  const allCounties = useMemo(() => getAllCounties(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState(initialRegion);

  React.useEffect(() => setRegionFilter(initialRegion || 'all'), [initialRegion]);
  const [sortBy, setSortBy] = useState('name');

  const filteredCounties = useMemo(() => {
    return allCounties.filter(county => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || (
        county.County.toLowerCase().includes(q) ||
        (county['Major Cities'] && county['Major Cities'].toLowerCase().includes(q)) ||
        (county.Region && county.Region.toLowerCase().includes(q)) ||
        (county['Sub-Region'] && county['Sub-Region'].toLowerCase().includes(q))
      );

      const matchesRegion = regionFilter === 'all' || getCountyMacroRegions(county).includes(regionFilter);

      return matchesSearch && matchesRegion;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.County.localeCompare(b.County);
      } else if (sortBy === 'population') {
        const popA = parseInt(String(a.Population).replace(/,/g, ''), 10) || 0;
        const popB = parseInt(String(b.Population).replace(/,/g, ''), 10) || 0;
        return popB - popA;
      } else if (sortBy === 'experiences') {
        return b.totalExperiencesCount - a.totalExperiencesCount;
      }
      return 0;
    });
  }, [allCounties, searchTerm, regionFilter, sortBy]);

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>Full Statewide Index</div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>
            Explore All <span className="text-gradient-amber">100 North Carolina Counties</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem' }}>
            Direct access to county viewpoints, curated itineraries, fast facts, logistics, attractions, and 361 incorporated municipalities across NC.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search size={20} color="var(--accent-amber)" style={{ marginRight: '0.6rem' }} />
              <input
                type="text"
                placeholder="Search by county name, city (e.g. Raleigh, Asheville, Charlotte), or sub-region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }}
              />
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="name" style={{ background: '#0e172a' }}>Alphabetical (A–Z)</option>
                <option value="population" style={{ background: '#0e172a' }}>Population (Highest First)</option>
                <option value="experiences" style={{ background: '#0e172a' }}>Most Experiences</option>
              </select>
            </div>
          </div>

          {/* Region Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Region:</span>
            {['all', 'Mountains', 'Central Piedmont', 'Atlantic Coastal', 'Sandhills / Inner Coastal'].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: regionFilter === reg ? 'var(--accent-amber-light)' : 'var(--text-secondary)',
                  background: regionFilter === reg ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: regionFilter === reg ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {reg === 'all' ? 'All Regions (100)' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div>Showing <strong>{filteredCounties.length}</strong> of 100 North Carolina Counties</div>
          {searchTerm && (
            <button onClick={() => { setSearchTerm(''); setRegionFilter('all'); }} style={{ color: 'var(--accent-amber-light)', textDecoration: 'underline' }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* 100 Counties Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredCounties.map((county) => {
            const countySlug = county.slug || makeSlug(county.County);
            return (
              <div
                key={county.County}
                className="glass-card"
                onClick={() => navigate(`/counties/${countySlug}`)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-amber">{county.Region || 'North Carolina'}</span>
                    {county['Sub-Region'] && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{county['Sub-Region']}</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{county.County}</h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
                    <Building size={14} color="var(--accent-amber)" /> Major Cities: {county['Major Cities'] || 'Incorporated Towns'}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                    <div>👥 Pop: <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(county.Population)}</strong></div>
                    <div>🏙️ Cities: <strong style={{ color: 'var(--text-primary)' }}>{county.cityCount}</strong></div>
                    <div>📍 Places: <strong style={{ color: 'var(--text-primary)' }}>{county.totalExperiencesCount}</strong></div>
                  </div>
                </div>

                <div style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--accent-blue-light)'
                }}>
                  <span>View County Hub</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
