import React, { useCallback, useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle, CloudFog, Wind, RefreshCw, MapPin, Mountain, Waves, AlertCircle } from 'lucide-react';

const STATIONS = [
  { id: 'mount-mitchell', name: 'Mount Mitchell Summit', region: 'High Country · Blue Ridge', elevation: '6,684 ft', type: 'mountain', latitude: 35.7648, longitude: -82.2651 },
  { id: 'grandfather', name: 'Grandfather Mountain', region: 'Blue Ridge Parkway', elevation: '5,946 ft', type: 'mountain', latitude: 36.0859, longitude: -81.8468 },
  { id: 'outer-banks', name: 'Cape Hatteras', region: 'Outer Banks · Dare County', elevation: '10 ft', type: 'coastal', latitude: 35.2510, longitude: -75.5280 },
  { id: 'wrightsville', name: 'Wrightsville Beach', region: 'Cape Fear Coast', elevation: '15 ft', type: 'coastal', latitude: 34.2085, longitude: -77.7964 },
  { id: 'triangle', name: 'Raleigh–Durham', region: 'Central Piedmont', elevation: '436 ft', type: 'piedmont', latitude: 35.7796, longitude: -78.6382 },
  { id: 'charlotte', name: 'Charlotte & Lake Norman', region: 'Charlotte Metro', elevation: '761 ft', type: 'piedmont', latitude: 35.2271, longitude: -80.8431 }
];

const WEATHER_CODES = {
  0: ['Clear sky', Sun], 1: ['Mainly clear', Sun], 2: ['Partly cloudy', Cloud], 3: ['Overcast', Cloud],
  45: ['Fog', CloudFog], 48: ['Rime fog', CloudFog], 51: ['Light drizzle', CloudDrizzle],
  53: ['Drizzle', CloudDrizzle], 55: ['Dense drizzle', CloudDrizzle], 56: ['Freezing drizzle', CloudDrizzle],
  57: ['Heavy freezing drizzle', CloudDrizzle], 61: ['Light rain', CloudRain], 63: ['Rain', CloudRain],
  65: ['Heavy rain', CloudRain], 66: ['Freezing rain', CloudRain], 67: ['Heavy freezing rain', CloudRain],
  71: ['Light snow', CloudSnow], 73: ['Snow', CloudSnow], 75: ['Heavy snow', CloudSnow],
  77: ['Snow grains', CloudSnow], 80: ['Rain showers', CloudRain], 81: ['Rain showers', CloudRain],
  82: ['Heavy rain showers', CloudRain], 85: ['Snow showers', CloudSnow], 86: ['Heavy snow showers', CloudSnow],
  95: ['Thunderstorm', CloudRain], 96: ['Thunderstorm with hail', CloudRain], 99: ['Severe thunderstorm with hail', CloudRain]
};

function compassDirection(degrees = 0) {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(degrees / 45) % 8];
}

