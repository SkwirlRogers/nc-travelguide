import React from 'react';
import { History, Award, Flag, MapPin, Calendar, ExternalLink, ArrowRight, TreePine, Landmark } from 'lucide-react';

export default function HistoryPage({ navigate }) {
  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
            <Award size={16} /> Heritage & Cultural Legacy
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            NORTH CAROLINA HERITAGE
          </h1>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            color: 'var(--accent-amber-light)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            "First in Flight" • "First in Freedom" • Historic America 250th
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Explore four centuries of history—from Sir Walter Raleigh's Lost Colony to the revolutionary Halifax Resolves, the Wright Brothers' aviation triumph, and NC's state natural symbols.
          </p>
        </div>

        {/* State Symbols Showcase Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem' }}>
              Official State <span className="text-gradient-amber">Symbols of North Carolina</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Adopted by the NC General Assembly to commemorate the state's floral and fauna heritage.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Card 1: State Flower - Dogwood */}
            <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '240px',
                backgroundImage: `url('/images/state-flower-dogwood.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <span className="badge badge-amber" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Adopted 1941
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                    State Wildflower & Blossom
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>Flowering Dogwood</h3>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    (Cornus florida)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The four-petaled white bloom covers North Carolina woodlands every spring. Found abundantly in all 100 counties from mountain passes to coastal plains.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: State Bird - Cardinal */}
            <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '240px',
                backgroundImage: `url('/images/state-bird-cardinal.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <span className="badge badge-crimson" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Adopted 1943
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, textTransform: 'uppercase' }}>
                    State Bird
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>Northern Cardinal</h3>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    (Cardinalis cardinalis)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Renowned for its vibrant crimson plumage and melodious whistle, the Northern Cardinal remains a year-round resident across NC backyards and state parks.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: State Tree - Longleaf Pine */}
            <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '240px',
                backgroundImage: `url('/images/state-tree-pine.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <span className="badge badge-emerald" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Adopted 1963
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase' }}>
                    State Tree
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>Longleaf Pine</h3>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    (Pinus palustris)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The majestic Longleaf Pine defined NC's early naval stores industry (tar, pitch, and turpentine), coining North Carolina's famous moniker "The Tar Heel State".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Archival photographs and primary-source records */}
        <section aria-labelledby="history-photo-heading" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.7rem' }}><History size={15} /> Historic photographs & archival records</div>
            <h2 id="history-photo-heading" style={{ fontSize: '2rem' }}>See the <span className="text-gradient-amber">History</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto', lineHeight: 1.65 }}>A growing visual collection of North Carolina places, people, and documents. Each caption identifies what the image shows and links to its holding institution or collection record.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.1rem' }}>
            <figure className="glass-card" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#fff' }}>
              <img src="https://www.nps.gov/articles/000/images/Fort-Raleigh-entrance-ca.png" alt="Historic photograph of the entrance to Old Fort Raleigh on Roanoke Island" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ padding: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Old Fort Raleigh entrance</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.4rem 0' }}>A later archival photograph of the memorial landscape—not an image from the 1580s.</p><a href="https://www.nps.gov/articles/000/old-fort-raleigh-state-park.htm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.82rem', fontWeight: 650 }}>National Park Service image & context ↗</a></figcaption>
            </figure>
            <figure className="glass-card" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#fff' }}>
              <img src="https://cdn4.picryl.com/photo/1901/01/01/visitors-and-fellow-campers-in-the-wrights-work-shed-at-kitty-hawk-north-carolina-1024.jpg" alt="Wright brothers' work shed at Kitty Hawk, photographed around 1901" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ padding: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>The Wrights' Kitty Hawk work shed</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.4rem 0' }}>A photograph from the brothers' early aviation experiments on the Outer Banks.</p><a href="https://loc.getarchive.net/media/visitors-and-fellow-campers-in-the-wrights-work-shed-at-kitty-hawk-north-carolina" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.82rem', fontWeight: 650 }}>Open image record ↗</a></figcaption>
            </figure>
            <figure className="glass-card" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#fff' }}>
              <img src="https://www.nps.gov/wrbr/planyourvisit/images/FORA-collage.jpg" alt="National Park Service collage showing Freedmen's Colony earthworks and interpretive sign on Roanoke Island" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <figcaption style={{ padding: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Freedmen's Colony of Roanoke Island</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.4rem 0' }}>The Civil War-era Freedmen's Colony is part of the island's history beyond the 16th-century English settlement.</p><a href="https://www.nps.gov/wrbr/planyourvisit/nearbyattractions.htm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.82rem', fontWeight: 650 }}>National Park Service context ↗</a></figcaption>
            </figure>
            <figure className="glass-card" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#fff' }}>
              <img src="https://iiif.lib.ecu.edu/cantaloupe/iiif/2/00017035_0022.jp2/full/2000%2C/0/default.jpg" alt="Page from a historical petition by Croatan Indians preserved in East Carolina University digital collections" loading="lazy" style={{ width: '100%', height: '220px', objectFit: 'contain', display: 'block', background: '#f1eee7' }} />
              <figcaption style={{ padding: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>A historical Croatan Indian petition</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.4rem 0' }}>A later written record documenting Indigenous people asserting community identity and educational rights. It is one document, not a complete account of Indigenous life.</p><a href="https://digital.lib.ecu.edu/17035" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.82rem', fontWeight: 650 }}>East Carolina University Digital Collections ↗</a></figcaption>
            </figure>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, textAlign: 'center', marginTop: '0.9rem' }}>Image credits and collection records are linked with each photograph. Rights and reuse terms vary by institution; verify permissions before republication or commercial reuse.</p>
        </section>

        {/* Historic Milestones Timeline */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>
              Historic Milestones & <span className="text-gradient-amber">Freedom Heritage</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Key historical moments that shaped American independence and global innovation.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
            {/* Milestone 1 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-amber">1587 • Dare County</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Roanoke Island</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Roanoke Island & The Lost Colony</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                England's first attempt at establishing a permanent settlement in the New World. Virginia Dare, the first English child born in America, was born here before the colony mysteriously vanished.
              </p>
              <button onClick={() => navigate('/counties/dare-county')} style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-amber-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Dare County Historic Sites <ArrowRight size={14} />
              </button>
            </div>

            {/* Milestone 2 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue">1775–1776 • Halifax & Mecklenburg</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"First in Freedom"</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Halifax Resolves & Mecklenburg Declaration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                On April 12, 1776, North Carolina became the very first American colony to explicitly authorize its delegates to vote for independence from Great Britain in the historic Halifax Resolves.
              </p>
              <button onClick={() => navigate('/counties/halifax-county')} style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-blue-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Halifax County History <ArrowRight size={14} />
              </button>
            </div>

            {/* Milestone 3 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-emerald">1903 • Kill Devil Hills</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"First in Flight"</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>First Powered Airplane Flight by Wright Brothers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Orville and Wilbur Wright achieved the world's first successful powered, heavier-than-air flight on the sands of Kill Devil Hills on December 17, 1903, forever placing NC on aviation flags worldwide.
              </p>
            </div>

            {/* Milestone 4 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #f87171' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-crimson">Colonial & America 250th</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Forsyth & Craven Counties</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Old Salem & Colonial Governor's Palace</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Experience living history in Old Salem Historic District (Winston-Salem) and Tryon Palace (New Bern), NC's first colonial capitol. Join statewide celebrations for America's 250th anniversary!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
