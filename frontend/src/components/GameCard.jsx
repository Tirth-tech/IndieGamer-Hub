import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Tag, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { stripHtml } from '../utils/textUtils';

export default function GameCard({ game }) {
  const { user, toggleWishlist, formatPrice } = useAuth();
  const toast = useToast();
  const isWishlisted = user?.savedGames?.includes(game._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warning('Please log in to save games to your wishlist.', 'Login Required');
      return;
    }
    toggleWishlist(game._id);
  };

  return (
    <div className="glass-card" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Header Image Container */}
      <Link to={`/game/${game._id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', height: '180px' }}>
        <img
          src={game.headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'}
          alt={game.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Featured Badge */}
        {game.isFeatured && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
            <span className="badge-featured">
              ★ FEATURED
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(9, 10, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all 0.2s ease'
          }}
        >
          <Heart
            size={18}
            color={isWishlisted ? 'var(--primary-magenta)' : 'var(--text-muted)'}
            fill={isWishlisted ? 'var(--primary-magenta)' : 'none'}
          />
        </button>

        {/* Price Tag Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(9, 10, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          color: game.price === 0 ? 'var(--accent-green)' : 'var(--primary-cyan)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {game.price === 0 ? 'FREE TO PLAY' : formatPrice(game.price)}
        </div>
      </Link>

      {/* Card Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <Link to={`/game/${game._id}`} style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#fff',
              lineHeight: '1.3'
            }}>
              {game.title}
            </Link>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            By <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{game.developerName}</span>
          </div>

          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {stripHtml(game.shortDescription || game.description)}
          </p>
        </div>

        <div>
          {/* Genre Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {game.genre?.slice(0, 3).map((g, idx) => (
              <span key={idx} className="badge-genre">
                {g}
              </span>
            ))}
          </div>

          {/* Rating Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} className="star-filled" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ({game.reviewCount || 0})
              </span>
            </div>

            <Link to={`/game/${game._id}`} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
