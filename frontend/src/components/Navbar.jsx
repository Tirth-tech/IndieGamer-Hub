import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Search, PlusCircle, ShieldCheck, LogOut, Zap, Globe, Heart, Grid, ChevronDown, Sparkles, Crosshair, Compass, Shield, Tractor, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, activeCountry, setCountryPref } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (genre) => {
    setIsCategoryMenuOpen(false);
    navigate(`/catalog?genre=${encodeURIComponent(genre)}`);
  };

  const navCategories = [
    { label: 'Action', filter: 'Action', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_231x87.jpg' },
    { label: 'Open World', filter: 'Open World', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_231x87.jpg' },
    { label: 'Survival', filter: 'Survival', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/capsule_231x87.jpg' },
    { label: 'Adventure', filter: 'Adventure', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_231x87.jpg' },
    { label: 'Co-op', filter: 'Co-op', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945360/capsule_231x87.jpg' },
    { label: 'Roguelike', filter: 'Roguelike', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_231x87.jpg' },
    { label: 'Horror', filter: 'Horror', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/418370/capsule_231x87.jpg' },
    { label: 'Simulator', filter: 'Simulation', img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1248130/capsule_231x87.jpg' }
  ];

  const popularTags = [
    'Simulation', 'Puzzle', 'Free to Play', 'Early Access', 'Sci-Fi & Cyberpunk', 
    'Strategy', 'Racing', 'Fighting', 'Anime', 'AAA', 'RTX High Performance'
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-nav)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      boxShadow: '0 4px 25px rgba(0, 255, 102, 0.15)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* LOGO */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'rgba(0, 255, 102, 0.1)',
            border: '2px solid var(--primary-green)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 255, 102, 0.25)'
          }}>
            <Gamepad2 size={24} color="var(--primary-green)" />
          </div>
          <span style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '0.5px',
            color: '#fff'
          }}>
            IndieGamer <span style={{ color: 'var(--primary-green)' }}>Hub</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1, maxWidth: '400px', minWidth: '240px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search action, cozy, strategy games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px', height: '40px', fontSize: '0.88rem' }}
          />
        </form>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* CATEGORIES DROPDOWN MENU */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setIsCategoryMenuOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isCategoryMenuOpen ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                border: isCategoryMenuOpen ? '1px solid var(--primary-green)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                color: isCategoryMenuOpen ? 'var(--primary-green)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => { if (!isCategoryMenuOpen) e.currentTarget.style.color = 'var(--primary-green)'; }}
              onMouseLeave={e => { if (!isCategoryMenuOpen) e.currentTarget.style.color = 'var(--text-main)'; }}
            >
              <Grid size={16} color="var(--primary-green)" />
              Categories
              <ChevronDown
                size={14}
                style={{
                  transform: isCategoryMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease'
                }}
              />
            </button>

            {/* Mega Dropdown Panel */}
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 14px)',
              left: '0',
              transform: isCategoryMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
              width: '520px',
              background: 'rgba(15, 12, 9, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 107, 0, 0.35)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-green-lg)',
              padding: '18px',
              pointerEvents: isCategoryMenuOpen ? 'auto' : 'none',
              opacity: isCategoryMenuOpen ? 1 : 0,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 1000,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary-green)', fontWeight: 800 }}>
                  Explore Game Genres
                </span>
                <Sparkles size={14} color="var(--accent-gold)" />
              </div>

              {/* Grid of category image cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '14px'
              }}>
                {navCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCategorySelect(cat.filter)}
                    style={{
                      position: 'relative',
                      height: '52px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'var(--primary-green)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to right, rgba(9,9,9,0.85) 30%, rgba(9,9,9,0.3) 100%)',
                      display: 'flex', alignItems: 'center', paddingLeft: '12px'
                    }}>
                      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '0.8rem', color: '#fff', textTransform: 'uppercase' }}>
                        {cat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular Tags Pills */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Popular Tags
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {popularTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCategorySelect(tag)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: 'rgba(255,107,0,0.08)',
                        border: '1px solid rgba(255,107,0,0.2)',
                        color: 'var(--text-muted)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.2)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary-green)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.2)'; }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Zap size={16} color="var(--primary-green)" /> Explore Catalog
          </Link>

          {(!user || user?.role === 'gamer') && (
            <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Heart size={16} color="var(--primary-magenta)" fill="var(--primary-magenta)" /> Wishlist
            </Link>
          )}

          {(user?.role === 'developer' || user?.role === 'admin') && (
            <Link to="/add-game" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <PlusCircle size={16} /> Add Game
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="btn-magenta" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          )}

          {/* Localization Country Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 255, 102, 0.04)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.25s ease'
          }}>
            <Globe size={14} color="var(--primary-green)" />
            <select
              value={activeCountry}
              onChange={(e) => setCountryPref(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="United States" style={{ background: 'var(--bg-dark)' }}>🇺🇸 US ($)</option>
              <option value="India" style={{ background: 'var(--bg-dark)' }}>🇮🇳 IN (₹)</option>
              <option value="United Kingdom" style={{ background: 'var(--bg-dark)' }}>🇬🇧 UK ($)</option>
            </select>
          </div>

          {/* DYNAMIC AUTH BUTTONS: LOGGED IN vs LOGGED OUT */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* User Profile Badge — click to edit profile */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 107, 0, 0.08)',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.background = 'rgba(255,107,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; }}
                title="Edit Profile"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF6B00&color=fff&size=100&bold=true&format=png`}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FF6B00' }}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF6B00&color=fff&size=100&bold=true&format=png`; }}
                />
                <div style={{ lineHeight: '1.2' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fff' }}>{user.name}</div>
                  <div style={{ fontSize: '0.62rem', color: '#FF6B00', textTransform: 'uppercase', fontWeight: 800 }}>
                    {user.role}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderColor: 'rgba(255, 0, 80, 0.4)',
                  color: '#f87171'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Join Hub
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
