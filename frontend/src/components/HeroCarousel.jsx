import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ShoppingCart, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { stripHtml } from '../utils/textUtils';

export default function HeroCarousel({ games, onWatchTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { formatPrice } = useAuth();

  useEffect(() => {
    if (!games || games.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [games]);

  if (!games || games.length === 0) return null;

  const currentGame = games[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '460px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      marginBottom: '40px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
    }}>
      {/* Background Image with Dark Vignette Gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${currentGame.headerImage || currentGame.screenshots?.[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.55) contrast(1.1)',
        transition: 'background-image 0.6s ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(9,10,15,0.95) 0%, rgba(9,10,15,0.7) 50%, transparent 100%)'
      }} />

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        maxWidth: '650px',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge-featured">
            ★ SPOTLIGHT INDIE
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
            {currentGame.developerName}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '2.4rem',
          fontWeight: 900,
          color: '#fff',
          lineHeight: '1.1',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)'
        }}>
          {currentGame.title}
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {stripHtml(currentGame.shortDescription || currentGame.description)}
        </p>

        {/* Rating and Genre bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={18} className="star-filled" />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              {currentGame.averageRating > 0 ? currentGame.averageRating.toFixed(1) : 'New'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              ({currentGame.reviewCount} reviews)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {currentGame.genre?.slice(0, 3).map((g, idx) => (
              <span key={idx} className="badge-genre">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <Link to={`/game/${currentGame._id}`} className="btn-primary">
            Explore Game Page
          </Link>

          {currentGame.trailerUrl && (
            <button
              onClick={() => onWatchTrailer(currentGame.trailerUrl)}
              className="btn-magenta"
            >
              <Play size={16} fill="#fff" /> Watch Trailer
            </button>
          )}

          <div style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: 'var(--primary-cyan)',
            marginLeft: 'auto'
          }}>
            {currentGame.price === 0 ? 'FREE' : formatPrice(currentGame.price)}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(9, 10, 15, 0.7)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(9, 10, 15, 0.7)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination Indicators */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '24px',
        display: 'flex',
        gap: '8px',
        zIndex: 20
      }}>
        {games.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === currentIndex ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
