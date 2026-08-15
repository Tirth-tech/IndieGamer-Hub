import React from 'react';
import { Gamepad2, Heart, Code, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(9, 10, 15, 0.95)',
      marginTop: '60px',
      padding: '40px 24px 24px 24px'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Gamepad2 size={20} color="var(--primary-cyan)" />
            <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.85rem', color: '#fff' }}>
              INDIEGAMER<span style={{ color: 'var(--primary-cyan)' }}>HUB</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            A dedicated discovery engine and social space connecting passionate indie developers with gamers seeking unique experiences.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '12px' }}>Discovery</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '2' }}>
            <li><a href="/catalog?sort=trending">Trending Games</a></li>
            <li><a href="/catalog?sort=rating">Top Rated Indies</a></li>
            <li><a href="/catalog?genre=Roguelike">Roguelike & Strategy</a></li>
            <li><a href="/catalog?genre=Metroidvania">Metroidvania & Action</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '12px' }}>Developers</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '2' }}>
            <li><a href="/add-game">Publish Your Game</a></li>
            <li><a href="/add-game">Steam App ID Sync</a></li>
            <li><a href="/admin">Featured Visibility Spots</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '12px' }}>Affiliate & Legal</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            "Buy Now" links redirect to official storefronts (Steam / Itch.io) with affiliate tracking parameters to support independent game creators.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>&copy; 2026 IndieGamer Hub. Built for Indie Developers & Gamers.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Made with <Heart size={14} color="var(--primary-magenta)" fill="var(--primary-magenta)" /> by Full Stack Developers
        </div>
      </div>
    </footer>
  );
}
