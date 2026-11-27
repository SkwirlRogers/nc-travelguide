import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Filter, ExternalLink, Heart, ArrowRight, Utensils, Hotel, Compass, CheckCircle2 } from 'lucide-react';
import { searchExperiences } from '../utils/experienceHelpers';
import { getAllCounties } from '../utils/countyDirectoryHelpers';

export default function ExperiencesPage({ initialQuery = '', initialRegion = 'all', navigate, onToggleSave, isSaved }) {
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState(initialRegion);

  useEffect(() => setRegionFilter(initialRegion || 'all'), [initialRegion]);
  const [countyFilter, setCountyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const countiesList = useMemo(() => getAllCounties(), []);

  // Perform client-side search across master dataset
  const results = useMemo(() => {
    return searchExperiences({
      query,
      type: typeFilter,
      region: regionFilter,
      county: countyFilter,
      category: categoryFilter,
      limit: 120
    });
  }, [query, typeFilter, regionFilter, countyFilter, categoryFilter]);

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
            <Search size={16} /> Master Statewide Directory
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Unified NC <span className="text-gradient-amber">Experiences Directory</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem' }}>
            Search, filter, and discover over 600+ attractions, luxury hotels, beach resorts, and top-rated North Carolina restaurants.
          </p>
        </div>

        {/* Search & Faceted Filter Control Bar */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          {/* Main Keyword Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '1.25rem' }}>
            <Search size={22} color="var(--accent-amber)" style={{ marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search by keyword, place name, city, county, or cuisine (e.g., Biltmore, Oceanfront, BBQ, Umstead)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Clear
              </button>
            )}
          </div>

          {/* Faceted Filters Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Filter 1: Type */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Category Type:
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0e172a' }}>All Types (Attractions, Hotels, Food)</option>
                <option value="attractions" style={{ background: '#0e172a' }}>Attractions & Recreation</option>
                <option value="hotels" style={{ background: '#0e172a' }}>Hotels & Resorts</option>
                <option value="restaurants" style={{ background: '#0e172a' }}>Restaurants & Dining</option>
              </select>
            </div>

            {/* Filter 2: Region */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Macro Region:
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0e172a' }}>All Regions</option>
                <option value="Mountains" style={{ background: '#0e172a' }}>Mountains</option>
                <option value="Central Piedmont" style={{ background: '#0e172a' }}>Central Piedmont</option>
                <option value="Atlantic Coastal" style={{ background: '#0e172a' }}>Atlantic Coastal</option>
                <option value="Sandhills / Inner Coastal" style={{ background: '#0e172a' }}>Sandhills / Inner Coastal</option>
              </select>
            </div>

            {/* Filter 3: County */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                NC County (100):
              </label>
              <select
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-primary)',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0e172a' }}>All Counties (100)</option>
                {countiesList.map(c => (
                  <option key={c.County} value={c.rawCountyName} style={{ background: '#0e172a' }}>
                    {c.County}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div>Showing <strong>{results.length}</strong> cataloged experiences</div>
          {(query || typeFilter !== 'all' || regionFilter !== 'all' || countyFilter !== 'all') && (
            <button
              onClick={() => {
                setQuery('');
                setTypeFilter('all');
                setRegionFilter('all');
                setCountyFilter('all');
                setCategoryFilter('all');
              }}
              style={{ color: 'var(--accent-amber-light)', textDecoration: 'underline' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Directory Results Grid */}
        {results.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Search size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
            <h3>No matching experiences found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try clearing keyword search or selecting "All Types" and "All Regions".</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '1.5rem'
          }}>
            {results.map((item) => {
              const saved = isSaved(item.id);
              const badgeClass = item.type === 'Attraction' ? 'badge-amber' : item.type === 'Hotel' ? 'badge-blue' : 'badge-emerald';

              return (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`badge ${badgeClass}`}>{item.type}</span>
                        {item.category && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {item.category}</span>}
                      </div>

                      <button
                        onClick={() => onToggleSave(item)}
                        style={{
                          padding: '0.4rem',
                          color: saved ? '#ef4444' : 'var(--text-secondary)',
                          background: saved ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                          borderRadius: '50%'
                        }}
                        title={saved ? 'Remove from Itinerary' : 'Save to Itinerary'}
                      >
                        <Heart size={18} fill={saved ? '#ef4444' : 'none'} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.title}</h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                      <MapPin size={14} /> {item.city ? `${item.city}, ` : ''}{item.county} County ({item.region})
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => navigate(`/counties/${item.county.toLowerCase().replace(/\s+/g, '-')}-county`)}
                      style={{ fontSize: '0.85rem', color: 'var(--accent-blue-light)', fontWeight: 600 }}
                    >
                      {item.county} County Page
                    </button>

                    {item.targetLink && (
                      <a
                        href={item.targetLink.startsWith('http') ? item.targetLink : `https://${item.targetLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={14} /> Visit / Book
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
