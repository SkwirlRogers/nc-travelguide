import React, { useState } from 'react';
import { X, Heart, Trash2, MapPin, ExternalLink, Printer, Download, Calendar, Share2, Check, Clock } from 'lucide-react';

export default function SavedItineraryModal({ isOpen, onClose, savedItems, onRemoveItem, navigate }) {
  if (!isOpen) return null;

  const [activeDay, setActiveDay] = useState(1);
  const [copied, setCopied] = useState(false);
  // Custom day assignments for saved items
  const [dayAssignments, setDayAssignments] = useState({});

  const assignDay = (itemId, day) => {
    setDayAssignments(prev => ({ ...prev, [itemId]: day }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPDF = () => {
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);

    const daySections = [1, 2, 3].map((day) => {
      const itemsForDay = savedItems.filter((item) => (dayAssignments[item.id] || 1) === day);
      if (!itemsForDay.length) return '';
      const rows = itemsForDay.map((item) => `
        <li>
          <strong>${escapeHtml(item.title)} (${escapeHtml(item.type || 'Attraction')})</strong>
          <div>Location: ${escapeHtml(item.city || item.county || 'North Carolina')}, NC</div>
          <div>Category: ${escapeHtml(item.category || 'Sightseeing')}</div>
        </li>
      `).join('');
      return `<section><h2>Day ${day} Itinerary</h2><ol>${rows}</ol></section>`;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.alert('Please allow pop-ups for this site to export your itinerary as a PDF.');
      return;
    }

    printWindow.document.write(`<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>NC TravelGuide — Custom Trip Itinerary</title>
        <style>
          body { font: 14px/1.55 Arial, sans-serif; color: #1e293b; margin: 36px; }
          header { background: #4b9cd3; color: white; padding: 22px 26px; margin: -36px -36px 28px; }
          h1 { margin: 0 0 6px; font-size: 22px; }
          header p { margin: 0; font-size: 12px; }
          h2 { color: #b45309; font-size: 16px; margin: 22px 0 10px; text-transform: uppercase; }
          li { margin: 0 0 14px; padding-left: 4px; }
          li div { color: #64748b; font-size: 12px; }
          .empty { color: #64748b; }
          @media print { body { margin: 18mm; } header { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <header>
          <h1>North Carolina Custom Trip Itinerary</h1>
          <p>NC TravelGuide • From the Blue Ridge Mountains to the Outer Banks</p>
        </header>
        ${daySections || '<p class="empty">No saved places in this itinerary.</p>'}
      </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
  };

  const currentDayItems = savedItems.filter(item => (dayAssignments[item.id] || 1) === activeDay);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-primary)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(75, 156, 211, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={24} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Multi-Day NC Trip Planner</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {savedItems.length} Saved {savedItems.length === 1 ? 'Experience' : 'Experiences'} in Plan
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.3rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* Multi-day schedule switch buttons */}
        {savedItems.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: activeDay === d ? 700 : 500,
                    background: activeDay === d ? '#0f172a' : '#ffffff',
                    color: activeDay === d ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                >
                  Day {d} ({savedItems.filter(i => (dayAssignments[i.id] || 1) === d).length})
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> Estimated 3-Day Trip Sequence
            </div>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {savedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Heart size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h4>No items saved to your itinerary yet!</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Browse attractions, hotels, or restaurants across NC and click the heart icon to schedule your custom day-by-day vacation.
              </p>
              <button 
                onClick={() => { onClose(); navigate('/experiences'); }}
                className="btn btn-primary" 
                style={{ marginTop: '1.2rem' }}
              >
                Browse Experiences Directory
              </button>
            </div>
          ) : currentDayItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <Calendar size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
              <p>No experiences assigned to Day {activeDay} yet.</p>
              <span style={{ fontSize: '0.82rem' }}>Assign any saved place to Day {activeDay} from the dropdown below.</span>
            </div>
          ) : (
            currentDayItems.map((item, idx) => (
              <div 
                key={item.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className={`badge ${
                        item.type === 'Attraction' ? 'badge-amber' : item.type === 'Hotel' ? 'badge-blue' : 'badge-emerald'
                      }`}>
                        {item.type}
                      </span>
                      {item.category && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>• {item.category}</span>}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <MapPin size={13} color="var(--accent-amber)" /> {item.city || item.county}, NC
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {/* Day Picker */}
                  <select
                    value={dayAssignments[item.id] || 1}
                    onChange={(e) => assignDay(item.id, Number(e.target.value))}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(0,0,0,0.15)',
                      fontSize: '0.82rem',
                      background: '#fff',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value={1}>Day 1</option>
                    <option value={2}>Day 2</option>
                    <option value={3}>Day 3</option>
                  </select>

                  {item.targetLink && (
                    <a 
                      href={item.targetLink.startsWith('http') ? item.targetLink : `https://${item.targetLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: '#fff' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      padding: '0.45rem',
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    title="Remove from itinerary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-secondary" style={{ fontSize: '0.85rem', background: '#fff' }}>
                <Printer size={16} /> Print
              </button>
              <button onClick={handleShare} className="btn btn-secondary" style={{ fontSize: '0.85rem', background: '#fff' }}>
                {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>

            <button onClick={handleExportPDF} className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.25rem' }}>
              <Download size={16} /> Save Itinerary as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
