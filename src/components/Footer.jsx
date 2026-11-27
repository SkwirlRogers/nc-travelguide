import React from 'react';
import { Compass, TreePine, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ navigate }) {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '4rem 0 2rem 0',
      marginTop: '4rem',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img 
                src="/images/nc-travel-guide-logo.png" 
                alt="NC Travel Guide Logo" 
                style={{ width: '42px', height: 'auto', borderRadius: '8px' }} 
              />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                NC <span className="text-gradient-amber">TravelGuide</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              The authoritative public guide to North Carolina's 100 counties, 360+ municipalities, state heritage, culinary trails, and mountain-to-coastal attractions.
            </p>
            <div className="badge badge-amber">
              First in Flight • First in Freedom
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.2rem' }}>Explore NC</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <button onClick={() => navigate('/regions')} style={{ color: 'var(--text-secondary)', hover: { color: 'var(--text-primary)' } }}>
                  Regional Viewpoints (4 Regions)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/counties')} style={{ color: 'var(--text-secondary)' }}>
                  100 NC Counties Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/history')} style={{ color: 'var(--text-secondary)' }}>
                  NC Heritage & America's 250th
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/travel-ideas')} style={{ color: 'var(--text-secondary)' }}>
                  Curated Hotspots & Thematic Trails
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/experiences')} style={{ color: 'var(--text-secondary)' }}>
                  Master Directory Search Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Destinations */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.2rem' }}>Top Destinations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><button onClick={() => navigate('/counties/buncombe-county')} style={{ color: 'var(--text-secondary)' }}>Buncombe County (Asheville & Biltmore)</button></li>
              <li><button onClick={() => navigate('/counties/dare-county')} style={{ color: 'var(--text-secondary)' }}>Dare County (Outer Banks & Cape Hatteras)</button></li>
              <li><button onClick={() => navigate('/counties/wake-county')} style={{ color: 'var(--text-secondary)' }}>Wake County (Raleigh & Capital Region)</button></li>
              <li><button onClick={() => navigate('/counties/mecklenburg-county')} style={{ color: 'var(--text-secondary)' }}>Mecklenburg County (Charlotte Metro)</button></li>
              <li><button onClick={() => navigate('/counties/new-hanover-county')} style={{ color: 'var(--text-secondary)' }}>New Hanover County (Wilmington & Beaches)</button></li>
            </ul>
          </div>

          {/* Col 4: Official Tourism & Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1.2rem' }}>Official State Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <a href="https://www.visitnc.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue-light)' }}>
                <ExternalLink size={14} /> VisitNC.com Official Portal
              </a>
              <a href="https://www.nc.gov" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue-light)' }}>
                <ExternalLink size={14} /> Official State of NC Government
              </a>
              <a href="https://ncparks.gov" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue-light)' }}>
                <ExternalLink size={14} /> North Carolina State Parks
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>
            © {new Date().getFullYear()} North Carolina Travel Guide Public Website. All datasets integrated.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built for Tar Heels & travelers everywhere with <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
}
