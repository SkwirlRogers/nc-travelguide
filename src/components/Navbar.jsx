import React, { useState } from 'react';
import { Compass, MapPin, Landmark, History, Sparkles, Search, Heart, Menu, X, TreePine, Building2 } from 'lucide-react';

export default function Navbar({ currentPath, navigate, savedItemsCount, onOpenSaved }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', icon: Compass },
    { label: 'Regions', path: '/regions', icon: Compass },
    { label: '100 Counties', path: '/counties', icon: MapPin },
    { label: 'Towns', path: '/towns', icon: Building2 },
    { label: 'NC History', path: '/history', icon: History },
    { label: 'Travel Ideas', path: '/travel-ideas', icon: Sparkles },
    { label: 'Experiences Directory', path: '/experiences', icon: Search },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <img 
            src="/images/nc-travel-guide-logo.png" 
            alt="NC Travel Guide Logo" 
            style={{ width: '48px', height: 'auto', borderRadius: '8px' }} 
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              NC <span className="text-gradient-amber">TravelGuide</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              The Tar Heel State • 100 Counties
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-amber-light)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-amber-light)' : 'currentColor'} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Saved Itinerary Button */}
          <button
            onClick={onOpenSaved}
            className="btn btn-secondary"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.85rem',
              position: 'relative',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Heart size={18} color="#ef4444" fill={savedItemsCount > 0 ? "#ef4444" : "none"} />
            <span className="saved-text" style={{ fontWeight: 600 }}>Itinerary</span>
            {savedItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239,68,68,0.5)'
              }}>
                {savedItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: '0.5rem',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.08)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: '#090e1a',
          borderTop: '1px solid var(--bg-card-border)',
          padding: '1rem 1.5rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-amber-light)' : 'var(--text-primary)',
                  background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'left'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-amber-light)' : 'var(--text-secondary)'} />
                {link.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline styles for media query responsiveness */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
