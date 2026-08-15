import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ExternalLink, Play, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { stripHtml } from '../utils/textUtils';

export default function GameCard({ game }) {
  const { user, toggleWishlist, formatPrice } = useAuth();
  const toast = useToast();
  const isWishlisted = user?.savedGames?.includes(game._id);

  const [isHovered, setIsHovered] = useState(false);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const hoverTimeoutRef = useRef(null);

  const screenshots = game.screenshots && game.screenshots.length > 0
    ? game.screenshots
    : [game.headerImage];

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    setActiveMediaIdx(0);
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
      style={{
        position: 'relative',
        height: '100%',
        zIndex: isHovered ? 60 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base & Expanded Card Container */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          borderRadius: '12px',
          overflow: isHovered ? 'visible' : 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'scale(1.08) translateY(-8px)' : 'scale(1.0) translateY(0)',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: isHovered ? '1px solid rgba(255, 107, 0, 0.65)' : '1px solid var(--border-color)',
          background: isHovered ? 'rgba(18, 14, 11, 0.98)' : 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header Media Container */}
        <Link
          to={`/game/${game._id}`}
          style={{
            position: 'relative',
            display: 'block',
            overflow: 'hidden',
            height: isHovered ? '200px' : '170px',
            borderRadius: '12px 12px 0 0',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Main Media Image */}
          <img
            src={screenshots[activeMediaIdx] || game.headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'}
            alt={game.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease, filter 0.3s ease',
              transform: isHovered ? 'scale(1.04)' : 'scale(1.0)',
            }}
          />

          {/* Featured Badge */}
          {game.isFeatured && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
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
              background: 'rgba(9, 9, 9, 0.85)',
              backdropFilter: 'blur(8px)',
              border: isWishlisted ? '1px solid rgba(255, 107, 0, 0.6)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
              transition: 'all 0.2s ease',
              boxShadow: isWishlisted ? '0 0 12px rgba(255, 107, 0, 0.4)' : 'none'
            }}
          >
            <Heart
              size={18}
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
            fontSize: '0.85rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: game.price === 0 ? '#39FF88' : '#FFB000',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            zIndex: 3
          }}>
            {game.price === 0 ? 'FREE TO PLAY' : formatPrice(game.price)}
          </div>

          {/* Media Switcher Thumbnails on Hover (Microsoft Store style) */}
          {isHovered && screenshots.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                display: 'flex',
                gap: '4px',
                zIndex: 4,
                background: 'rgba(9, 9, 9, 0.75)',
                padding: '3px 6px',
                borderRadius: '6px',
                backdropFilter: 'blur(6px)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {screenshots.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveMediaIdx(idx)}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: activeMediaIdx === idx ? '#FF6B00' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeMediaIdx === idx ? 'scale(1.2)' : 'scale(1.0)'
                  }}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Card Main Info */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Link to={`/game/${game._id}`} style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: '#fff',
                lineHeight: '1.3'
              }}>
                {game.title}
              </Link>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              By <span style={{ color: '#FFB000', fontWeight: 600 }}>{game.developerName || 'Indie Developer'}</span>
            </div>

            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: '1.45',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: isHovered ? 4 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              {stripHtml(game.shortDescription || game.description)}
            </p>
          </div>

          <div>
            {/* Genre Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              {game.genre?.slice(0, isHovered ? 4 : 3).map((g, idx) => (
                <span key={idx} className="badge-genre" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
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
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={15} className="star-filled" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                  {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  ({game.reviewCount || 0})
                </span>
              </div>

              {!isHovered && (
                <span style={{ fontSize: '0.75rem', color: '#FF6B00', fontWeight: 600 }}>
                  Preview →
                </span>
              )}
            </div>
          </div>

          {/* Microsoft Store Flyout Extra Details (Expands when hovered) */}
          {isHovered && (
            <div
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px dashed rgba(255, 107, 0, 0.3)',
                animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <Link
                  to={`/game/${game._id}`}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    borderRadius: '6px'
                  }}
                >
                  <Play size={14} fill="#fff" /> View Game Page
                </Link>

                <button
                  onClick={handleWishlistClick}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    borderColor: isWishlisted ? '#FF6B00' : 'var(--border-color)'
                  }}
                >
                  {isWishlisted ? <Check size={14} color="#FF6B00" /> : <Heart size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
