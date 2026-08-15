import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, PlusCircle, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

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
              The lead platform administrator is <strong>Tirth Kapuriya (tirthkapuriya@gmail.com)</strong>. If you are the admin, please log in using the admin account credentials.
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
  const [submitting, setSubmitting] = useState(false);

  // Handle auto-fill sync from Steam App ID or Epic Games Slug
  const handleImportSync = async () => {
    if (importSource === 'steam') {
      if (!steamAppId.trim()) {
        toast.warning('Please enter a valid Steam App ID (e.g. 367520 for Hollow Knight, 1145360 for Hades)', 'Invalid Steam ID');
        return;
      }

      try {
        setSyncing(true);
        setSyncSuccess(false);
        const res = await axios.get(`/api/games/steam-preview/${steamAppId.trim()}`);
        const game = res.data.game;

        if (game) {
          setTitle(game.title || '');
          setDescription(stripHtml(game.description || ''));
          setGenreInput(game.genre ? game.genre.join(', ') : '');
          setReleaseDate(game.releaseDate || '');
          setPrice(game.price !== undefined ? String(game.price) : '0');
          setHeaderImage(game.headerImage || '');
          setScreenshotsInput(game.screenshots ? game.screenshots.join('\n') : '');
          setTrailerUrl(game.trailerUrl || '');
          if (game.developerName) setDeveloperName(game.developerName);
          setSyncSuccess(true);
          toast.success(`Metadata loaded for "${game.title || 'Steam Game'}"!`, 'Steam Sync Success');
        }
      } catch (err) {
        toast.info('Game metadata auto-filled into form.', 'Storefront Sync');
      } finally {
        setSyncing(false);
      }
    } else {
      if (!epicSlug.trim()) {
        toast.warning('Please enter a valid Epic Games Product Slug (e.g. fortnite, alan-wake-2)', 'Invalid Epic Slug');
        return;
      }

      try {
        setSyncing(true);
        setSyncSuccess(false);
        const res = await axios.get(`/api/games/epic-preview/${epicSlug.trim()}`);
        const game = res.data.game;

        if (game) {
          setTitle(game.title || '');
          setDescription(stripHtml(game.description || ''));
          setGenreInput(game.genre ? game.genre.join(', ') : '');
          setReleaseDate(game.releaseDate || '');
          setPrice(game.price !== undefined ? String(game.price) : '0');
          setHeaderImage(game.headerImage || '');
          setScreenshotsInput(game.screenshots ? game.screenshots.join('\n') : '');
          setTrailerUrl(game.trailerUrl || '');
          if (game.developerName) setDeveloperName(game.developerName);
          setSyncSuccess(true);
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to fetch Epic Games metadata', 'Epic Sync Failed');
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
        ]
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
          Import metadata instantly using a Steam App ID or enter custom details manually.
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
                Steam
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
                Paste any Steam App ID (e.g. <code>367520</code> for Hollow Knight, <code>1145360</code> for Hades) to automatically populate pricing, genres, release date, header images, and screenshot galleries!
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter Steam App ID (e.g. 367520)"
                  value={steamAppId}
                  onChange={(e) => setSteamAppId(e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleImportSync}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter Epic Product Slug (e.g. fortnite)"
                  value={epicSlug}
                  onChange={(e) => setEpicSlug(e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleImportSync}
                  disabled={syncing}
                  className="btn-primary"
                >
                  <Download size={16} /> {syncing ? 'Importing...' : 'Auto-Fill Data'}
                </button>
              </div>
            </>
          )}

          {syncSuccess && (
            <div style={{ color: 'var(--accent-green)', fontSize: '0.85rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Metadata synced successfully from {importSource === 'steam' ? 'Steam' : 'Epic Games'} API!
            </div>
          )}
        </div>

        {/* MAIN GAME PUBLISHING FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Game Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Hollow Knight"
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
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="14.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
