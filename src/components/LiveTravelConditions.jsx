import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Car, Clock3, ExternalLink, RefreshCw, Waves } from 'lucide-react';

const INCIDENTS_URL = 'https://services.arcgis.com/NuWFvHYDMVmmxMeM/ArcGIS/rest/services/NCDOT_TIMSIncidentsBySeverity/FeatureServer/0/query';
const INCIDENT_FIELDS = [
  'Id', 'Location', 'Road', 'Direction', 'RouteType', 'CountyName', 'Reason',
  'EventType', 'EventSubType', 'Condition', 'Detour', 'LanesAffected',
  'IsFullClosure', 'DriveNCLink', 'StartDateTime', 'EndDateTime',
  'LastUpdateDateTime'
].join(',');

const TIDE_STATIONS = [
  { id: '8654400', name: 'Cape Hatteras Fishing Pier', area: 'Outer Banks' },
  { id: '8658163', name: 'Wrightsville Beach', area: 'Cape Fear Coast' }
];

function easternDateParts() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return values.year + values.month + values.day;
}

function readableDate(value) {
  if (!value) return 'Update time unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Update time unavailable' : date.toLocaleString();
}

function normalizeIncidents(payload) {
  const rows = payload?.features || payload?.value || payload?.incidents || [];
  return rows.map((row, index) => {
    const a = row.attributes || row.properties || row;
    return {
      id: a.Id ?? a.id ?? index,
      location: a.Location || a.location || 'Location details unavailable',
      road: a.Road || a.road || '',
      direction: a.Direction || a.direction || '',
      county: a.CountyName || a.county || '',
      reason: a.Reason || a.reason || '',
      type: [a.EventType, a.EventSubType].filter(Boolean).join(' · ') || a.type || 'Travel incident',
      condition: a.Condition || a.condition || '',
      detour: a.Detour || a.detour || '',
      lanes: a.LanesAffected || a.lanesAffected || '',
      fullClosure: ['yes', 'true', '1'].includes(String(a.IsFullClosure ?? '').toLowerCase()),
      updated: a.LastUpdateDateTime || a.lastUpdateDateTime,
      link: a.DriveNCLink || a.driveNCLink || 'https://drivenc.gov'
    };
  });
}

async function fetchIncidents() {
  const params = new URLSearchParams({
    where: '1=1',
    outFields: INCIDENT_FIELDS,
    returnGeometry: 'false',
    orderByFields: 'LastUpdateDateTime DESC',
    resultRecordCount: '100',
    f: 'json'
  });
  const response = await fetch(INCIDENTS_URL + '?' + params.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('NCDOT incident feed returned ' + response.status);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'NCDOT incident feed error');
  return normalizeIncidents(data);
}

async function fetchTides(station) {
  const params = new URLSearchParams({
    product: 'predictions',
    application: 'NCTravelGuide',
    begin_date: easternDateParts(),
    end_date: easternDateParts(),
    datum: 'MLLW',
    station: station.id,
    time_zone: 'lst_ldt',
    units: 'english',
    interval: 'hilo',
    format: 'json'
  });
  const response = await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?' + params.toString(), {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error('NOAA tide feed returned ' + response.status);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'NOAA tide feed error');
  return { ...station, predictions: data.predictions || [] };
}

