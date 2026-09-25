import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function FlipCard({
  frontContent = (<h3>Hover me</h3>),
  backContent = (<p>Back content revealed</p>),
  width = '240px',
  height = '300px',
  ariaLabel = 'Flip card',
  className = '',
  frontStyle = {},
  backStyle = {}
}) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  const flip = (deg) => {
    if (!innerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(innerRef.current, { rotationY: deg });
    } else {
      gsap.to(innerRef.current, { rotationY: deg, duration: 0.8, ease: 'back.out(1.4)' });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`flip-card ${className}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onMouseEnter={() => flip(180)}
      onMouseLeave={() => flip(0)}
      onFocus={() => flip(180)}
      onBlur={() => flip(0)}
      style={{
        width,
        height,
        perspective: '1000px',
        cursor: 'pointer',
        outline: 'none',
        display: 'inline-block'
      }}
    >
      <div
        ref={innerRef}
        className="flip-card-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className="flip-card-front"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '16px',
            padding: '1rem',
            textAlign: 'center',
            background: '#141414',
            color: '#fff',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            ...frontStyle
          }}
        >
          {frontContent}
        </div>
        <div
          className="flip-card-back"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '16px',
            padding: '1rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1f140e 0%, #0d0a08 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 107, 0, 0.6)',
            transform: 'rotateY(180deg)',
            boxShadow: '0 8px 24px rgba(255, 107, 0, 0.35)',
            ...backStyle
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
