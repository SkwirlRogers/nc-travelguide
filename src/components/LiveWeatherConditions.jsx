import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Compass, Waves, Mountain, ShieldAlert } from 'lucide-react';

const WEATHER_STATIONS = [
  {
    name: 'Mount Mitchell Summit',
    region: 'High Country (Blue Ridge)',
    elevation: '6,684 ft',
    temp: '44°F',
    condition: 'Chilly & Brisk',
    wind: '22 mph NW',
    humidity: '65%',
    icon: Mountain,
    type: 'mountain',
    advisory: 'Highest peak east of the Mississippi. Temperatures are typically 15–20°F cooler than Asheville valley.'
  },
  {
    name: 'Grandfather Mountain / Linn Cove',
    region: 'Blue Ridge Parkway MP 305',
    elevation: '5,946 ft',
    temp: '48°F',
    condition: 'Partly Cloudy & Clear Views',
    wind: '18 mph W',
    humidity: '58%',
    icon: Wind,
    type: 'mountain',
    advisory: 'Mile High Swinging Bridge open. Check Linn Cove Viaduct camera for fall foliage visibility.'
  },
  {
    name: 'Cape Hatteras / Outer Banks',
    region: 'Atlantic Coastal (Dare Co)',
    elevation: '10 ft',
    temp: '68°F',
    condition: 'Sunny & Sea Breeze',
    wind: '14 mph SE',
    surf: '3–5 ft Clean',
    tides: 'High 2:14 PM • Low 8:30 PM',
    icon: Waves,
    type: 'coastal',
    advisory: 'NCDOT Hatteras–Ocracoke Ferry running on schedule. Moderate rip current risk on ocean-facing sandbars.'
  },
  {
    name: 'Wrightsville Beach & Wilmington',
    region: 'Cape Fear Coast',
    elevation: '15 ft',
    temp: '72°F',
    condition: 'Sunny & Warm',
    wind: '9 mph S',
    surf: '2–3 ft Moderate',
    tides: 'High 1:45 PM • Low 7:55 PM',
    icon: Sun,
    type: 'coastal',
    advisory: 'Excellent beach & paddling conditions around Masonboro Island & Carolina Beach.'
  },
  {
    name: 'Raleigh-Durham & Research Triangle',
    region: 'Central Piedmont',
    elevation: '436 ft',
    temp: '71°F',
    condition: 'Clear Skies',
    wind: '6 mph W',
    humidity: '48%',
    icon: Sun,
    type: 'piedmont',
    advisory: 'Ideal outdoor dining conditions in downtown Raleigh, Durham American Tobacco Campus, & Chapel Hill.'
  },
  {
    name: 'Charlotte Uptown & Lake Norman',
    region: 'Charlotte Metro',
    elevation: '761 ft',
    temp: '73°F',
    condition: 'Warm & Pleasant',
    wind: '8 mph SW',
    humidity: '50%',
    icon: Sun,
    type: 'piedmont',
    advisory: 'Lake Norman boating & U.S. National Whitewater Center rapids operating normally.'
  }
];

export default function LiveWeatherConditions() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredStations = WEATHER_STATIONS.filter(s => {
    if (activeCategory === 'ALL') return true;
    return s.type === activeCategory;
  });

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.45)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            <Sun size={15} /> Real-Time NC Atmosphere
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Mountain Summits & <span className="text-gradient-blue">Coastal Surf Conditions</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            From high-elevation microclimates on the Blue Ridge Parkway to Outer Banks surf, tides, and NCDOT ferry advisories.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
          {[
            { id: 'ALL', label: 'All Microclimates' },
            { id: 'mountain', label: 'Mountain Summits (6,000+ ft)' },
            { id: 'coastal', label: 'Coastal Tides & Surf' },
            { id: 'piedmont', label: 'Metro & Lakes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                background: activeCategory === tab.id ? '#0f172a' : '#fff',
                color: activeCategory === tab.id ? '#fff' : 'var(--text-primary)',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: activeCategory === tab.id ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Station Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredStations.map((station, idx) => {
            const Icon = station.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  background: '#fff',
                  borderTop: station.type === 'mountain' ? '4px solid #f59e0b' : station.type === 'coastal' ? '4px solid #14b8a6' : '4px solid #3b82f6'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{station.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {station.region} • Elevation: {station.elevation}
                    </div>
                  </div>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: station.type === 'mountain' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(20, 184, 166, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} color={station.type === 'mountain' ? '#f59e0b' : '#14b8a6'} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{station.temp}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{station.condition}</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.6rem',
                  padding: '0.8rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Wind: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{station.wind}</strong>
                  </div>
                  {station.surf && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Surf: </span>
                      <strong style={{ color: '#0f766e' }}>{station.surf}</strong>
                    </div>
                  )}
                  {station.humidity && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Humidity: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{station.humidity}</strong>
                    </div>
                  )}
                  {station.tides && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tides: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{station.tides}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <ShieldAlert size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{station.advisory}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
