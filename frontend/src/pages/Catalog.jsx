import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import GameCard from '../components/GameCard';
import { useAuth } from '../context/AuthContext';

export default function Catalog() {
  const { formatPrice } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');

  const genres = ['Action', 'Metroidvania', 'Roguelike', 'Platformer', 'Simulation', 'Cozy', 'Strategy', 'RPG', 'Sandbox', 'Card Game'];

  useEffect(() => {
    fetchCatalogGames();
  }, [searchTerm, selectedGenre, priceFilter, sortBy, page]);

  const fetchCatalogGames = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedGenre) params.set('genre', selectedGenre);
      if (priceFilter) params.set('price', priceFilter);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', page);
      params.set('limit', 12);

      const res = await axios.get(`/api/games?${params.toString()}`);
      setGames(res.data.games || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch catalog games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setPriceFilter('');
    setSortBy('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', color: '#fff', marginBottom: '6px' }}>
          Indie Game Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Discover hidden indie gems, filter by genre or price, and explore gamer ratings.
        </p>
      </div>

      {/* Filter & Search Bar Panel */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Filter by title or dev..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="input-field"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="input-field"
              style={{ height: '42px', cursor: 'pointer' }}
            >
              <option value="">All Genres</option>
              {genres.map((g, idx) => (
                <option key={idx} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Price Dropdown */}
          <div>
            <select
              value={priceFilter}
              onChange={(e) => { setPriceFilter(e.target.value); setPage(1); }}
              className="input-field"
              style={{ height: '42px', cursor: 'pointer' }}
            >
              <option value="">All Prices</option>
              <option value="free">Free to Play</option>
              <option value="under10">Under {formatPrice(10)}</option>
              <option value="under20">Under {formatPrice(20)}</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="input-field"
              style={{ height: '42px', cursor: 'pointer' }}
            >
              <option value="rating">Sort by: Highest Rated</option>
              <option value="trending">Sort by: Most Trending</option>
              <option value="newest">Sort by: Newest Releases</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="btn-secondary"
            style={{ height: '42px', justifyContent: 'center' }}
          >
            <RefreshCw size={16} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Searching catalog...</div>
      ) : games.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>No games found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Try broadening your search query or resetting filters.</p>
          <button onClick={handleResetFilters} className="btn-primary">Reset Filters</button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {games.map(game => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn-secondary"
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
