import React from 'react';
import { ArrowUpRight, Compass, Candy, ShieldCheck, TrendingUp, MapPin, Landmark } from 'lucide-react';

const sourceLinks = [
  { label: 'Visit North Carolina', href: 'https://www.visitnc.com/' },
  { label: 'NCpedia', href: 'https://www.ncpedia.org/' },
  { label: 'NC Wildlife Resources Commission', href: 'https://www.ncwildlife.gov/' },
  { label: 'NC State Parks', href: 'https://www.ncparks.gov/' },
  { label: 'Got to Be NC', href: 'https://gottobenc.com/' },
  { label: 'Made in NC', href: 'https://madeinnc.com/' },
  { label: 'NC SBI crime statistics', href: 'https://www.ncsbi.gov/SSRV?report=/UCR/IndexOffensesByAgencyInCounty' },
  { label: 'FBI Crime Data Explorer', href: 'https://cde.ucr.cjis.gov/' },
  { label: 'U.S. Census migration data', href: 'https://www.census.gov/topics/population/migration.html' },
  { label: 'ReadyNC emergency information', href: 'https://www.readync.gov/' },
  { label: 'DriveNC road conditions', href: 'https://drivenc.gov/' },
];

const destinationGroups = [
  { title: 'Mountains & High Country', places: 'Asheville and the Biltmore Estate · River Arts District · Great Smoky Mountains · Blue Ridge Parkway · Dry Falls · Mount Mitchell · Grandfather Mountain · Blowing Rock · Boone · Hanging Rock State Park' },
  { title: 'Piedmont & the Triangle', places: 'Raleigh · Durham · Chapel Hill · Research Triangle Park · North Carolina Museum of Natural Sciences · North Carolina Museum of Art · American Tobacco Campus' },
  { title: 'Charlotte & the Uwharrie region', places: 'Charlotte · NASCAR Hall of Fame · Carowinds · Asheboro and the North Carolina Zoo · Lake Norman' },
  { title: 'Coast & barrier islands', places: 'Outer Banks · Cape Hatteras · Kitty Hawk and the Wright Brothers National Memorial · Wilmington · Carolina Beach · Topsail Island · Bald Head Island' },
];

export default function NCEssentialsGuide() {
  return (
    <section aria-labelledby="nc-essentials-heading" style={{ padding: '4rem 0', background: 'linear-gradient(180deg, rgba(15,23,42,0.035), rgba(20,184,166,0.045))' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.25rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.7rem' }}><Compass size={15} /> The Tar Heel State at a Glance</div>
          <h2 id="nc-essentials-heading" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Get to Know <span className="text-gradient-amber">North Carolina</span></h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>A practical starting point for visitors, new residents, and lifelong Tar Heels—from mountain overlooks and coastal communities to local food, history, and public data.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 245px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <article className="glass-card" style={{ padding: '1.35rem', background: '#fff' }}>
            <Landmark size={25} color="#b7791f" />
            <h3 style={{ margin: '0.65rem 0 0.4rem', color: 'var(--text-primary)' }}>A state of contrasts</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>North Carolina stretches from the Appalachian Mountains and Blue Ridge to the Piedmont and more than 300 miles of Atlantic coastline. Its story includes aviation, agriculture, universities, research, banking, motorsports, and coastal trade.</p>
          </article>
          <article className="glass-card" style={{ padding: '1.35rem', background: '#fff' }}>
            <Candy size={25} color="#0d9488" />
            <h3 style={{ margin: '0.65rem 0 0.4rem', color: 'var(--text-primary)' }}>Local sweets & flavors</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Explore Red Bird puffed peppermints, Butterfield's candy buds, peanut and pecan brittles, regional toffees, and coastal saltwater taffy. Food traditions also include Eastern-style and Lexington-style barbecue, sweet potatoes, Cheerwine, and Pepsi.</p>
            <a href="https://gottobenc.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.65rem', color: 'var(--accent-blue-light)', fontWeight: 650, fontSize: '0.85rem' }}>Discover NC-made products <ArrowUpRight size={14} /></a>
          </article>
          <article className="glass-card" style={{ padding: '1.35rem', background: '#fff' }}>
            <ShieldCheck size={25} color="#2563eb" />
            <h3 style={{ margin: '0.65rem 0 0.4rem', color: 'var(--text-primary)' }}>Know before you go</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Check weather alerts, road closures, ferry service, park notices, and beach conditions before setting out. For safety comparisons, use dated agency-level crime data and compare rates—not raw totals alone.</p>
            <a href="https://www.readync.gov/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.65rem', color: 'var(--accent-blue-light)', fontWeight: 650, fontSize: '0.85rem' }}>Open ReadyNC <ArrowUpRight size={14} /></a>
          </article>
          <article className="glass-card" style={{ padding: '1.35rem', background: '#fff' }}>
            <TrendingUp size={25} color="#7c3aed" />
            <h3 style={{ margin: '0.65rem 0 0.4rem', color: 'var(--text-primary)' }}>Thinking about moving?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Compare communities by housing, jobs, healthcare, schools, transportation, climate risks, and cost of living. Census migration tables can show where newcomers came from; statewide totals should not be confused with each county's pattern.</p>
            <a href="https://www.census.gov/topics/population/migration.html" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.65rem', color: 'var(--accent-blue-light)', fontWeight: 650, fontSize: '0.85rem' }}>Explore Census migration data <ArrowUpRight size={14} /></a>
          </article>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#fff' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>What is North Carolina known for?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>The best-known nickname is the <strong>Tar Heel State</strong>; another historic name is the <strong>Old North State</strong>. The Tar Heel nickname is connected to the state's naval-stores history and became widely used during and after the Civil War. The precise origin story has several competing traditions.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            {['First in Flight', 'Blue Ridge & Smokies', 'Outer Banks', 'College basketball', 'NASCAR', 'Barbecue traditions', 'Banking & biotech', 'Longleaf pine'].map(tag => <span key={tag} className="badge badge-blue">{tag}</span>)}
          </div>
          <a href="https://www.ncpedia.org/tar-heel" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '1rem', color: 'var(--accent-blue-light)', fontWeight: 650, fontSize: '0.85rem' }}>Read NCpedia's Tar Heel history <ArrowUpRight size={14} /></a>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '1rem' }}>Places worth exploring</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '0.9rem' }}>
            {destinationGroups.map(group => <article key={group.title} className="glass-card" style={{ padding: '1.2rem', background: '#fff' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.45rem' }}>{group.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.65 }}>{group.places}</p>
            </article>)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Current events, public safety & statewide data</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.9rem' }}>This guide links to primary sources for changing information. Crime rankings depend on reporting year, agency participation, offense definitions, and population estimates; migration depends on the Census measure and time period. We will publish comparisons with their dates and methods rather than repeat unsourced rankings.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem 1rem' }}>
            {sourceLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-blue-light)', fontSize: '0.83rem', fontWeight: 600 }}>{link.label}<ArrowUpRight size={13} /></a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
