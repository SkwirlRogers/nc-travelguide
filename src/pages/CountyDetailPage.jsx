import React, { useState, useEffect } from 'react';
import { MapPin, Users, Building, ExternalLink, Calendar, Compass, Plane, Sun, Utensils, Hotel, ArrowLeft, Heart, Star, Navigation, Search, History } from 'lucide-react';
import { getCountyDetails, getCountyHistory, formatNumber } from '../utils/dataHelpers';

export default function CountyDetailPage({ countySlug, subTab = 'guides', navigate, onToggleSave, isSaved }) {
  const county = getCountyDetails(countySlug);
  const countyHistory = getCountyHistory(countySlug);
  const [activeTab, setActiveTab] = useState(subTab || 'guides');

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  if (!county) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>County Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          We could not locate the county page for slug: <code>{countySlug}</code>.
        </p>
        <button onClick={() => navigate('/counties')} className="btn btn-primary">
          <ArrowLeft size={16} /> Return to 100 Counties Directory
        </button>
      </div>
    );
  }

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    const baseSlug = county.slug;
    navigate(`/counties/${baseSlug}/${tabName}`, false);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Top Banner Header */}
      <section style={{
        background: 'linear-gradient(to bottom, rgba(8, 13, 25, 0.7), rgba(8, 13, 25, 0.95)), url("/images/hero-linn-cove.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3rem 0 2rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <button onClick={() => navigate('/counties')} style={{ color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowLeft size={14} /> All 100 NC Counties
            </button>
            <span>/</span>
            <span>{county.Region}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{county.County} Viewpoint</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-amber">{county.Region}</span>
                {county['Sub-Region'] && <span className="badge badge-blue">{county['Sub-Region']}</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
                {county.County} <span className="text-gradient-amber">Travel Guide</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px' }}>
                Major Hubs: <strong>{county['Major Cities'] || 'Incorporated Towns'}</strong> • Sourced population: <strong>{formatNumber(county.Population)}</strong>
              </p>
            </div>

            {county['Tourism Website'] && (
              <a
                href={county['Tourism Website'].startsWith('http') ? county['Tourism Website'] : `https://${county['Tourism Website']}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.7rem 1.25rem' }}
              >
                Official {county.rawCountyName} Tourism <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* Sub-Page Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            marginTop: '2.5rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {[
              { id: 'guides', label: 'All Guides & Itineraries', icon: Compass, count: county.itineraries.length },
              { id: 'history', label: 'History Vault', icon: History, count: countyHistory?.key_history?.length || 0 },
              { id: 'visit', label: 'Visit & Logistics', icon: Calendar },
              { id: 'things-to-do', label: 'Things to Do', icon: MapPin, count: county.attractions.length },
              { id: 'municipalities', label: 'Municipalities & Towns', icon: Building, count: county.cities.length },
              { id: 'stay-and-eat', label: 'Where to Stay & Eat', icon: Utensils, count: county.hotels.length + county.restaurants.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.2rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-amber-light)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--accent-amber-light)' : 'currentColor'} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span style={{
                      background: isActive ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#000' : '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '10px'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <section style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {/* TAB 1: GUIDES & OVERVIEW */}
          {activeTab === 'guides' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* County Summary Banner */}
              <div className="glass-panel" style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>COUNTY SEAT / MAJOR HUBS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{county['Major Cities'] || county.rawCountyName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>REGION</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber-light)', marginTop: '0.2rem' }}>{county.Region}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OFFICIAL POPULATION</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{formatNumber(county.Population)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SUB-REGION</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-blue-light)', marginTop: '0.2rem' }}>{county['Sub-Region'] || 'North Carolina'}</div>
                </div>
              </div>

              {/* Curated Itinerary */}
              {county.itineraries.map((itinerary, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Curated Itinerary</span>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{itinerary.title}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{itinerary.subtitle}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {itinerary.days.map((dayItem, dIdx) => (
                      <div
                        key={dIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.5rem'
                        }}
                      >
                        <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                          {dayItem.day} • {dayItem.focus}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                          <div>
                            <strong style={{ color: 'var(--accent-amber-light)' }}>🌅 Morning:</strong>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{dayItem.morning}</p>
                          </div>
                          <div>
                            <strong style={{ color: 'var(--accent-blue-light)' }}>☀️ Afternoon:</strong>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{dayItem.afternoon}</p>
                          </div>
                          <div>
                            <strong style={{ color: '#34d399' }}>🌙 Evening:</strong>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{dayItem.evening}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: COUNTY HISTORY VAULT */}
          {activeTab === 'history' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid rgba(201, 166, 107, 0.4)' }}>
                <span className="badge badge-amber" style={{ marginBottom: '0.65rem' }}>Source-led county research</span>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>{county.rawCountyName} County History Vault</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  A growing, county-by-county research collection. Historical summaries and archival items are published only when a source or holding institution can be identified. This is a developing collection, not a claim that every county's history is complete.
                </p>
              </div>

              {countyHistory?.key_history?.length ? (
                <section aria-label={county.rawCountyName + ' historical records'} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {countyHistory.key_history.map((record, index) => (
                    <article key={record.title + index} className="glass-panel" style={{ padding: '1.5rem' }}>
                      <span className="badge badge-blue" style={{ marginBottom: '0.65rem' }}>{record.period}</span>
                      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.45rem' }}>{record.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0.75rem' }}>{record.summary}</p>
                      <a href={record.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.86rem', fontWeight: 650 }}>
                        Source: {record.source_name} <ExternalLink size={13} style={{ verticalAlign: 'middle' }} />
                      </a>
                    </article>
                  ))}
                </section>
              ) : (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.45rem' }}>Research collection in progress</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    County-specific historical entries are being assembled. No unsourced timeline or archival item is being presented as fact.
                  </p>
                </div>
              )}

              {countyHistory?.archival_assets?.length > 0 && (
                <section aria-label={county.rawCountyName + ' archival collection'}>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '1rem' }}>Archival photographs & collection records</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
                    {countyHistory.archival_assets.map((asset, index) => (
                      <figure key={asset.title + index} className="glass-card" style={{ margin: 0, overflow: 'hidden' }}>
                        <img src={asset.url} alt={asset.alt} loading="lazy" style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }} />
                        <figcaption style={{ padding: '1rem' }}>
                          <strong>{asset.title}</strong>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5, margin: '0.4rem 0' }}>{asset.caption}</p>
                          <a href={asset.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>
                            {asset.source_name} collection record <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                          </a>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.45, marginTop: '0.5rem' }}>{asset.rights_note}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              <aside className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-amber)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Indigenous history research note</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {countyHistory?.indigenous_context?.editorial_note || 'Indigenous history will be documented in a dedicated, source-reviewed phase. Community-authored and institutional sources will be prioritized; no identity or continuity claims are inferred from colonial records alone.'}
                </p>
              </aside>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                Image rights and reuse conditions vary by institution. Follow each holding institution's terms before reuse or republication.
              </p>
            </div>
          )}

          {/* TAB 2: VISIT & LOGISTICS */}
          {activeTab === 'visit' && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Plane size={24} color="var(--accent-amber)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Airport & Access</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{county.visitInfo.airport}</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Sun size={24} color="var(--accent-blue)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Best Time to Visit</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{county.visitInfo.bestTime}</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Navigation size={24} color="#34d399" />
                  <h3 style={{ fontSize: '1.25rem' }}>Transportation & Routes</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{county.visitInfo.transit}</p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Users size={24} color="#f87171" />
                  <h3 style={{ fontSize: '1.25rem' }}>County Census Data</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Total official population: <strong>{formatNumber(county.Population)}</strong>. Major cities include <strong>{county['Major Cities']}</strong>.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem', gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Live Road Conditions & Local Guides</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Check real-time NCDOT traffic for {county.County} or explore local travel blogs.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href="https://drivenc.gov/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    DriveNC Live Map <ExternalLink size={14} />
                  </a>
                  <a href="https://www.nctripping.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>
                    NC Tripping <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THINGS TO DO */}
          {activeTab === 'things-to-do' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Attractions & Landmarks in {county.County} ({county.attractions.length})
              </h3>

              {county.attractions.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <MapPin size={48} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
                  <h4>No specific dataset attractions listed directly for {county.County}</h4>
                  <p style={{ marginTop: '0.5rem' }}>Browse regional attractions or cities in this county!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {county.attractions.map((item, idx) => {
                    const itemId = `attr-${item.Slug || idx}`;
                    const saved = isSaved(itemId);
                    return (
                      <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span className="badge badge-amber">{item.Category || 'Attraction'}</span>
                            <button
                              onClick={() => onToggleSave({ id: itemId, title: item.Attractions, type: 'Attraction', category: item.Category, city: item.City, county: county.County, targetLink: item['Website / Affiliate Link'] })}
                              style={{ padding: '0.4rem', color: saved ? '#ef4444' : 'var(--text-secondary)' }}
                            >
                              <Heart size={18} fill={saved ? '#ef4444' : 'none'} />
                            </button>
                          </div>

                          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.Attractions}</h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>📍 {item.Address || `${item.City}, NC`}</div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>{item.Description}</p>
                        </div>

                        {item['Website / Affiliate Link'] && (
                          <a
                            href={item['Website / Affiliate Link'].startsWith('http') ? item['Website / Affiliate Link'] : `https://${item['Website / Affiliate Link']}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                          >
                            Visit Website <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MUNICIPALITIES & TOWNS */}
          {activeTab === 'municipalities' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
                  Incorporated Cities, Towns & Villages in {county.County} ({county.cities.length})
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Directly linked from Collection 2 Cities dataset.
                </p>
              </div>

              {county.cities.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Building size={48} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
                  <h4>No municipality records found for {county.County}</h4>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {county.cities.map((city, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{city.City}</h4>
                        {city.Population && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber-light)', fontWeight: 600 }}>
                            Pop: {formatNumber(city.Population)}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                        {city.Description || `Historic municipality in ${county.County}, North Carolina.`}
                      </p>
                      {city['Tourism Website'] && (
                        <a
                          href={city['Tourism Website'].startsWith('http') ? city['Tourism Website'] : `https://${city['Tourism Website']}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.8rem', color: 'var(--accent-blue-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          Town Portal <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WHERE TO STAY & EAT */}
          {activeTab === 'stay-and-eat' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Hotels Section */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Hotel size={22} color="var(--accent-blue)" /> Hotels & Accommodations ({county.hotels.length})
                </h3>
                {county.hotels.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No hotel listings currently cataloged directly in this county.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {county.hotels.map((h, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                        <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{h.Category || 'Lodging'}</span>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{h['Hotel & Resort']}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>📍 {h.Address || `${h.City}, NC`}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{h.Description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dining Section */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Utensils size={22} color="var(--accent-amber)" /> Restaurants & Dining ({county.restaurants.length})
                </h3>
                {county.restaurants.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No restaurant listings currently cataloged directly in this county.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {county.restaurants.map((r, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                        <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>{r.Cuisine || 'Dining'}</span>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{r.Restaurant}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>📍 {r.Address || `${r.City}, NC`}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{r.Description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
