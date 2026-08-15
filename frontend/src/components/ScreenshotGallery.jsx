import React, { useState } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ScreenshotGallery({ screenshots = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div style={{
        height: '300px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        No screenshots available for this title.
      </div>
    );
  }

  const currentScreenshot = screenshots[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % screenshots.length);
  };

  return (
    <div>
      {/* Main Display Box */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        marginBottom: '14px',
        background: '#000'
      }}>
        <img
          src={currentScreenshot}
          alt={`Screenshot ${activeIdx + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Gallery Controls */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          onClick={() => setIsLightboxOpen(true)}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(9, 10, 15, 0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <Maximize2 size={14} /> Fullscreen
        </button>
      </div>

      {/* Thumbnails Bar */}
      {screenshots.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {screenshots.map((s, idx) => (
            <img
              key={idx}
              src={s}
              alt={`Thumb ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              style={{
                width: '100px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: idx === activeIdx ? '2px solid var(--primary-cyan)' : '1px solid var(--border-color)',
                opacity: idx === activeIdx ? 1 : 0.6,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={32} />
          </button>

          <img
            src={currentScreenshot}
            alt="Fullscreen view"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </div>
      )}
    </div>
  );
}
