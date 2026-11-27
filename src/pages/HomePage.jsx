import React, { useState } from 'react';
import { Search, Compass, MapPin, History, Sparkles, ArrowRight, Heart, Star, ExternalLink, ShieldCheck, TreePine } from 'lucide-react';
import { getMacroRegions, getAllCounties, searchExperiences } from '../utils/dataHelpers';
import InteractiveTravelHub from '../components/InteractiveTravelHub';
import InteractiveNCMap from '../components/InteractiveNCMap';
import LiveWeatherConditions from '../components/LiveWeatherConditions';
import AudioStoryTrails from '../components/AudioStoryTrails';

export default function HomePage({ navigate, onToggleSave, isSaved }) {
  const [searchQuery, setSearchQuery] = useState('');
  const macroRegions = getMacroRegions();
  const allCounties = getAllCounties();
  
  // Featured top attractions
  const featuredHotspots = searchExperiences({ type: 'attractions', limit: 6 });

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/experiences?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/experiences');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* 1. Grand Opening Hero Display (Linn Cove Viaduct) */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(to bottom, rgba(8, 13, 25, 0.45) 0%, rgba(8, 13, 25, 0.85) 75%, #080d19 100%), url('/images/hero-linn-cove.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        padding: '4rem 1.5rem 6rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 2 }}>
          {/* Badge Tagline */}
          <div className="badge badge-amber" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <TreePine size={16} /> Official Tar Heel Travel Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0,0,0,0.9)'
          }}>
            Discover the Tar Heel State: <br />
            <span className="text-gradient-amber">From the Blue Ridge to the Outer Banks</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)'
          }}>
            Explore North Carolina's 100 counties, 360+ municipalities, state heritage, coastal escapes, mountain summits, and world-famous barbecue trails.
          </p>

          {/* Quick Search Widget */}
          <form onSubmit={handleHeroSearch} style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(17, 26, 46, 0.92)',
            backdropFilter: 'blur(16px)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '0.75rem', gap: '0.5rem' }}>
              <Search size={22} color="var(--accent-amber)" />
              <input
                type="text"
                placeholder="Search counties (e.g. Wake, Dare, Buncombe) or attractions (Biltmore, Cape Hatteras)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)', padding: '0.8rem 1.5rem' }}>
              Search NC <ArrowRight size={18} />
            </button>
          </form>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1.25rem',
            maxWidth: '750px',
            margin: '0 auto'
          }}>
            <div className="glass-panel" style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber-light)' }}>100</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>NC Counties</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue-light)' }}>361</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Municipalities</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>600+</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Places & Dining</div>
            </div>
            <div className="glass-panel" style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>4</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Macro Regions</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Jump Region Selectors */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Regional Navigation</div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Explore NC's <span className="text-gradient-amber">4 Macro-Regions</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              From mountain ranges rising above 6,600 feet to sunny coastal barrier beaches.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem'
          }}>
            {macroRegions.map((region) => (
              <div
                key={region.slug}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
                onClick={() => navigate(`/regions?region=${region.slug}`)}
              >
                <div style={{
                  height: '160px',
                  backgroundImage: `linear-gradient(to bottom, transparent, rgba(17, 26, 46, 0.95)), url('${region.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                  <span className="badge badge-amber">{region.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    {region.countiesCount} Counties
                  </span>
                </div>
                
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{region.name} Region</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {region.description}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                      📍 {region.featuredCities}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--accent-blue-light)', fontWeight: 600 }}>
                      View Region Viewpoint <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Exploration Cards */}
      <section style={{ padding: '4rem 0', background: 'rgba(17, 26, 46, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Essential North Carolina <span className="text-gradient-amber">Travel Hubs</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Direct portals to counties, state symbols, travel ideas, and experience listings.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Card 1: 100 Counties */}
            <div
              className="glass-card"
              onClick={() => navigate('/counties')}
              style={{ padding: '1.75rem', cursor: 'pointer', borderLeft: '4px solid var(--accent-amber)' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-amber-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <MapPin size={26} color="var(--accent-amber-light)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>100 Counties Hub</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                View complete itineraries, fast facts, logistics, attractions, and 361 incorporated cities for every county from Alamance to Yancey.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber-light)', fontWeight: 600, fontSize: '0.9rem' }}>
                Browse All 100 Counties <ArrowRight size={16} />
              </div>
            </div>

            {/* Card 2: Travel Ideas & Hotspots */}
            <div
              className="glass-card"
              onClick={() => navigate('/travel-ideas')}
              style={{ padding: '1.75rem', cursor: 'pointer', borderLeft: '4px solid var(--accent-blue)' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-blue-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <Sparkles size={26} color="var(--accent-blue-light)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Travel Ideas & Hotspots</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                Coastal beaches, mountain summit hikes, Carowinds theme park, state zoo, and Eastern vs. Lexington BBQ culinary trails.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue-light)', fontWeight: 600, fontSize: '0.9rem' }}>
                Explore Travel Trails <ArrowRight size={16} />
              </div>
            </div>

            {/* Card 3: NC History */}
            <div
              className="glass-card"
              onClick={() => navigate('/history')}
              style={{ padding: '1.75rem', cursor: 'pointer', borderLeft: '4px solid var(--accent-emerald)' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-emerald-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <History size={26} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>NC History & 250th</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                "First in Flight" • "First in Freedom" history, state bird cardinal, flowering dogwood, longleaf pine tree, and Roanoke Lost Colony.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
                View Heritage & Symbols <ArrowRight size={16} />
              </div>
            </div>

            {/* Card 4: Directory Search */}
            <div
              className="glass-card"
              onClick={() => navigate('/experiences')}
              style={{ padding: '1.75rem', cursor: 'pointer', borderLeft: '4px solid var(--accent-crimson)' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-crimson-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <Search size={26} color="#f87171" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Directory Search Engine</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                Search and filter over 600+ verified North Carolina attractions, luxury resorts, beach hotels, and top-rated restaurants.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 600, fontSize: '0.9rem' }}>
                Launch Search Engine <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Hotspots Showcase Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Top Attractions</div>
              <h2 style={{ fontSize: '2.2rem' }}>
                Must-See <span className="text-gradient-amber">NC Hotspots</span>
              </h2>
            </div>
            <button onClick={() => navigate('/experiences')} className="btn btn-secondary">
              View All 600+ Places <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredHotspots.map((item) => {
              const saved = isSaved(item.id);
              return (
                <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-amber">{item.category}</span>
                      <button
                        onClick={() => onToggleSave(item)}
                        style={{
                          padding: '0.4rem',
                          color: saved ? '#ef4444' : 'var(--text-secondary)',
                          background: saved ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                          borderRadius: '50%'
                        }}
                      >
                        <Heart size={18} fill={saved ? '#ef4444' : 'none'} />
                      </button>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                      <MapPin size={14} /> {item.city}, {item.county} County
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      onClick={() => navigate(`/counties/${item.county.toLowerCase().replace(/\s+/g, '-')}-county`)}
                      style={{ fontSize: '0.85rem', color: 'var(--accent-blue-light)', fontWeight: 600 }}
                    >
                      View County Page
                    </button>
                    {item.targetLink && (
                      <a
                        href={item.targetLink.startsWith('http') ? item.targetLink : `https://${item.targetLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={14} /> Website
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.5 Interactive County Map */}
      <InteractiveNCMap navigate={navigate} />

      {/* 5. Live Mountain Summit & Coastal Surf Conditions */}
      <LiveWeatherConditions />

      {/* 5.5 Audio & Story Trails (America 250th / First in Flight / Civil Rights) */}
      <AudioStoryTrails />

      {/* 6. Official VisitNC Integration */}
      <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.4)' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '3rem', borderLeft: '6px solid var(--accent-blue)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                <ShieldCheck size={16} /> Official State Tourism Resources
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Plan Your Trip with <span className="text-gradient-blue">VisitNC</span>
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                For the latest travel advisories, the official North Carolina Travel Guide print magazine, and seasonal trip ideas, be sure to visit the official state tourism portal at VisitNC.com. Discover the people and places that make North Carolina unique.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://www.visitnc.com/travel-guides" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Get the Free Travel Guide <ExternalLink size={18} />
                </a>
                <a href="https://edpnc.com/industries/tourism/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', borderColor: 'rgba(0,0,0,0.1)' }}>
                  EDPNC Tourism <ExternalLink size={16} />
                </a>
                <a href="https://www.nctripping.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', borderColor: 'rgba(0,0,0,0.1)' }}>
                  NC Tripping <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://www.visitnc.com/img/visitnc-logo.svg" 
                alt="VisitNC Logo" 
                style={{ width: '100%', maxWidth: '300px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Integrated Interactive Travel Hub (DriveNC, TripAdvisor, NC Tripping, EDPNC) */}
      <InteractiveTravelHub navigate={navigate} />
    </div>
  );
}