function formatTime(value) {
  if (!value) return 'Time unavailable';
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

async function loadStationWeather(station) {
  const params = new URLSearchParams({
    latitude: station.latitude,
    longitude: station.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'America/New_York',
    forecast_days: '1'
  });
  const response = await fetch('https://api.open-meteo.com/v1/forecast?' + params.toString());
  if (!response.ok) throw new Error('Weather service returned ' + response.status);
  const data = await response.json();
  if (!data.current) throw new Error('Current conditions are unavailable');
  return {
    ...station,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: Math.round(data.current.relative_humidity_2m),
    wind: Math.round(data.current.wind_speed_10m),
    windDirection: compassDirection(data.current.wind_direction_10m),
    gusts: Math.round(data.current.wind_gusts_10m || 0),
    precipitation: Number(data.current.precipitation || 0).toFixed(2),
    isDay: Boolean(data.current.is_day),
    observedAt: data.current.time,
    condition: WEATHER_CODES[data.current.weather_code]?.[0] || 'Conditions reported',
    icon: WEATHER_CODES[data.current.weather_code]?.[1] || Cloud,
    high: Math.round(data.daily?.temperature_2m_max?.[0] ?? data.current.temperature_2m),
    low: Math.round(data.daily?.temperature_2m_min?.[0] ?? data.current.temperature_2m),
    rainChance: data.daily?.precipitation_probability_max?.[0],
    sunrise: data.daily?.sunrise?.[0],
    sunset: data.daily?.sunset?.[0]
  };
}

export default function LiveWeatherConditions() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [conditions, setConditions] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  const refreshWeather = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled(STATIONS.map(loadStationWeather));
    const next = {};
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') next[STATIONS[index].id] = result.value;
    });
    setConditions(next);
    setLastUpdated(new Date());
    if (!Object.keys(next).length) setError('Live weather is temporarily unavailable. Please try again shortly.');
    else if (Object.keys(next).length < STATIONS.length) setError('Some locations could not be refreshed. Available locations are shown below.');
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshWeather();
    const timer = window.setInterval(refreshWeather, 15 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [refreshWeather]);

  const filteredStations = STATIONS.filter(station => activeCategory === 'ALL' || station.type === activeCategory);

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.45)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
            <Sun size={15} /> Live Weather · Auto-refreshes every 15 minutes
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            North Carolina <span className="text-gradient-blue">Weather Conditions</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto' }}>
            Current observations and today's forecast across mountain, coastal, and Piedmont destinations.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'ALL', label: 'All Locations' },
            { id: 'mountain', label: 'Mountains' },
            { id: 'coastal', label: 'Coast' },
            { id: 'piedmont', label: 'Piedmont & Lakes' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveCategory(tab.id)} className="btn" style={{
              padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)',
              background: activeCategory === tab.id ? '#0f172a' : '#fff',
              color: activeCategory === tab.id ? '#fff' : 'var(--text-primary)',
              border: '1px solid rgba(0,0,0,0.1)'
            }}>{tab.label}</button>
          ))}
          <button onClick={refreshWeather} disabled={loading} className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {error && <div role="status" style={{ margin: '0 0 1rem', padding: '0.8rem 1rem', borderRadius: '10px', background: '#fff7ed', color: '#9a3412', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={17} /> {error}
        </div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '1.25rem' }}>
          {filteredStations.map(station => {
            const weather = conditions[station.id];
            const Icon = weather?.icon || (station.type === 'mountain' ? Mountain : station.type === 'coastal' ? Waves : Cloud);
            return (
              <article key={station.id} className="glass-card" style={{ padding: '1.4rem', background: '#fff', borderTop: station.type === 'mountain' ? '4px solid #f59e0b' : station.type === 'coastal' ? '4px solid #14b8a6' : '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{station.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{station.region} · {station.elevation}</div>
                  </div>
                  <Icon size={27} color={station.type === 'mountain' ? '#d97706' : station.type === 'coastal' ? '#0d9488' : '#2563eb'} />
                </div>

                {weather ? <>
                  <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.7rem', margin: '1rem 0' }}>
                    <strong style={{ fontSize: '2.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>{weather.temperature}°F</strong>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{weather.condition}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Feels like </span><strong>{weather.feelsLike}°F</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>High / Low </span><strong>{weather.high}° / {weather.low}°</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Wind </span><strong>{weather.wind} mph {weather.windDirection}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Gusts </span><strong>{weather.gusts} mph</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Humidity </span><strong>{weather.humidity}%</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Rain chance </span><strong>{weather.rainChance == null ? '—' : weather.rainChance + '%'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Sunrise </span><strong>{formatTime(weather.sunrise)}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Sunset </span><strong>{formatTime(weather.sunset)}</strong></div>
                  </div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Observation: {formatTime(weather.observedAt)}
                  </div>
                </> : <div style={{ padding: '1.6rem 0', color: 'var(--text-secondary)' }}>{loading ? 'Loading live conditions…' : 'Conditions unavailable for this location.'}</div>}
              </article>
            );
          })}
        </div>

        <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {lastUpdated ? 'Weather data refreshed ' + lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '. ' : ''}
          Forecast data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Open-Meteo</a>.
          Coastal surf, tide predictions, and official hazard alerts are not included in these weather readings.
        </div>
      </div>
    </section>
  );
}