export default function LiveTravelConditions() {
  const [incidents, setIncidents] = useState([]);
  const [tides, setTides] = useState([]);
  const [roadStatus, setRoadStatus] = useState('loading');
  const [tideStatus, setTideStatus] = useState('loading');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const [roadResult, tideResults] = await Promise.all([
      fetchIncidents().then(data => ({ ok: true, data })).catch(error => ({ ok: false, error })),
      Promise.allSettled(TIDE_STATIONS.map(fetchTides))
    ]);
    if (roadResult.ok) {
      setIncidents(roadResult.data);
      setRoadStatus('loaded');
    } else {
      setRoadStatus('unavailable');
    }
    const availableTides = tideResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    setTides(availableTides);
    setTideStatus(availableTides.length ? 'loaded' : 'unavailable');
    setUpdatedAt(new Date());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const closures = incidents.filter(item => item.fullClosure || /closed/i.test(item.condition));
  const statusText = (status, count, singular, plural) => status === 'loading'
    ? 'Checking official feed…'
    : status === 'unavailable'
      ? 'Live feed temporarily unavailable'
      : count + ' ' + (count === 1 ? singular : plural);

  return (
    <section aria-labelledby="live-travel-heading" style={{ padding: '3.5rem 0', background: 'rgba(15, 23, 42, 0.035)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-teal" style={{ marginBottom: '0.6rem' }}>
            <RefreshCw size={14} /> Official travel data · refreshes every 5 minutes
          </div>
          <h2 id="live-travel-heading" style={{ fontSize: '2.1rem', marginBottom: '0.55rem' }}>
            Live Road & <span className="text-gradient-blue">Coastal Conditions</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto', lineHeight: 1.6 }}>
            Current NCDOT travel incidents and NOAA high/low tide predictions for two featured coastal locations.
            Always confirm route, beach, and marine conditions with the official agencies before departure.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.3rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {updatedAt ? 'Checked ' + updatedAt.toLocaleTimeString() : 'Waiting for first update'}
          </span>
          <button type="button" className="btn btn-secondary" onClick={refresh} disabled={refreshing} style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh feeds
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
          <article className="glass-card" style={{ padding: '1.3rem', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.9rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Car size={19} /> NCDOT road incidents</h3>
              <span className="badge badge-blue" role="status" aria-live="polite">{statusText(roadStatus, incidents.length, 'record', 'records')}</span>
            </div>
            {roadStatus === 'loaded' && (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.9rem' }}>
                  {closures.length} reported full or road-condition closures in the returned feed. The feed can include incidents across the state.
                </p>
                {incidents.length ? incidents.slice(0, 6).map(item => (
                  <div key={item.id} style={{ padding: '0.8rem 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.road || item.type}</strong>
                      <span className="badge badge-amber">{item.fullClosure ? 'Full closure' : 'Travel notice'}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {[item.county && item.county + ' County', item.direction, item.location].filter(Boolean).join(' · ')}
                    </div>
                    {item.reason && <p style={{ fontSize: '0.82rem', margin: '0.35rem 0', color: 'var(--text-secondary)' }}>{item.reason}</p>}
                    {item.condition && <div style={{ fontSize: '0.78rem', fontWeight: 650 }}>{item.condition}{item.fullClosure ? ' · Full closure' : ''}</div>}
                    {item.detour && <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Detour: {item.detour}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}><Clock3 size={12} style={{ verticalAlign: 'middle' }} /> {readableDate(item.updated)}</span>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.76rem', color: 'var(--accent-blue-light)' }}>DriveNC details <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>The feed returned no incident records at this check.</p>}
              </>
            )}
            {roadStatus !== 'loaded' && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Use the official DriveNC map for current closures and incidents while this feed is unavailable.</p>}
            <a href="https://drivenc.gov" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginTop: '0.8rem', fontSize: '0.8rem' }}>Open official DriveNC <ExternalLink size={14} /></a>
          </article>

          <article className="glass-card" style={{ padding: '1.3rem', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <AlertTriangle size={19} />
              <h3 style={{ fontSize: '1.15rem' }}>North Carolina ferry status</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '0.85rem' }}>
              Ferry schedules and service interruptions can change with weather, water levels, and operational conditions.
              NCDOT provides route schedules and a free notification system for delays and cancellations.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <a href="https://www.ncdot.gov/travel-maps/ferry-tickets-services/schedule/default.aspx" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Official ferry schedules & status <ExternalLink size={14} /></a>
              <a href="https://www.ncdot.gov/travel-maps/ferry-tickets-services/Pages/ferry-information-notification-system.aspx" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>FINS text/email alerts <ExternalLink size={14} /></a>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.7rem' }}>FINS alerts are sent by NCDOT for the specific routes a traveler selects; this guide does not claim a ferry route is operating until its official status is checked.</p>
          </article>

          <article className="glass-card" style={{ padding: '1.3rem', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.9rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Waves size={19} /> NOAA tide predictions</h3>
              <span className="badge badge-teal" role="status" aria-live="polite">{statusText(tideStatus, tides.length, 'station', 'stations')}</span>
            </div>
            {tides.map(station => (
              <div key={station.id} style={{ padding: '0.8rem 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{station.name}</strong>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{station.area} · NOAA station {station.id} · local station time · feet · MLLW datum</div>
                {station.predictions.length ? (
                  <div style={{ overflowX: 'auto', marginTop: '0.55rem' }}>
                    <table aria-label={`High and low tide predictions for ${station.name}`} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.14)' }}>
                          <th scope="col" style={{ padding: '0.45rem 0.35rem' }}>Tide</th>
                          <th scope="col" style={{ padding: '0.45rem 0.35rem' }}>Local time</th>
                          <th scope="col" style={{ padding: '0.45rem 0.35rem', textAlign: 'right' }}>Height</th>
                        </tr>
                      </thead>
                      <tbody>
                        {station.predictions.map((prediction, index) => (
                          <tr key={station.id + '-' + index} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                            <td style={{ padding: '0.5rem 0.35rem', color: 'var(--text-primary)', fontWeight: 600 }}>{prediction.type === 'H' ? 'High' : prediction.type === 'L' ? 'Low' : 'Tide'}</td>
                            <td style={{ padding: '0.5rem 0.35rem', color: 'var(--text-secondary)' }}>{prediction.t}</td>
                            <td style={{ padding: '0.5rem 0.35rem', color: 'var(--text-primary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{prediction.v} ft</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>No high/low tide predictions were returned for today.</p>}
              </div>
            ))}
            {tideStatus !== 'loaded' && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Open NOAA's station map for current observations and predictions.</p>}
            <a href="https://tidesandcurrents.noaa.gov/map/index.html?region=North%20Carolina" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginTop: '0.8rem', fontSize: '0.8rem' }}>Open NOAA Tides & Currents <ExternalLink size={14} /></a>
          </article>
        </div>

        <section aria-labelledby="drivenc-map-heading" style={{ marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.9rem' }}>
            <h3 id="drivenc-map-heading" style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>Interactive NCDOT DriveNC / TIMS Map</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', maxWidth: '780px', margin: '0 auto' }}>
              Official NCDOT dashboard showing current traveler-information incidents. The dashboard is hosted by ArcGIS and may load separately from this guide.
            </p>
          </div>
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.14)', background: '#fff' }}>
            <iframe
              title="Official NCDOT DriveNC and TIMS current incidents dashboard"
              src="https://ncdot.maps.arcgis.com/apps/opsdashboard/index.html#/d16841a31ea3487f803384f7233c6d53"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: 'min(72vh, 760px)', minHeight: '480px', border: 0 }}
            />
          </div>
          <p style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.7rem', fontSize: '0.8rem' }}>
            <a href="https://ncdot.maps.arcgis.com/apps/opsdashboard/index.html#/d16841a31ea3487f803384f7233c6d53" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 600 }}>Open full NCDOT dashboard <ExternalLink size={13} style={{ verticalAlign: 'middle' }} /></a>
            <a href="https://drivenc.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 600 }}>Open DriveNC.gov <ExternalLink size={13} style={{ verticalAlign: 'middle' }} /></a>
          </p>
        </section>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.5 }}>
          Sources: North Carolina Department of Transportation TIMS/DriveNC and NOAA Center for Operational Oceanographic Products and Services.
          Tide predictions are not real-time water-level observations and do not replace marine forecasts or local safety guidance.
        </p>
      </div>
    </section>
  );
}
