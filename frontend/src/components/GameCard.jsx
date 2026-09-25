import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Play, Check, RotateCw } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { stripHtml } from '../utils/textUtils';

export default function GameCard({ game }) {
  const { user, toggleWishlist, formatPrice } = useAuth();
  const toast = useToast();
  const isWishlisted = user?.savedGames?.includes(game._id);

  const innerRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = (deg) => {
    if (!innerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(innerRef.current, { rotationY: deg });
    } else {
      gsap.to(innerRef.current, { rotationY: deg, duration: 0.8, ease: 'back.out(1.4)' });
    }
  };

  const handleMouseEnter = () => {
    setIsFlipped(true);
    flip(180);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
    flip(0);
  };

  const handleFocus = () => {
    setIsFlipped(true);
    flip(180);
  };

  const handleBlur = () => {
    setIsFlipped(false);
    flip(0);
  };

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
    <div
      className="flip-card"
      tabIndex={0}
      role="button"
      aria-label={`Flip card for ${game.title}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        width: '100%',
        height: '380px',
        perspective: '1000px',
        cursor: 'pointer',
        outline: 'none',
        position: 'relative',
        zIndex: isFlipped ? 50 : 1,
      }}
    >
      <div
        ref={innerRef}
        className="flip-card-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          borderRadius: '16px',
        }}
      >
        {/* ──────── FRONT FACE ──────── */}
        <div
          className="flip-card-front glass-card"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '16px',
            overflow: 'hidden',
            padding: 0,
            textAlign: 'left',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Header Image */}
          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
            <img
              src={game.headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'}
              alt={game.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {game.isFeatured && (
              <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
                <span className="badge-featured">★ FEATURED</span>
              </div>
            )}

            <button
              onClick={handleWishlistClick}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(9, 9, 9, 0.85)',
                backdropFilter: 'blur(8px)',
                border: isWishlisted ? '1px solid rgba(255, 107, 0, 0.6)' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 4,
              }}
            >
              <Heart
                size={16}
                color={isWishlisted ? '#FF6B00' : 'var(--text-muted)'}
                fill={isWishlisted ? '#FF6B00' : 'none'}
              />
            </button>

            {/* Price Tag Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(9, 9, 9, 0.90)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: game.price === 0 ? '#39FF88' : '#FFB000',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              zIndex: 3
            }}>
              {game.price === 0 ? 'FREE TO PLAY' : formatPrice(game.price)}
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: '#fff',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {game.title}
              </h3>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                By <span style={{ color: '#FFB000', fontWeight: 600 }}>{game.developerName || 'Indie Developer'}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {game.genre?.slice(0, 3).map((g, idx) => (
                  <span key={idx} className="badge-genre" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer info & Hover indicator */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} className="star-filled" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    ({game.reviewCount || 0})
                  </span>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  color: '#FF6B00',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <RotateCw size={12} /> Flip Card
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ──────── BACK FACE (Revealed on GSAP 3D Flip) ──────── */}
        <div
          className="flip-card-back glass-card"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            background: 'linear-gradient(135deg, rgba(26, 18, 12, 0.98) 0%, rgba(14, 10, 8, 0.98) 100%)',
            border: '1px solid rgba(255, 107, 0, 0.6)',
            boxShadow: '0 12px 35px rgba(255, 107, 0, 0.35)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge-featured" style={{ background: 'rgba(255, 107, 0, 0.15)', color: '#FF6B00', borderColor: 'rgba(255, 107, 0, 0.5)' }}>
                GAME OVERVIEW
              </span>
              <span style={{ fontSize: '0.75rem', color: '#FFB000', fontWeight: 700 }}>
                {game.price === 0 ? 'FREE' : formatPrice(game.price)}
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: '6px'
            }}>
              {game.title}
            </h3>

            <p style={{
              fontSize: '0.8rem',
              color: '#d1d5db',
              lineHeight: '1.45',
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {stripHtml(game.shortDescription || game.description)}
            </p>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 107, 0, 0.2)',
              marginBottom: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>RATING</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFB000' }}>
                  ★ {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>PLAYTIME</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#39FF88' }}>
                  ⏱ {game.hoursPlayed ? `${game.hoursPlayed} hrs` : '15+ hrs'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs on the Back */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to={`/game/${game._id}`}
              className="btn-primary"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '9px 14px',
                fontSize: '0.85rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #CC5200 100%)',
                borderColor: '#FFB000',
                boxShadow: '0 0 16px rgba(255, 107, 0, 0.45)'
              }}
            >
              <Play size={14} fill="#fff" /> View Game Page
            </Link>

            <button
              onClick={handleWishlistClick}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '8px 14px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                borderColor: isWishlisted ? '#FF6B00' : 'rgba(255,255,255,0.2)'
              }}
            >
              {isWishlisted ? (
                <>
                  <Check size={14} color="#FF6B00" /> Saved to Wishlist
                </>
              ) : (
                <>
                  <Heart size={14} /> Add to Wishlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
