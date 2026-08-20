import React, { useState, useEffect } from 'react';
import { Shield, Trophy, Cpu, Flame, CheckCircle, Sparkles, Star, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DEFAULT_GAMES = [
  {
    title: "Ghost of Tsushima Director's Cut",
    badge: "🥇 #1 RECOMMENDED",
    genre: "Open-world Action",
    playtime: "30–60 hours",
    difficulty: "Medium",
    bestFor: "Beautiful feudal Japan world, smooth samurai sword combat, and exploration.",
    steamAppId: "2215430",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg"
  },
  {
    title: "God of War Ragnarök",
    badge: "🥈 #2 HIGHLY RECOMMENDED",
    genre: "Action Adventure",
    playtime: "30–50 hours",
    difficulty: "Medium",
    bestFor: "One of the best cinematic action stories in gaming with visceral Norse combat.",
    steamAppId: "2322010",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg"
  },
  {
    title: "Black Myth: Wukong",
    badge: "🥉 #3 GRAPHICS SHOWCASE",
    genre: "Action RPG",
    playtime: "35–50 hours",
    difficulty: "Hard",
    bestFor: "Unreal Engine 5 visuals, challenging boss battles, and Soulslike-inspired combat.",
    steamAppId: "2358720",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg"
  },
  {
    title: "Marvel's Spider-Man 2",
    badge: "🏅 #4 FAST-PACED ACTION",
    genre: "Open-world Superhero",
    playtime: "20–35 hours",
    difficulty: "Easy to Medium",
    bestFor: "Fast-paced web traversal across Marvel's NY with Peter Parker & Miles Morales.",
    steamAppId: "1817070",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg"
  }
];

const DEFAULT_HARDWARE = [
  "Graphics Card: NVIDIA RTX 3060 / 4060 or AMD RX 6700 XT",
  "System Memory: 16 GB DDR4 / DDR5 RAM",
  "Processor: Modern 6-Core CPU (Intel i5 12th Gen / Ryzen 5600)",
  "Storage: High-speed NVMe SSD (100 GB Free Space)"
];

export default function AAAComparison() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [games, setGames] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local form states for editing
  const [editedGames, setEditedGames] = useState([]);
  const [editedHardware, setEditedHardware] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [gamesRes, hardwareRes] = await Promise.allSettled([
        axios.get('/api/content/aaa-comparison'),
        axios.get('/api/content/aaa-hardware')
      ]);

      if (gamesRes.status === 'fulfilled' && gamesRes.value.data?.data) {
        setGames(gamesRes.value.data.data);
      } else {
        setGames(DEFAULT_GAMES);
      }

      if (hardwareRes.status === 'fulfilled' && hardwareRes.value.data?.data) {
        setHardware(hardwareRes.value.data.data);
      } else {
        setHardware(DEFAULT_HARDWARE);
      }
    } catch (err) {
      console.error('Failed to fetch comparison content:', err);
      setGames(DEFAULT_GAMES);
      setHardware(DEFAULT_HARDWARE);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    setEditedGames(JSON.parse(JSON.stringify(games)));
    setEditedHardware([...hardware]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await Promise.all([
        axios.put('/api/content/aaa-comparison', { data: editedGames }),
        axios.put('/api/content/aaa-hardware', { data: editedHardware })
      ]);
      setGames(editedGames);
      setHardware(editedHardware);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save content updates. Make sure you are an authorized administrator.');
    } finally {
      setSaving(false);
    }
  };

  const handleGameChange = (index, field, value) => {
    const next = [...editedGames];
    next[index][field] = value;
    setEditedGames(next);
  };

  const handleHardwareChange = (index, value) => {
    const next = [...editedHardware];
    next[index] = value;
    setEditedHardware(next);
  };

  const handleAddGame = () => {
    setEditedGames([
      ...editedGames,
      {
        title: "New AAA Action Game",
        badge: "🥇 #NEW",
        genre: "Action",
        playtime: "20–40 hours",
        difficulty: "Medium",
        bestFor: "Description of best features.",
        steamAppId: "",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
      }
    ]);
  };

  const handleRemoveGame = (index) => {
    setEditedGames(editedGames.filter((_, i) => i !== index));
  };

  const handleAddHardware = () => {
    setEditedHardware([...editedHardware, "New Spec Requirement"]);
  };

  const handleRemoveHardware = (index) => {
    setEditedHardware(editedHardware.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading high performance guides...
      </div>
    );
  }

  const inputStyle = {
    background: 'rgba(9,9,9,0.9)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    color: '#fff',
    padding: '6px 10px',
    fontSize: '0.85rem',
    width: '100%',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ marginTop: '50px', marginBottom: '60px' }} className="reveal">
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Trophy color="var(--primary-green)" size={26} className="pulse-glow" />
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: '#fff', fontWeight: 900 }}>
              AAA Action Games Comparison & GPU Guide
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Compare playtimes, combat difficulty, and hardware specs to choose your next high-performance adventure.
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div>
            {!isEditing ? (
              <button onClick={handleStartEdit} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}>
                <Edit size={16} /> Edit Guide Sections
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSaveEdit} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleCancelEdit} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', color: '#ff4444' }}>
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPARISON TABLE */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto', marginBottom: '30px', borderColor: 'var(--primary-green)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Sparkles color="var(--accent-gold)" size={18} /> Quick Title Comparison
          </h3>
          {isEditing && (
            <button onClick={handleAddGame} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add Game Card
            </button>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--primary-green)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              {isEditing && <th style={{ padding: '12px 16px', width: '60px' }}>Action</th>}
              <th style={{ padding: '12px 16px' }}>Game Title</th>
              <th style={{ padding: '12px 16px' }}>Genre</th>
              <th style={{ padding: '12px 16px' }}>Approx. Playtime</th>
              <th style={{ padding: '12px 16px' }}>Difficulty</th>
              <th style={{ padding: '12px 16px' }}>Best For</th>
            </tr>
          </thead>
          <tbody>
            {(isEditing ? editedGames : games).map((g, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 255, 102, 0.1)', transition: 'background 0.2s ease' }}>
                {isEditing && (
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => handleRemoveGame(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fff' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input style={inputStyle} value={g.title} onChange={(e) => handleGameChange(idx, 'title', e.target.value)} placeholder="Title" />
                      <input style={inputStyle} value={g.image} onChange={(e) => handleGameChange(idx, 'image', e.target.value)} placeholder="Image URL" />
                      <input style={inputStyle} value={g.steamAppId} onChange={(e) => handleGameChange(idx, 'steamAppId', e.target.value)} placeholder="Steam App ID" />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={g.image} alt={g.title} style={{ width: '54px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                      {g.title}
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {isEditing ? (
                    <input style={inputStyle} value={g.genre} onChange={(e) => handleGameChange(idx, 'genre', e.target.value)} placeholder="Genre" />
                  ) : (
                    <span className="badge-genre">{g.genre}</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary-green)' }}>
                  {isEditing ? (
                    <input style={inputStyle} value={g.playtime} onChange={(e) => handleGameChange(idx, 'playtime', e.target.value)} placeholder="Playtime" />
                  ) : (
                    g.playtime
                  )}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                  {isEditing ? (
                    <select style={inputStyle} value={g.difficulty} onChange={(e) => handleGameChange(idx, 'difficulty', e.target.value)}>
                      <option value="Easy">Easy</option>
                      <option value="Easy to Medium">Easy to Medium</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  ) : (
                    <span style={{ color: g.difficulty === 'Hard' ? '#ef4444' : g.difficulty === 'Medium' ? 'var(--accent-gold)' : 'var(--primary-green)' }}>
                      {g.difficulty}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {isEditing ? (
                    <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={g.bestFor} onChange={(e) => handleGameChange(idx, 'bestFor', e.target.value)} placeholder="Best for details" />
                  ) : (
                    g.bestFor
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PLAY ORDER & HARDWARE RIG GUIDE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Recommended Play Order */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy color="var(--primary-green)" size={20} /> Recommended Playing Order
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(isEditing ? editedGames : games).map((g, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 255, 102, 0.04)',
                border: '1px solid rgba(0, 255, 102, 0.15)',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  {isEditing ? (
                    <input style={inputStyle} value={g.badge} onChange={(e) => handleGameChange(idx, 'badge', e.target.value)} placeholder="Badge Rank (e.g. #1 Rank)" />
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-green)', fontWeight: 900, display: 'block', marginBottom: '2px' }}>
                      {g.badge}
                    </span>
                  )}
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{g.title}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                  {g.playtime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Rig Requirements */}
        <div className="glass-card" style={{ padding: '24px', borderColor: 'var(--primary-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Cpu color="var(--primary-green)" size={20} /> Recommended Hardware Specs
            </h3>
            {isEditing && (
              <button onClick={handleAddHardware} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.74rem' }}>
                + Add Spec
              </button>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
            If your PC meets or exceeds the following specifications, you can enjoy 60+ FPS gameplay with ultra ray tracing textures:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            {(isEditing ? editedHardware : hardware).map((spec, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                <CheckCircle size={18} color="var(--primary-green)" style={{ flexShrink: 0 }} />
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <input style={inputStyle} value={spec} onChange={(e) => handleHardwareChange(idx, e.target.value)} />
                    <button onClick={() => handleRemoveHardware(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <span>{spec}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(0, 255, 102, 0.08)', padding: '12px', borderRadius: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ⚠️ <em>Note: Black Myth: Wukong utilizes Unreal Engine 5 Nanite & Lumen, making it the most demanding title of the group.</em>
          </div>
        </div>

      </div>
    </div>
  );
}
