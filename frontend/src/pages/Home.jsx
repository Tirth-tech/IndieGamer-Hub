import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Flame, Sparkles, Compass, X, ArrowRight, Zap, Shield, Tractor, Crosshair, Cpu } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import GameCard from '../components/GameCard';
import AAAComparison from '../components/AAAComparison';

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [actionGames, setActionGames] = useState([]);
  const [simulatorGames, setSimulatorGames] = useState([]);
  const [aaaGames, setAaaGames] = useState([]);
  const [rtxGames, setRtxGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Trailer Modal State
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featRes, allGamesRes] = await Promise.all([
        axios.get('/api/games/featured'),
        axios.get('/api/games?limit=500')
      ]);

      const all = allGamesRes.data.games || [];
      setAllGames(all);
      setFeaturedGames(featRes.data.games || all.slice(0, 5));

      // Categorize Games — case-insensitive genre matching
      const hasGenre = (game, genres) =>
        game.genre?.some(g => genres.some(target => g.toLowerCase().includes(target.toLowerCase())));

      setActionGames(all.filter(g => hasGenre(g, ['Action', 'FPS', 'Souls-like', 'Hack and Slash', 'Shooter', 'Fighting', 'Gore', 'Fast-Paced', 'Ninja', 'Difficult'])));
      setSimulatorGames(all.filter(g => hasGenre(g, ['Simulation', 'Simulator', 'Sim', 'Simulators', 'Agriculture', 'Management'])));
      setAaaGames(all.filter(g => hasGenre(g, ['AAA', 'Open World', 'Cyberpunk', 'Story Rich', 'Western'])));
      setRtxGames(all.filter(g => hasGenre(g, ['RTX High Performance', 'Mythology', 'High Performance', 'RTX'])));
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Action Games', icon: Crosshair, filter: 'Action' },
    { name: 'Simulator Games', icon: Cpu, filter: 'Simulation' },
    { name: 'AAA Masterpieces', icon: Shield, filter: 'AAA' },
    { name: 'RTX 3060+ Extreme', icon: Cpu, filter: 'RTX High Performance' },
    { name: 'Roguelike', icon: Zap, filter: 'Roguelike' },
    { name: 'Metroidvania', icon: Compass, filter: 'Metroidvania' }
  ];

  const handleCategoryClick = (e, categoryName) => {
    if (e) e.preventDefault();
    if (selectedCategory === categoryName && isCategoryOpen) {
      setIsCategoryOpen(false);
      setTimeout(() => {
        setSelectedCategory(null);
      }, 500);
    } else {
      setSelectedCategory(categoryName);
      setIsCategoryOpen(true);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Hero Spotlight Carousel */}
      {loading ? (
        <div style={{
          height: '420px',
          background: 'rgba(0, 255, 102, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-green)',
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.9rem'
        }}>
          INITIALIZING MATRIX CATALOG...
        </div>
      ) : (
        <HeroCarousel games={featuredGames} onWatchTrailer={(url) => setActiveTrailerUrl(url)} />
      )}


      {/* 🎮 1. ACTION GAMES (PC) SECTION */}
      <section style={{ marginBottom: '50px' }} className="reveal-left">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 className="section-title">
              <Crosshair color="var(--primary-green)" size={26} /> 1. Action Games (PC)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Fast-paced combat, intense FPS battles, samurai duels, and stylish combos.
            </p>
          </div>
          <a href="/catalog?genre=Action" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.9rem' }}>
            View All Action <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Action Games...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {actionGames.slice(0, 4).map((game, idx) => (
              <div key={game._id} className={`reveal delay-${(idx + 1) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🎮 2. SIMULATOR GAMES SECTION */}
      <section style={{ marginBottom: '50px' }} className="reveal-right">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 className="section-title">
              <Cpu color="var(--accent-lime)" size={26} /> 2. Simulator Games
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              High-fidelity simulations, vehicle control, survival logistics, and real-world mechanics.
            </p>
          </div>
          <a href="/catalog?genre=Simulation" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.9rem' }}>
            View All Simulators <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Simulator Games...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {simulatorGames.slice(0, 4).map((game, idx) => (
              <div key={game._id} className={`reveal delay-${(idx + 1) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🏆 3. AAA TITLES (PC) SECTION */}
      <section style={{ marginBottom: '50px' }} className="reveal-left">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 className="section-title">
              <Shield color="var(--accent-gold)" size={26} /> 3. AAA Blockbuster Titles
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Massive open worlds, award-winning story campaigns, and Game of the Year winners.
            </p>
          </div>
          <a href="/catalog?genre=AAA" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.9rem' }}>
            View All AAA <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading AAA Titles...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {aaaGames.slice(0, 4).map((game, idx) => (
              <div key={game._id} className={`reveal delay-${(idx + 1) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AAA COMPARISON TABLE & HARDWARE SPECIFICATIONS */}
      <AAAComparison />

      {/* 💡 HIGH-END RTX 3060+ HIGH PERFORMANCE BANNER */}
      <section style={{ marginBottom: '40px' }} className="reveal">
        <div className="glass-card" style={{
          padding: '30px',
          borderColor: 'var(--primary-green)',
          background: 'linear-gradient(135deg, rgba(5,46,22,0.9) 0%, rgba(13,19,14,0.95) 100%)',
          boxShadow: 'var(--shadow-green)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Cpu size={28} color="var(--primary-green)" className="pulse-glow" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: '#fff' }}>
                High-Performance GPU Recommendations (RTX 3060 or Better)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Test your rig with Unreal Engine 5, ray tracing, and ultra high-definition textures.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {rtxGames.slice(0, 4).map((game, idx) => (
              <div key={game._id} className={`reveal delay-${(idx + 1) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TRAILER LIGHTBOX MODAL */}
      {activeTrailerUrl && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 4, 2, 0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button
            onClick={() => setActiveTrailerUrl(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--primary-green)',
              cursor: 'pointer'
            }}
          >
            <X size={32} />
          </button>
          
          <div style={{ width: '90%', maxWidth: '900px', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary-green)', boxShadow: 'var(--shadow-green-lg)' }}>
            <ReactPlayer
              url={activeTrailerUrl}
              controls
              playing
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}
