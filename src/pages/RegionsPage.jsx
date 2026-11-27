import React, { useState } from 'react';
import { Compass, MapPin, ExternalLink, ArrowRight, Building, Search } from 'lucide-react';
import { getMacroRegions } from '../utils/regionHelpers';
import subRegionsData from '../data/sub_regions.json';

export default function RegionsPage({ navigate }) {
  const macroRegions = getMacroRegions();
  const [selectedMacro, setSelectedMacro] = useState('all');

  const filteredMacro = selectedMacro === 'all' 
    ? macroRegions 
    : macroRegions.filter(r => r.slug === selectedMacro);

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>Geographic Diversity</div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>
            North Carolina's <span className="text-gradient-amber">4 Macro-Regions & 17 Sub-Regions</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem' }}>
            From the high alpine ridges of the Blue Ridge Parkway down through the rolling Piedmont heartland to 300+ miles of Atlantic coastal barrier islands.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setSelectedMacro('all')}
            className={`btn ${selectedMacro === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem' }}
          >
            All Regions (4)
          </button>
          {macroRegions.map(r => (
            <button
              key={r.slug}
              onClick={() => setSelectedMacro(r.slug)}
              className={`btn ${selectedMacro === r.slug ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem' }}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Macro Regions Detailed Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {filteredMacro.map((region) => {
            // Find associated sub-regions from dataset
            const subRegs = subRegionsData.filter(sr => 
              sr.Region && sr.Region.toLowerCase().includes(region.name.toLowerCase().split(' ')[0])
            );

            return (
              <div 
                key={region.slug}
                className="glass-panel"
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  {/* Info Column */}
                  <div>
                    <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>{region.name} Macro Region</div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{region.name} North Carolina</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem', marginBottom: '1.25rem' }}>
                      {region.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="badge badge-blue">
                        <MapPin size={14} /> {region.countiesCount} Counties
                      </div>
                      <div className="badge badge-teal">
                        <Building size={14} /> Major Hubs: {region.featuredCities}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => navigate(`/counties?region=${encodeURIComponent(region.name)}`)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.9rem' }}
                      >
                        Explore {region.name} Counties <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/experiences?region=${encodeURIComponent(region.name)}`)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <Search size={16} /> Search Experiences
                      </button>
                    </div>
                  </div>

                  {/* Banner Image Column */}
                  <div style={{
                    height: '260px',
                    borderRadius: 'var(--radius-md)',
                    backgroundImage: `url('${region.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'var(--shadow-md)'
                  }} />
                </div>

                {/* Sub-Regions Breakdown */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '1.5rem'
                }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-amber-light)' }}>
                    Sub-Regions & Destinations in {region.name}:
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1rem'
                  }}>
                    {subRegs.length > 0 ? (
                      subRegs.map((sr, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{sr['Sub-Region']}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Major Hubs: {sr['Major Cities']}
                          </div>
                          {sr['Tourism Website'] && (
                            <a
                              href={sr['Tourism Website']}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.78rem', color: 'var(--accent-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <ExternalLink size={12} /> Official Portal
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      region.subRegions.map((srName, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{srName}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            Part of {region.name} region
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
