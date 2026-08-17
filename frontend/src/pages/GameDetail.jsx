import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Star, Heart, ExternalLink, Play, MessageSquare, ShoppingCart, User, Calendar, ShieldCheck, Tag, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ScreenshotGallery from '../components/ScreenshotGallery';
import ForumSection from '../components/ForumSection';
import { useToast } from '../components/Toast';
import { stripHtml, getAvatar } from '../utils/textUtils';

export default function GameDetail() {
  const { id } = useParams();
  const { user, toggleWishlist, formatPrice } = useAuth();
  const toast = useToast();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'forum'

  // Review Form State
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Edit Game Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDeveloperName, setEditDeveloperName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editGenreInput, setEditGenreInput] = useState('');
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHeaderImage, setEditHeaderImage] = useState('');
  const [editScreenshotsInput, setEditScreenshotsInput] = useState('');
  const [editTrailerUrl, setEditTrailerUrl] = useState('');
  const [editSteamAppId, setEditSteamAppId] = useState('');
  const [editEpicSlug, setEditEpicSlug] = useState('');

  const handleOpenEdit = () => {
    setEditTitle(game.title || '');
    setEditDeveloperName(game.developerName || '');
    setEditPrice(game.price !== undefined ? String(game.price) : '0');
    setEditGenreInput(game.genre ? game.genre.join(', ') : '');
    setEditReleaseDate(game.releaseDate || '');
    setEditDescription(game.description || '');
    setEditHeaderImage(game.headerImage || '');
    setEditScreenshotsInput(game.screenshots ? game.screenshots.join('\n') : '');
    setEditTrailerUrl(game.trailerUrl || '');
    setEditSteamAppId(game.steamAppId || '');

    const epicLink = game.storeLinks?.find(l => l.store === 'Epic Games');
    if (epicLink) {
      const parts = epicLink.url.split('/p/');
      setEditEpicSlug(parts[parts.length - 1] || '');
    } else {
      setEditEpicSlug('');
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const genreArray = editGenreInput.split(',').map(g => g.trim()).filter(Boolean);
      const screenshotsArray = editScreenshotsInput.split('\n').map(s => s.trim()).filter(Boolean);

      const storeLinksArray = [];
      if (editSteamAppId.trim()) {
        storeLinksArray.push({
          store: 'Steam',
          url: `https://store.steampowered.com/app/${editSteamAppId.trim()}/`
        });
      }
      if (editEpicSlug.trim()) {
        storeLinksArray.push({
          store: 'Epic Games',
          url: `https://store.epicgames.com/p/${editEpicSlug.trim()}`
        });
      }
      if (storeLinksArray.length === 0 && game.storeLinks?.length > 0) {
        storeLinksArray.push(game.storeLinks[0]);
      }

      const payload = {
        title: editTitle,
        developerName: editDeveloperName,
        price: parseFloat(editPrice) || 0,
        genre: genreArray,
        releaseDate: editReleaseDate,
        description: editDescription,
        headerImage: editHeaderImage,
        screenshots: screenshotsArray,
        trailerUrl: editTrailerUrl,
        steamAppId: editSteamAppId.trim(),
        storeLinks: storeLinksArray
      };

      const res = await axios.put(`/api/games/${game._id}`, payload);
      toast.success('Game details updated successfully!', 'Update Saved ✅');
      setGame(res.data.game);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update game details', 'Update Failed');
    }
  };

  useEffect(() => {
    fetchGameDetails();
    fetchReviews();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/games/${id}`);
      setGame(res.data.game);
    } catch (err) {
      console.error('Failed to fetch game details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/game/${id}`);
      setReviews(res.data.reviews);
      setRatingBreakdown(res.data.ratingBreakdown || {});
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleBuyNowClick = async (storeName) => {
    try {
      const res = await axios.get(`/api/affiliate/redirect?gameId=${game._id}&store=${storeName}`);
      if (res.data?.affiliateUrl) {
        window.open(res.data.affiliateUrl, '_blank');
      }
    } catch (err) {
      console.error('Affiliate redirect error:', err);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please log in to post a review.', 'Login Required');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await axios.post(`/api/reviews/game/${id}`, {
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent
      });

      toast.success('Review published! Rating updated via MongoDB aggregation.', 'Review Posted ⭐');
      setIsPostingReview(false);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      
      // Update local cached game state and reviews
      setGame(prev => ({
        ...prev,
        averageRating: res.data.averageRating,
        reviewCount: res.data.reviewCount
      }));
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post review', 'Review Failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading game universe...</div>;
  }

  if (!game) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }} className="glass-card">
        <h2 style={{ color: '#fff', marginBottom: '10px' }}>Game Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>The game you are looking for does not exist or has been removed.</p>
        <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  const isWishlisted = user?.savedGames?.includes(game._id);
  const canEdit = user && (user.role === 'admin' || (user.role === 'developer' && String(user._id) === String(game.developerId)));

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Header Banner & Titles */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            {game.isFeatured && <span className="badge-featured">★ FEATURED</span>}
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
              By {game.developerName}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
            {game.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={20} className="star-filled" />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                ({game.reviewCount} rating aggregate)
              </span>
            </div>

            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Released: {game.releaseDate}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {canEdit && (
            <button
              onClick={handleOpenEdit}
              className="btn-secondary"
              style={{ padding: '12px 20px', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Edit Details
            </button>
          )}

          {(!user || user?.role === 'gamer') && (
            <button
              onClick={() => toggleWishlist(game._id)}
              className="btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              <Heart size={18} color={isWishlisted ? 'var(--primary-magenta)' : undefined} fill={isWishlisted ? 'var(--primary-magenta)' : 'none'} />
              {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          )}

          {(!user || user?.role === 'gamer') && game.storeLinks && game.storeLinks.length > 0 && (
            <button
              onClick={() => handleBuyNowClick(game.storeLinks[0].store)}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              <ShoppingCart size={18} /> Download / Play on {game.storeLinks[0].store} ({game.price === 0 ? 'FREE' : formatPrice(game.price)})
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout: Media + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Column: Media Gallery & Tabs */}
        <div>
          {/* Media Screenshot Gallery */}
          <ScreenshotGallery screenshots={game.screenshots} />

          {/* Embedded Trailer Video Player if available */}
          {game.trailerUrl && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={18} color="var(--primary-magenta)" fill="var(--primary-magenta)" /> Official Gameplay Trailer
              </h3>
              <div style={{ height: '400px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <ReactPlayer
                  url={game.trailerUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          )}

          {/* Tab Navigation Controls */}
          <div style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
            marginTop: '36px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'overview' ? '3px solid var(--primary-cyan)' : '3px solid transparent',
                color: activeTab === 'overview' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '10px 16px',
                cursor: 'pointer'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--primary-cyan)' : '3px solid transparent',
                color: activeTab === 'reviews' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '10px 16px',
                cursor: 'pointer'
              }}
            >
              Reviews ({game.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'forum' ? '3px solid var(--primary-cyan)' : '3px solid transparent',
                color: activeTab === 'forum' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '10px 16px',
                cursor: 'pointer'
              }}
            >
              Community Forum
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', marginBottom: '12px' }}>
                About the Game
              </h3>
              <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {stripHtml(game.description)}
              </div>
            </div>

          )}

          {/* TAB 2: REVIEWS SYSTEM */}
          {activeTab === 'reviews' && (
            <div>
              {/* Review Header & Aggregation breakdown */}
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.3rem' }}>
                      Gamer Reviews & Ratings
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Average rating calculated dynamically via MongoDB aggregation pipeline.
                    </p>
                  </div>

                  {(!user || user?.role === 'gamer') && (
                    <button
                      onClick={() => setIsPostingReview(true)}
                      className="btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Plus size={16} /> Write a Review
                    </button>
                  )}
                </div>

                {/* Rating score card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {game.averageRating > 0 ? game.averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '4px 0' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= Math.round(game.averageRating) ? 'star-filled' : 'star-empty'} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Based on {reviews.length} reviews
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = ratingBreakdown[stars] || 0;
                      const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                          <span style={{ width: '40px', color: 'var(--text-muted)' }}>{stars} ★</span>
                          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--accent-gold)' }} />
                          </div>
                          <span style={{ width: '30px', color: 'var(--text-dim)', textAlign: 'right' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Write Form Modal / Drawer */}
              {isPostingReview && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', borderColor: 'var(--primary-magenta)' }}>
                  <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '14px' }}>
                    Write Your Review for {game.title}
                  </h3>
                  <form onSubmit={handlePostReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Rating (1 to 5 Stars):
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <Star size={24} className={s <= reviewRating ? 'star-filled' : 'star-empty'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Review Headline (e.g. Masterpiece of game design)"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="input-field"
                      required
                    />

                    <textarea
                      placeholder="Share your detailed gameplay impressions..."
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="input-field"
                      rows={4}
                      required
                    />

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => setIsPostingReview(false)} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" disabled={submittingReview} className="btn-magenta">
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.length === 0 ? (
                  <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No reviews yet for this title. Be the first gamer to post a review!
                  </div>
                ) : (
                  reviews.map(rev => (
                    <div key={rev._id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={getAvatar(rev.userAvatar, rev.userName, 100)}
                            alt={rev.userName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.userName)}&background=FF6B00&color=fff&size=100&bold=true&format=png`; }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{rev.userName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={14} className={s <= rev.rating ? 'star-filled' : 'star-empty'} />
                          ))}
                        </div>
                      </div>

                      <h4 style={{ color: 'var(--primary-cyan)', fontSize: '1rem', marginBottom: '6px' }}>
                        {rev.title}
                      </h4>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {rev.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FORUM SECTION */}
          {activeTab === 'forum' && (
            <ForumSection gameId={game._id} gameTitle={game.title} />
          )}
        </div>

        {/* Right Column: Sidebar Metadata & Store Affiliate Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Store & Buy Affiliate Buttons */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.1rem', marginBottom: '14px' }}>
              Official Storefronts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {game.storeLinks && game.storeLinks.length > 0 ? (
                game.storeLinks.map((storeObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuyNowClick(storeObj.store)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <ExternalLink size={16} /> Get on {storeObj.store}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => handleBuyNowClick('Steam')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ExternalLink size={16} /> Get on Steam
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px', textAlign: 'center' }}>
              Purchases via affiliate links directly support indie creators.
            </div>
          </div>

          {/* Game Metadata Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.1rem', marginBottom: '14px' }}>
              Game Info
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Developer:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{game.developerName}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Release Date:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{game.releaseDate}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Price:</span>
                <span style={{ color: 'var(--primary-cyan)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                  {game.price === 0 ? 'FREE TO PLAY' : formatPrice(game.price)}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Genres & Tags:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {game.genre?.map((g, idx) => (
                    <span key={idx} className="badge-genre">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {game.steamAppId && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Steam App ID:</span>
                  <span style={{ color: '#fff', fontFamily: 'monospace' }}>{game.steamAppId}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* EDIT GAME MODAL OVERLAY */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-card card-slide-up" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative',
            border: '1px solid var(--primary-cyan)',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.2)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛠️ Edit Game Details & Media
            </h2>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Game Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Developer / Studio *
                  </label>
                  <input
                    type="text"
                    value={editDeveloperName}
                    onChange={(e) => setEditDeveloperName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Genres (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editGenreInput}
                    onChange={(e) => setEditGenreInput(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Release Date
                  </label>
                  <input
                    type="text"
                    value={editReleaseDate}
                    onChange={(e) => setEditReleaseDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Description *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Steam App ID (optional)
                  </label>
                  <input
                    type="text"
                    value={editSteamAppId}
                    onChange={(e) => setEditSteamAppId(e.target.value)}
                    placeholder="e.g. 367520"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Epic Product Slug (optional)
                  </label>
                  <input
                    type="text"
                    value={editEpicSlug}
                    onChange={(e) => setEditEpicSlug(e.target.value)}
                    placeholder="e.g. fortnite"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Header / Main Image URL
                </label>
                <input
                  type="text"
                  value={editHeaderImage}
                  onChange={(e) => setEditHeaderImage(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Screenshots URLs (one per line)
                </label>
                <textarea
                  value={editScreenshotsInput}
                  onChange={(e) => setEditScreenshotsInput(e.target.value)}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Trailer URL (YouTube/MP4)
                </label>
                <input
                  type="text"
                  value={editTrailerUrl}
                  onChange={(e) => setEditTrailerUrl(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
