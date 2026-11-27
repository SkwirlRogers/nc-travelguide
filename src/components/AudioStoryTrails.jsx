import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Flag, ShieldCheck, MapPin } from 'lucide-react';

const AUDIO_TRAILS = [
  {
    id: 'first-flight',
    title: 'December 17, 1903: 12 Seconds at Kill Devil Hills',
    theme: 'First in Flight & Innovation',
    location: 'Kitty Hawk & Kill Devil Hills, Dare County',
    duration: '4 min listen',
    speaker: 'Orville & Wilbur Wright Heritage Narrator',
    description: 'Relive the freezing Outer Banks morning where four short flights over sand dunes launched mankind into the skies.',
    transcript: 'At 10:35 a.m. on December 17, 1903, against a bitter 27 mph wind at Kill Devil Hills, Orville Wright slipped into the hip cradle of the Flyer. Wilbur ran alongside holding the wing tip. In twelve seconds and 120 feet of track, human transportation was transformed forever.',
    audioFact: 'The sand and steady winds of the Outer Banks were specifically selected after weather inquiries to the U.S. Weather Bureau in Washington.'
  },
  {
    id: 'halifax-resolves',
    title: 'April 12, 1776: The First Call for Independence',
    theme: 'First in Freedom (America 250th)',
    location: 'Halifax Historic District, Halifax County',
    duration: '5 min listen',
    speaker: 'Revolutionary NC Historian',
    description: 'Why North Carolina plates carry "First in Freedom" — the Halifax Resolves predated the national Declaration of Independence by nearly three months.',
    transcript: 'Meeting in Fourth Provincial Congress in Halifax, North Carolina on April 12, 1776, delegates voted unanimously to empower their continental delegates in Philadelphia to declare complete independence from Great Britain.',
    audioFact: 'The date "April 12, 1776" is officially emblazoned on the flag of the State of North Carolina.'
  },
  {
    id: 'civil-rights',
    title: 'February 1, 1960: The Woolworth Sit-In That Ignited a Movement',
    theme: 'African American Heritage Trail',
    location: 'International Civil Rights Center, Greensboro, Guilford County',
    duration: '6 min listen',
    speaker: 'Greensboro Four Memorial Archive',
    description: 'Four North Carolina A&T students took their seats at an all-white lunch counter and changed American history.',
    transcript: 'Ezell Blair Jr., Franklin McCain, Joseph McNeil, and David Richmond purchased items at Woolworth’s before taking their seats at the lunch counter. When refused service, they remained seated until closing. Within days, hundreds of students joined the peaceful movement.',
    audioFact: 'A section of the original Woolworth lunch counter and stools is preserved both in Greensboro and the Smithsonian National Museum of American History.'
  },
  {
    id: 'blackbeard-pirates',
    title: 'November 22, 1718: Blackbeard’s Last Stand at Ocracoke Inlet',
    theme: 'Maritime & Pirate Legends',
    location: 'Teach’s Hole, Ocracoke Island, Hyde County',
    duration: '4 min listen',
    speaker: 'Coastal NC Folklorist',
    description: 'The fierce battle between Edward Teach (Blackbeard) and Royal Navy Lieutenant Robert Maynard in the shallow waters of Pamlico Sound.',
    transcript: 'Edward Teach ruled the Caribbean and Atlantic coastline aboard the Queen Anne’s Revenge. But on a calm autumn morning inside Ocracoke Inlet, Maynard’s sloops cornered the pirate flagship in a brutal hand-to-hand fight.',
    audioFact: 'Blackbeard’s flagship, Queen Anne’s Revenge, was discovered in Beaufort Inlet in 1996 and artifacts are on display at the NC Maritime Museum in Beaufort.'
  }
];

export default function AudioStoryTrails() {
  const [playingId, setPlayingId] = useState(null);

  const toggleSpeech = (trail) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (playingId === trail.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${trail.title}. ${trail.transcript}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingId(trail.id);
    }
  };

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.4)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={15} /> America 250th & Heritage Audio Showcase
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Listen to NC: <span className="text-gradient-amber">Interactive Audio Trails</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            Experience voice-narrated chronicles of aviation triumphs, Revolutionary freedom declarations, Civil Rights milestones, and coastal legends.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {AUDIO_TRAILS.map((trail) => {
            const isPlaying = playingId === trail.id;
            return (
              <div
                key={trail.id}
                className="glass-card"
                style={{
                  padding: '2rem',
                  background: '#fff',
                  borderTop: isPlaying ? '4px solid #ef4444' : '4px solid #f59e0b',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-blue">{trail.theme}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{trail.duration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{trail.title}</h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.85rem' }}>
                    <MapPin size={14} /> {trail.location}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {trail.description}
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-blue)',
                    marginBottom: '1.25rem',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    "{trail.transcript}"
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => toggleSpeech(trail)}
                    className="btn"
                    style={{
                      width: '100%',
                      background: isPlaying ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: isPlaying ? '#fff' : '#000',
                      padding: '0.75rem',
                      fontWeight: 700,
                      boxShadow: isPlaying ? '0 4px 15px rgba(239,68,68,0.3)' : '0 4px 15px rgba(245,158,11,0.3)'
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX size={18} /> Stop Audio Narrative
                      </>
                    ) : (
                      <>
                        <Volume2 size={18} /> Listen to Historical Audio ({trail.duration})
                      </>
                    )}
                  </button>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                    Narrated via Web Audio API • Preserved by State Archives
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
