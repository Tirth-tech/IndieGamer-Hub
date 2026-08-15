import React from 'react';
import { Shield, Trophy, Cpu, Flame, CheckCircle, Sparkles, Star } from 'lucide-react';

export default function AAAComparison() {
  const games = [
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

  return (
    <div style={{ marginTop: '50px', marginBottom: '60px' }} className="reveal">
      
      {/* Section Header */}
      <div style={{ marginBottom: '24px' }}>
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

      {/* COMPARISON TABLE */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto', marginBottom: '30px', borderColor: 'var(--primary-green)' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="var(--accent-gold)" size={18} /> Quick Title Comparison
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--primary-green)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Game Title</th>
              <th style={{ padding: '12px 16px' }}>Genre</th>
              <th style={{ padding: '12px 16px' }}>Approx. Playtime</th>
              <th style={{ padding: '12px 16px' }}>Difficulty</th>
              <th style={{ padding: '12px 16px' }}>Best For</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 255, 102, 0.1)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={g.image} alt={g.title} style={{ width: '54px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                  {g.title}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge-genre">{g.genre}</span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary-green)' }}>
                  {g.playtime}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: g.difficulty === 'Hard' ? '#ef4444' : g.difficulty === 'Medium' ? 'var(--accent-gold)' : 'var(--primary-green)' }}>
                  {g.difficulty}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {g.bestFor}
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
            {games.map((g, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 255, 102, 0.04)',
                border: '1px solid rgba(0, 255, 102, 0.15)',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-green)', fontWeight: 900, display: 'block', marginBottom: '2px' }}>
                    {g.badge}
                  </span>
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
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu color="var(--primary-green)" size={20} /> Recommended Hardware Specs
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.5' }}>
            If your PC meets or exceeds the following specifications, you can enjoy 60+ FPS gameplay with ultra ray tracing textures:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle size={18} color="var(--primary-green)" />
              <span><strong>Graphics Card:</strong> NVIDIA RTX 3060 / 4060 or AMD RX 6700 XT</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle size={18} color="var(--primary-green)" />
              <span><strong>System Memory:</strong> 16 GB DDR4 / DDR5 RAM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle size={18} color="var(--primary-green)" />
              <span><strong>Processor:</strong> Modern 6-Core CPU (Intel i5 12th Gen / Ryzen 5600)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
              <CheckCircle size={18} color="var(--primary-green)" />
              <span><strong>Storage:</strong> High-speed NVMe SSD (100 GB Free Space)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 255, 102, 0.08)', padding: '12px', borderRadius: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ⚠️ <em>Note: Black Myth: Wukong utilizes Unreal Engine 5 Nanite & Lumen, making it the most demanding title of the group.</em>
          </div>
        </div>

      </div>
    </div>
  );
}
