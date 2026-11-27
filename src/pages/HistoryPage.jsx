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
            <p style={{ color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto', lineHeight: 1.6 }}>
              North Carolina's official symbols are established by state law. These examples connect the state's natural heritage with its economic and cultural history.
              <a href="https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_145.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650, marginLeft: '0.35rem' }}>Read Chapter 145 of the General Statutes <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
            </p>
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
                    State Flower
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>Flowering Dogwood</h3>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    (Cornus florida)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The dogwood is North Carolina's official state flower. The showy white parts are four petal-like bracts surrounding a cluster of small true flowers; the tree grows throughout the state.
                  </p>
                  <a href="https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_145/GS_145-1.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.78rem', fontWeight: 650 }}>Official flower statute <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                  <a href="https://plants.ces.ncsu.edu/plants/cornus-florida/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.78rem', fontWeight: 650, display: 'block', marginTop: '0.3rem' }}>NC State Extension: Flowering Dogwood <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
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
                    The cardinal was adopted as North Carolina's official state bird in 1943.
                  </p>
                  <a href="https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_145/GS_145-2.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.78rem', fontWeight: 650 }}>Official state bird statute <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
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
                  Adopted 1963 · Emblem 2023
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase' }}>
                    State Tree & Emblem
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>Pine / Longleaf Pine</h3>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    (Pinus palustris)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    North Carolina law names the pine as the official state tree and designates the longleaf pine as the emblem representing the state's trees. Longleaf forests supported the naval stores economy—tar, pitch, and turpentine. That industry is part of the history behind the "Tar Heel" nickname, whose precise origin remains debated.
                  </p>
                  <a href="https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_145/GS_145-3.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.78rem', fontWeight: 650 }}>Official state tree statute <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                  <a href="https://www.ncpedia.org/tar-heel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.78rem', fontWeight: 650, display: 'block', marginTop: '0.3rem' }}>NCpedia: history of the Tar Heel nickname <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
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
              <figcaption style={{ padding: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>A historical Croatan Indian petition</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.4rem 0' }}>A petition page preserved in ECU's digital collection under the Croatan Indian title. Consult the collection record for its date, provenance, and full context; this single document is not a complete account of Indigenous life.</p><a href="https://digital.lib.ecu.edu/17035" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.82rem', fontWeight: 650 }}>East Carolina University Digital Collections ↗</a></figcaption>
            </figure>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, textAlign: 'center', marginTop: '0.9rem' }}>Image credits and collection records are linked with each photograph. Rights and reuse terms vary by institution; verify permissions before republication or commercial reuse.</p>
        </section>

        {/* Historic Milestones Timeline */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>
              Historic Milestones & <span className="text-gradient-amber">Community Histories</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore distinct histories of settlement, community formation, self-government, emancipation, and innovation.</p>
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
                The 1587 expedition was England's second major colonizing attempt at Roanoke. Virginia Dare was born there—the first English child born in the New World. When John White returned in 1590, the settlement was no longer present and the colonists' fate remained unresolved.
              </p>
              <a href="https://www.nps.gov/fora/learn/historyculture/the-lost-colony.htm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650, display: 'inline-block', marginTop: '0.6rem' }}>National Park Service: The Lost Colony <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
              <button onClick={() => navigate('/counties/dare-county/history')} style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-amber-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Dare County History Vault <ArrowRight size={14} />
              </button>
            </div>

            {/* Colonial-era communities and government */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-amber">1766–1770 · Forsyth & Craven Counties</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Piedmont & Coastal Plain</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Old Salem & Tryon Palace</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Salem was founded in 1766 as the central town of the Moravian Wachovia settlement. Tryon Palace opened in New Bern in 1770 as colonial North Carolina's first permanent capitol building. These are distinct stories: a Moravian community in the Piedmont and the colony's center of royal government on the coast.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.65rem' }}>
                <a href="https://www.oldsalem.org/oldsalemresearch/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>Old Salem research & history <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                <a href="https://www.tryonpalace.org/the-palace-historic-homes/tryon-palace/palace-history" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>Tryon Palace official history <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                <a href="/counties/forsyth-county/history" style={{ color: 'var(--accent-amber-light)', fontSize: '0.8rem', fontWeight: 650 }}>Explore Forsyth County History Vault <ArrowRight size={12} style={{ verticalAlign: 'middle' }} /></a>
                <a href="/counties/craven-county/history" style={{ color: 'var(--accent-amber-light)', fontSize: '0.8rem', fontWeight: 650 }}>Explore Craven County History Vault <ArrowRight size={12} style={{ verticalAlign: 'middle' }} /></a>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue">1775–1776 · Mecklenburg & Halifax</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"First in Freedom"</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Mecklenburg Resolves & Halifax Resolves</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Mecklenburg County adopted the Mecklenburg Resolves on May 31, 1775. The separate Mecklenburg Declaration, said to date to May 20, 1775, is not accepted as authentic by most modern scholars. On April 12, 1776, the Fourth Provincial Congress adopted the Halifax Resolves, authorizing North Carolina's delegates to vote for independence—the first official colonial action of its kind.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.65rem' }}>
                <a href="https://sites.ncleg.gov/library/april-12-1776-the-halifax-resolves/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>NC General Assembly: Halifax Resolves <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                <a href="https://www.ncpedia.org/mecklenburg-declaration" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>NCpedia: Mecklenburg Declaration evidence <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
              </div>
              <button onClick={() => navigate('/counties/halifax-county/history')} style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-blue-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Halifax County History <ArrowRight size={14} />
              </button>
            </div>

            {/* Milestone: Roanoke Island Freedmen's Colony */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-amber">1862–1867 · Dare County</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Roanoke Island</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Roanoke Island Freedmen's Colony</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                After Union forces occupied Roanoke Island in 1862, freedom seekers built a community with homes, churches, schools, and a sawmill. The colony grew to thousands of residents, but federal land restoration and the withdrawal of support led to its decline; it was officially decommissioned by 1867.
              </p>
              <a href="https://www.nps.gov/articles/the-freedmen-s-colony-on-roanoke-island.htm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>National Park Service: Freedmen's Colony history <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
            </div>

            {/* Milestone 3 */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid #34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-emerald">1903 • Kill Devil Hills</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"First in Flight"</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>The Wright Brothers' First Powered Flight</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                On December 17, 1903, Orville Wright piloted the Wright Flyer at Kill Devil Hills. The flight demonstrated a controllable, heavier-than-air machine taking off from a level surface under its own power and landing at the same height.
              </p>
              <a href="https://www.nps.gov/articles/firstflight.htm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 650 }}>National Park Service: The First Flight <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
            </div>

                        {/* Research starting points */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-blue-light)' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Research starting points: archives, collections & local records</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                County histories are strongest when local records are compared with institutional collections and community-held materials. These research portals help locate documents, photographs, maps, newspapers, oral histories, and collection descriptions. A catalog entry is a lead for research, not proof of a historical claim by itself.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                <a href="https://archives.ncdcr.gov/researchers/digital-collections" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650 }}>
                  State Archives: Digital Collections <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://archives.ncdcr.gov/doc" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650 }}>
                  Discover Online Catalog (DOC) <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://www.ncpedia.org/primary-source-sets-and-collections" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650 }}>
                  NCpedia: Primary Source Collections <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://www.digitalnc.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650 }}>
                  DigitalNC: Community Heritage Collections <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
                <a href="https://digital.lib.ecu.edu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontWeight: 650 }}>
                  ECU Digital Collections <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                </a>
              </div>
            </div>

            {/* County research call to action */}
            <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-amber)' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Keep exploring North Carolina's county histories</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                The History Vault is being expanded county by county as archival records, community histories, and institutional sources are reviewed. Entries are labeled as research-in-progress when a sourced history is not yet available.
              </p>
              <button onClick={() => navigate('/counties')} className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                Browse all 100 counties <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
