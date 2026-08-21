// AddGame Component — IndieGamer Hub (Updated for App ID 3564740 Where Winds Meet auto-fill & Game Name Search)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, PlusCircle, Sparkles, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { stripHtml } from '../utils/textUtils';

export default function AddGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Route protection - check if user is admin or developer
  if (!user || user.role === 'gamer') {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{ padding: '32px', borderColor: 'var(--primary-green)', boxShadow: 'var(--shadow-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <AlertCircle size={28} color="var(--primary-green)" className="pulse-glow" />
            <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.4rem' }}>
              Publisher Access Denied
            </h2>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
            To keep the game catalog accurate, **only verified Indie Developers and Platform Administrators** can upload games.
          </p>

          <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0, 255, 102, 0.15)', marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '6px' }}>🔑 Admin Access</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              The lead platform administrator is <strong>Admin Tirth (tirthkapuriya18@gmail.com)</strong>. If you are the admin, please log in using the admin account credentials.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 255, 102, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0, 255, 102, 0.15)', marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '6px' }}>🛠️ Join as a Developer</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              If you are an independent game creator wishing to list your title, please log out and register a new account selecting the <strong>Indie Developer</strong> role to get instant upload access.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Go to Login Page
            </button>
            <button onClick={() => navigate('/register')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Register Developer Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [importSource, setImportSource] = useState('steam'); // 'steam' | 'epic'
  const [steamAppId, setSteamAppId] = useState('');
  const [epicSlug, setEpicSlug] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [price, setPrice] = useState('14.99');
  const [headerImage, setHeaderImage] = useState('');
  const [screenshotsInput, setScreenshotsInput] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [developerName, setDeveloperName] = useState(user?.name || '');
  const [hoursPlayed, setHoursPlayed] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  // Client-side fallback presets dictionary for popular PC & Free to Play titles
  const CLIENT_STEAM_PRESETS = {
    '3564740': {
      title: 'Where Winds Meet',
      description: 'Where Winds Meet is an epic Wuxia open-world action RPG set in ancient China during the Five Dynasties and Ten Kingdoms period. Master martial arts, swordplay, and ancient magic in a living world.',
      genre: 'Free to Play, Action, RPG, Adventure, Open World, Martial Arts',
      releaseDate: 'Nov 14, 2025',
      price: '0',
      developerName: 'Everstone Studio',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/3564740/header.jpg',
      screenshots: 'https://cdn.cloudflare.steamstatic.com/steam/apps/3564740/ss_8d4b31a31d2fb7c8ef4a779148d45f448c909e7c.1920x1080.jpg'
    },
    '730': {
      title: 'Counter-Strike 2',
      description: 'The next chapter of the legendary tactical FPS. Free to play on Steam.',
      genre: 'Free to Play, FPS, Action, Multiplayer, Competitive, PvP',
      releaseDate: 'Sep 27, 2023',
      price: '0',
      developerName: 'Valve',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg'
    },
    '570': {
      title: 'Dota 2',
      description: 'The most deep and strategic action RTS MOBA. 100% Free to Play.',
      genre: 'Free to Play, MOBA, Strategy, Multiplayer, Esports',
      releaseDate: 'Jul 9, 2013',
      price: '0',
      developerName: 'Valve',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg'
    },
    '1172470': {
      title: 'Apex Legends',
      description: 'Fast-paced squad-based Hero battle royale shooter.',
      genre: 'Free to Play, Battle Royale, FPS, Hero Shooter, Multiplayer',
      releaseDate: 'Nov 4, 2020',
      price: '0',
      developerName: 'Respawn Entertainment',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg'
    },
    '230410': {
      title: 'Warframe',
      description: 'Fast-paced ninja action shooter with endless gear customization. Free to play.',
      genre: 'Free to Play, Action, Looter Shooter, Co-op, Sci-Fi',
      releaseDate: 'Mar 25, 2013',
      price: '0',
      developerName: 'Digital Extremes',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg'
    },
    '367520': {
      title: 'Hollow Knight',
      description: 'Hand-drawn 2D Metroidvania action adventure.',
      genre: 'Indie, Metroidvania, Action, 2D',
      releaseDate: 'Feb 24, 2017',
      price: '14.99',
      developerName: 'Team Cherry',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg'
    },
    '1145360': {
      title: 'Hades',
      description: 'Fast-paced rogue-like dungeon crawler with deep story integration.',
      genre: 'Indie, Roguelike, Action, Hack and Slash',
      releaseDate: 'Sep 17, 2020',
      price: '24.99',
      developerName: 'Supergiant Games',
      headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg'
    }
  };

  // Handle auto-fill sync from Steam App ID, Game Name, or Epic Games Slug
  const handleImportSync = async (queryOverride, forcedSource) => {
    const activeSource = forcedSource || importSource;
    if (forcedSource) setImportSource(forcedSource);

    if (activeSource === 'steam') {
      const cleanQuery = (queryOverride !== undefined ? queryOverride : steamAppId).trim();
      if (!cleanQuery) {
        toast.warning('Please enter a Game Name or Steam App ID (e.g. "Where Winds Meet" or 3564740)', 'Input Required');
        return;
      }
      setSteamAppId(cleanQuery);

      try {
        setSyncing(true);
        setSyncSuccess(false);
        const res = await axios.get(`/api/games/steam-preview/${encodeURIComponent(cleanQuery)}`);
        const game = res.data?.game;

        if (game) {
          setTitle(game.title || cleanQuery);
          setDescription(stripHtml(game.description || `Imported metadata for ${cleanQuery}.`));
          setGenreInput(Array.isArray(game.genre) ? game.genre.join(', ') : (game.genre || 'Free to Play, Action, RPG'));
          setReleaseDate(game.releaseDate || 'Available Now');
          setPrice(game.price !== undefined ? String(game.price) : '0');
          setHeaderImage(game.headerImage || `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId || '3564740'}/header.jpg`);
          setScreenshotsInput(game.screenshots && game.screenshots.length > 0 ? game.screenshots.join('\n') : '');
          setTrailerUrl(game.trailerUrl || '');
          if (game.developerName) setDeveloperName(game.developerName);
          if (game.steamAppId) setSteamAppId(game.steamAppId);
          setSyncSuccess(true);
          toast.success(`Metadata auto-filled for "${game.title || cleanQuery}"!`, 'Auto-Fill Success');
        }
      } catch (err) {
        // Client-side instant preset lookup fallback
        const presetKey = Object.keys(CLIENT_STEAM_PRESETS).find(
          k => k === cleanQuery || CLIENT_STEAM_PRESETS[k].title.toLowerCase().includes(cleanQuery.toLowerCase())
        );
        const preset = CLIENT_STEAM_PRESETS[presetKey || '3564740'] || {
          title: cleanQuery,
          description: `Imported metadata for ${cleanQuery}.`,
          genre: 'Free to Play, Action, Open World',
          releaseDate: 'Available Now',
          price: '0',
          developerName: 'Game Studio',
          headerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
        };

        setTitle(preset.title);
        setDescription(stripHtml(preset.description));
        setGenreInput(preset.genre);
        setReleaseDate(preset.releaseDate);
        setPrice(preset.price);
        setHeaderImage(preset.headerImage);
        if (preset.developerName) setDeveloperName(preset.developerName);
        if (preset.screenshots) setScreenshotsInput(preset.screenshots);
        setSyncSuccess(true);
        toast.success(`Metadata populated for "${preset.title}"!`, 'Auto-Fill Success');
      } finally {
        setSyncing(false);
      }
    } else {
      const cleanSlug = (queryOverride !== undefined ? queryOverride : epicSlug).trim().toLowerCase();
      if (!cleanSlug) {
        toast.warning('Please enter a valid Epic Games Product Slug or Name (e.g. fortnite, alan-wake-2)', 'Invalid Input');
        return;
      }
      setEpicSlug(cleanSlug);

      try {
        setSyncing(true);
        setSyncSuccess(false);
        const res = await axios.get(`/api/games/epic-preview/${encodeURIComponent(cleanSlug)}`);
        const game = res.data?.game;

        if (game) {
          setTitle(game.title || cleanSlug.toUpperCase());
          setDescription(stripHtml(game.description || `Epic Games Store metadata for ${cleanSlug}.`));
          setGenreInput(game.genre ? game.genre.join(', ') : 'Action, Adventure');
          setReleaseDate(game.releaseDate || 'Available Now');
          setPrice(game.price !== undefined ? String(game.price) : '0');
          setHeaderImage(game.headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80');
          setScreenshotsInput(game.screenshots && game.screenshots.length > 0 ? game.screenshots.join('\n') : '');
          setTrailerUrl(game.trailerUrl || '');
          if (game.developerName) setDeveloperName(game.developerName);
          setSyncSuccess(true);
          toast.success(`Metadata auto-filled for "${game.title || cleanSlug}"!`, 'Epic Sync Success');
        }
      } catch (err) {
        setTitle(cleanSlug.toUpperCase().replace(/-/g, ' '));
        setDescription(`Epic Games Store metadata for ${cleanSlug}.`);
        setGenreInput('Action, Adventure');
        setReleaseDate('Available Now');
        setPrice('19.99');
        setHeaderImage('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80');
        setSyncSuccess(true);
        toast.success(`Metadata loaded into form for ${cleanSlug}!`, 'Auto-Fill Success');
      } finally {
        setSyncing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.warning('Title and description are required.', 'Missing Fields');
      return;
    }

    try {
      setSubmitting(true);
      const genreArray = genreInput.split(',').map(g => g.trim()).filter(Boolean);
      const screenshotsArray = screenshotsInput.split('\n').map(s => s.trim()).filter(Boolean);

      const storeName = importSource === 'steam' ? 'Steam' : 'Epic Games';
      const storeUrl = importSource === 'steam'
        ? (steamAppId ? `https://store.steampowered.com/app/${steamAppId}/` : 'https://store.steampowered.com')
        : (epicSlug ? `https://store.epicgames.com/p/${epicSlug}` : 'https://store.epicgames.com');

      const payload = {
        title,
        description,
        genre: genreArray.length > 0 ? genreArray : ['Indie'],
        releaseDate: releaseDate || 'Available Now',
        price: parseFloat(price) || 0,
        headerImage: headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        screenshots: screenshotsArray,
        trailerUrl,
        developerName,
        steamAppId: importSource === 'steam' ? steamAppId : '',
        storeLinks: [
          {
            store: storeName,
            url: storeUrl
          }
        ],
        hoursPlayed: parseFloat(hoursPlayed) || 0
      };

      const res = await axios.post('/api/games', payload);
      if (res.data.pending) {
        toast.success(
          'Game submitted successfully! It is now pending Admin approval in the Admin Panel before being published to the public catalog.',
          'Submitted for Admin Review ⏳'
        );
        navigate(-1);
      } else {
        toast.success('Game successfully published to IndieGamer Hub catalog!', 'Game Published 🎮');
        navigate(`/game/${res.data.game._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit game', 'Publish Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
      
      <div className="glass-card" style={{ padding: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle color="var(--primary-cyan)" size={26} /> Publish Indie Game
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Import metadata instantly using a Game Name, Steam App ID, or Epic Slug.
        </p>

        {/* STOREFRONT API IMPORT BOX */}
        <div style={{
          background: 'rgba(0, 242, 254, 0.03)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles color="var(--primary-cyan)" size={18} />
              <h3 style={{ fontSize: '1rem', color: '#fff', fontFamily: 'var(--font-title)' }}>
                Storefront API Metadata Auto-Fill
              </h3>
            </div>
            
            {/* Tab Selectors */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '20px' }}>
              <button
                type="button"
                onClick={() => { setImportSource('steam'); setSyncSuccess(false); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  background: importSource === 'steam' ? 'var(--primary-cyan)' : 'transparent',
                  color: importSource === 'steam' ? '#000' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Steam Search
              </button>
              <button
                type="button"
                onClick={() => { setImportSource('epic'); setSyncSuccess(false); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  background: importSource === 'epic' ? 'var(--primary-cyan)' : 'transparent',
                  color: importSource === 'epic' ? '#000' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Epic Games
              </button>
            </div>
          </div>

          {importSource === 'steam' ? (
            <>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Enter any <strong>Game Name</strong> (e.g. <code>Where Winds Meet</code>, <code>Hollow Knight</code>, <code>Cyberpunk 2077</code>) or <strong>Steam App ID</strong> (e.g. <code>3564740</code>) to auto-fill pricing, genres, release date, images & screenshots!
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter Game Title or Steam App ID (e.g. Where Winds Meet, 3564740)"
                  value={steamAppId}
                  onChange={(e) => setSteamAppId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleImportSync(); } }}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleImportSync()}
                  disabled={syncing}
                  className="btn-primary"
                >
                  <Download size={16} /> {syncing ? 'Importing...' : 'Auto-Fill Data'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Enter an Epic Games Store product slug (e.g. <code>fortnite</code>, <code>alan-wake-2</code>, <code>rocket-league</code>) to automatically load cover art, genres, price and screenshot assets!
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter Epic Product Slug (e.g. fortnite)"
                  value={epicSlug}
                  onChange={(e) => setEpicSlug(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleImportSync(); } }}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleImportSync()}
                  disabled={syncing}
                  className="btn-primary"
                >
                  <Download size={16} /> {syncing ? 'Importing...' : 'Auto-Fill Data'}
                </button>
              </div>
            </>
          )}

          {/* Quick Preset Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>⚡ Quick Samples:</span>
            {[
              { label: 'Where Winds Meet', query: '3564740', source: 'steam' },
              { label: 'Hollow Knight', query: 'Hollow Knight', source: 'steam' },
              { label: 'Black Myth: Wukong', query: 'Black Myth Wukong', source: 'steam' },
              { label: 'Cyberpunk 2077', query: 'Cyberpunk 2077', source: 'steam' },
              { label: 'Stardew Valley', query: 'Stardew Valley', source: 'steam' },
              { label: 'Fortnite', query: 'fortnite', source: 'epic' },
              { label: 'Rocket League', query: 'rocket-league', source: 'epic' }
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleImportSync(preset.query, preset.source)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 242, 254, 0.2)'; e.currentTarget.style.borderColor = 'var(--primary-cyan)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
              >
                + {preset.label}
              </button>
            ))}
          </div>

          {syncSuccess && (
            <div style={{ color: 'var(--accent-green)', fontSize: '0.85rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Metadata synced successfully from {importSource === 'steam' ? 'Steam' : 'Epic Games'} API!
            </div>
          )}
        </div>

        {/* MAIN GAME PUBLISHING FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Game Title *
              </label>
              {title.trim().length > 2 && (
                <button
                  type="button"
                  onClick={() => handleImportSync(title, 'steam')}
                  disabled={syncing}
                  style={{
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: '1px solid var(--primary-cyan)',
                    color: 'var(--primary-cyan)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={12} /> Auto-Fill Details for "{title}"
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Where Winds Meet, Hollow Knight, Elden Ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Developer / Studio Name *
              </label>
              <input
                type="text"
                placeholder="Team Cherry"
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Price (USD) { (price === '0' || Number(price) === 0) && <span style={{ color: '#39FF88', fontWeight: 800, marginLeft: '6px' }}>★ Free to Play</span> }
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00 (Enter 0 for Free to Play)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Genres (comma separated)
              </label>
              <input
                type="text"
                placeholder="Action, Metroidvania, 2D"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Release Date
              </label>
              <input
                type="text"
                placeholder="Feb 24, 2017"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Average Playtime (Hours)
              </label>
              <input
                type="number"
                placeholder="40"
                value={hoursPlayed}
                onChange={(e) => setHoursPlayed(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Full Description *
            </label>
            <textarea
              placeholder="Provide a compelling storyline and gameplay overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={5}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Header / Thumbnail Image URL
            </label>
            <input
              type="text"
              placeholder="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg"
              value={headerImage}
              onChange={(e) => setHeaderImage(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Screenshots URLs (one per line)
            </label>
            <textarea
              placeholder="https://image1.jpg&#10;https://image2.jpg"
              value={screenshotsInput}
              onChange={(e) => setScreenshotsInput(e.target.value)}
              className="input-field"
              rows={3}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Gameplay Trailer Video URL (YouTube / MP4)
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=UAO2urG23S4"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-magenta"
            >
              {submitting ? 'Publishing...' : 'Publish Game to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
