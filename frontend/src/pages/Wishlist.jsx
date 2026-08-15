import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';

export default function Wishlist() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.savedGames) {
      fetchWishlistedGames();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistedGames = async () => {
    try {
      setLoading(true);
      // Fetch games with large limit to cover the catalog size
      const res = await axios.get('/api/games?limit=250');
      const allGames = res.data.games || [];
      
      // Filter games that are in the user's savedGames array
      const savedIds = user?.savedGames || [];
      const filtered = allGames.filter(game => savedIds.includes(game._id));
      setGames(filtered);
    } catch (err) {
      console.error('Error fetching wishlisted games:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderColor: 'var(--primary-magenta)', boxShadow: '0 0 20px rgba(255, 0, 127, 0.15)' }}>
          <Heart size={48} color="var(--primary-magenta)" style={{ marginBottom: '16px', display: 'inline-block' }} />
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.6rem', marginBottom: '12px' }}>
            Access Your Wishlist
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Please log in or create an account to start wishlisting your favorite indie and AAA titles!
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Login to Account
            </Link>
            <Link to="/register" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Join Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your wishlisted games...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px' }} className="reveal">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <Heart size={28} color="var(--primary-magenta)" fill="var(--primary-magenta)" className="pulse-glow" />
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
          My Wishlist
        </h1>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
        Track prices, reviews, and storefront updates for your saved games.
      </p>

      {games.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <Gamepad2 size={54} color="var(--text-dim)" style={{ marginBottom: '18px', display: 'inline-block' }} />
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Browse through our game categories, action titles, strategy gems, and cozy simulators to start build your collection!
          </p>
          <Link to="/catalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Explore PC Games <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {games.map((game, idx) => (
            <div key={game._id} className="card-slide-up" style={{ display: 'flex', flexDirection: 'column' }}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
