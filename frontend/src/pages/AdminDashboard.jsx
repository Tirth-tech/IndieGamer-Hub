import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Star, Sparkles, MousePointer, DollarSign, RefreshCw, ToggleLeft, ToggleRight, UserCheck, UserX, Clock, Gamepad2, Trash2, User, Camera, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getAvatar } from '../utils/textUtils';

export default function AdminDashboard() {
  const { user, formatPrice } = useAuth();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingDevs, setPendingDevs] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingGames, setPendingGames] = useState([]);
  const [pendingGamesLoading, setPendingGamesLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchPendingDevs();
    fetchPendingGames();
  }, []);

  const fetchPendingGames = async () => {
    try {
      setPendingGamesLoading(true);
      const res = await axios.get('/api/games/pending');
      setPendingGames(res.data.games || []);
    } catch (err) {
      console.error('Failed to load pending games:', err);
    } finally {
      setPendingGamesLoading(false);
    }
  };

  const handleApproveGame = async (gameId, action) => {
    try {
      await axios.put(`/api/games/${gameId}/approve?action=${action}`);
      setPendingGames(prev => prev.filter(g => g._id !== gameId));
      toast.success(
        action === 'approve' ? 'Game approved & published to catalog!' : 'Game submission declined.',
        action === 'approve' ? '✅ Game Approved' : '❌ Game Declined'
      );
      if (action === 'approve') fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed', 'Error');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await axios.delete(`/api/games/${gameId}`);
      setGames(prev => prev.filter(g => g._id !== gameId));
      toast.success('Game deleted successfully', 'Deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete game', 'Error');
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [gamesRes, statsRes] = await Promise.all([
        axios.get('/api/games'),
        axios.get('/api/affiliate/stats')
      ]);

      setGames(gamesRes.data.games || []);
      setAffiliateStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load admin dashboard data', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDevs = async () => {
    try {
      setPendingLoading(true);
      const res = await axios.get('/api/auth/pending-developers');
      setPendingDevs(res.data.developers || []);
    } catch (err) {
      console.error('Failed to fetch pending developers:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  const [doneIds, setDoneIds] = useState({}); // { userId: 'approved' | 'rejected' }

  const handleApprove = async (userId, action) => {
    try {
      await axios.get(`/api/auth/approve/${userId}?action=${action}`, {
        headers: { Accept: 'application/json' }
      });

      // Show "Done" badge on the card first
      setDoneIds(prev => ({ ...prev, [userId]: action }));

      toast.success(
        action === 'approve' ? 'Developer approved! Confirmation email sent to them.' : 'Request rejected.',
        action === 'approve' ? '✅ Approved' : '❌ Rejected'
      );

      // Remove from list after 2.5 seconds
      setTimeout(() => {
        setPendingDevs(prev => prev.filter(d => d._id !== userId));
        setDoneIds(prev => { const n = { ...prev }; delete n[userId]; return n; });
      }, 2500);

    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed', 'Error');
    }
  };

  const handleToggleFeatured = async (gameId, currentFeaturedStatus) => {
    try {
      const res = await axios.put(`/api/games/${gameId}/featured`, {
        isFeatured: !currentFeaturedStatus
      });

      // Update local state instantly
      setGames(prev => prev.map(g => g._id === gameId ? { ...g, isFeatured: res.data.game.isFeatured } : g));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to toggle featured status', 'Admin Error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }} className="glass-card">
        <h2 style={{ color: 'var(--primary-magenta)', marginBottom: '10px' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>Only administrators can access the monetization and featured games dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>
      
      {/* Header & Admin Profile Card */}
      <div className="glass-card" style={{
        padding: '24px 28px', marginBottom: '30px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '20px',
        background: 'linear-gradient(135deg, rgba(255,107,0,0.1) 0%, rgba(23,19,15,0.95) 100%)',
        border: '1px solid rgba(255,107,0,0.3)',
        boxShadow: '0 0 30px rgba(255,107,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={getAvatar(user.avatar, user.name, 120)}
              alt={user.name}
              style={{
                width: 68, height: 68, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid #FF6B00', boxShadow: '0 0 15px rgba(255,107,0,0.4)',
              }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF6B00&color=fff&size=120&bold=true&format=png`; }}
            />
            <Link
              to="/profile"
              title="Change Profile Photo"
              style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 26, height: 26, borderRadius: '50%',
                background: '#FF6B00', border: '2px solid #0D0D0D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer',
              }}
            >
              <Camera size={13} />
            </Link>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 900 }}>
                {user.name}
              </h1>
              <span style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFB000)',
                color: '#000', fontSize: '0.72rem', fontWeight: 900,
                padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                ADMINISTRATOR
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              📧 {user.email} &nbsp;·&nbsp; 🌍 {user.country || 'Global Admin'}
            </p>
          </div>
        </div>

        <Link
          to="/profile"
          className="btn-primary"
          style={{ gap: '8px', padding: '10px 18px', fontSize: '0.88rem', textDecoration: 'none' }}
        >
          <Settings size={16} /> Edit Profile & Photo
        </Link>
      </div>

      {/* ── Pending Developer Requests ─────────────────────────────────── */}
      <div className="glass-card" style={{
        padding: '24px', marginBottom: '32px',
        border: pendingDevs.length > 0 ? '1px solid rgba(255,176,0,0.5)' : '1px solid var(--border-color)',
        boxShadow: pendingDevs.length > 0 ? '0 0 20px rgba(255,176,0,0.1)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={22} color="#FFB000" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Pending Developer Requests
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Approve or reject developer account applications
              </p>
            </div>
            {pendingDevs.length > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFB000)',
                color: '#fff', fontSize: '0.75rem', fontWeight: 800,
                padding: '3px 10px', borderRadius: '20px',
                boxShadow: '0 0 10px rgba(255,107,0,0.4)',
              }}>
                {pendingDevs.length} pending
              </span>
            )}
          </div>
          <button onClick={fetchPendingDevs} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {pendingLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : pendingDevs.length === 0 ? (
          <div style={{
            padding: '28px', textAlign: 'center', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No pending developer requests</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingDevs.map(dev => (
              <div key={dev._id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px', borderRadius: '10px',
                background: 'rgba(255,176,0,0.05)', border: '1px solid rgba(255,176,0,0.2)',
                flexWrap: 'wrap',
              }}>
                <img
                  src={getAvatar(dev.avatar, dev.name, 60)}
                  alt={dev.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFB000' }}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=FF6B00&color=fff&size=60&bold=true&format=png`; }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{dev.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{dev.email}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                    🌍 {dev.country} · Requested {new Date(dev.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                {/* Show Done badge OR action buttons */}
                {doneIds[dev._id] ? (
                  <div style={{
                    padding: '10px 20px', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem',
                    background: doneIds[dev._id] === 'approve' ? 'rgba(57,255,136,0.12)' : 'rgba(255,68,68,0.12)',
                    color: doneIds[dev._id] === 'approve' ? '#39FF88' : '#FF6B6B',
                    border: `1px solid ${doneIds[dev._id] === 'approve' ? 'rgba(57,255,136,0.4)' : 'rgba(255,68,68,0.4)'}`,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    animation: 'fadeIn 0.3s ease',
                  }}>
                    {doneIds[dev._id] === 'approve' ? <><UserCheck size={16} /> ✅ APPROVED</> : <><UserX size={16} /> ❌ REJECTED</>}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleApprove(dev._id, 'approve')}
                      style={{
                        padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, #FF6B00, #FFB000)', color: '#fff',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                        boxShadow: '0 0 12px rgba(255,107,0,0.3)',
                      }}
                    >
                      <UserCheck size={15} /> Approve
                    </button>
                    <button
                      onClick={() => handleApprove(dev._id, 'reject')}
                      style={{
                        padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem',
                        background: 'rgba(255,68,68,0.1)', color: '#FF6B6B',
                        border: '1px solid rgba(255,68,68,0.35)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <UserX size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ── Pending Game Submissions (Admin Approval) ────────────────────── */}
      <div className="glass-card" style={{
        padding: '24px', marginBottom: '32px',
        border: pendingGames.length > 0 ? '1px solid rgba(255,107,0,0.5)' : '1px solid var(--border-color)',
        boxShadow: pendingGames.length > 0 ? '0 0 20px rgba(255,107,0,0.15)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Gamepad2 size={22} color="#FF6B00" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Pending Game Submissions
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Only Admin can approve games. If declined, the game will not be published to the public catalog.
              </p>
            </div>
            {pendingGames.length > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFB000)',
                color: '#fff', fontSize: '0.75rem', fontWeight: 800,
                padding: '3px 10px', borderRadius: '20px',
                boxShadow: '0 0 10px rgba(255,107,0,0.4)',
              }}>
                {pendingGames.length} awaiting approval
              </span>
            )}
          </div>
          <button onClick={fetchPendingGames} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {pendingGamesLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : pendingGames.length === 0 ? (
          <div style={{
            padding: '28px', textAlign: 'center', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎮</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No pending game submissions</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingGames.map(game => (
              <div key={game._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: '10px',
                background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.2)',
                flexWrap: 'wrap', gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={game.headerImage}
                    alt={game.title}
                    style={{ width: '80px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{game.title}</div>
                    <div style={{ color: 'var(--primary-cyan)', fontSize: '0.82rem' }}>By {game.developerName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                      Price: {game.price === 0 ? 'FREE' : formatPrice(game.price)} · Genre: {Array.isArray(game.genre) ? game.genre.join(', ') : game.genre}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleApproveGame(game._id, 'approve')}
                    style={{
                      padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #FF6B00, #FFB000)', color: '#fff',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 0 12px rgba(255,107,0,0.3)',
                    }}
                  >
                    <UserCheck size={15} /> Approve Game
                  </button>
                  <button
                    onClick={() => handleApproveGame(game._id, 'reject')}
                    style={{
                      padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem',
                      background: 'rgba(255,68,68,0.1)', color: '#FF6B6B',
                      border: '1px solid rgba(255,68,68,0.35)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <UserX size={15} /> Decline Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Total Catalog Games</span>
            <Sparkles size={18} color="var(--primary-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {games.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Featured Spotlights</span>
            <Star size={18} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '6px' }}>
            {games.filter(g => g.isFeatured).length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Affiliate Clicks</span>
            <MousePointer size={18} color="var(--primary-magenta)" />
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary-magenta)', marginTop: '6px' }}>
            {affiliateStats?.totalClicks || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Estimated Commission</span>
            <DollarSign size={18} color="var(--accent-green)" />
          </div>
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-green)', marginTop: '6px' }}>
            {affiliateStats?.estimatedCommission || '$0.00'}
          </div>
        </div>
      </div>

      {/* Featured Toggle Management Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: '#fff' }}>
              Homepage Spotlight Carousel Management
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Toggle the <code>isFeatured</code> switch to grant games priority rendering in the hero banner.
            </p>
          </div>

          <button onClick={fetchAdminData} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading catalog list...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Game</th>
                  <th style={{ padding: '12px 16px' }}>Developer</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Rating</th>
                  <th style={{ padding: '12px 16px' }}>Affiliate Clicks</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Featured Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={game.headerImage}
                        alt={game.title}
                        style={{ width: '48px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <strong style={{ color: '#fff' }}>{game.title}</strong>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {game.developerName}
                    </td>

                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                      {game.price === 0 ? 'FREE' : formatPrice(game.price)}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                        ★ {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                        ({game.reviewCount})
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>
                      {game.affiliateClicks || 0} clicks
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleFeatured(game._id, game.isFeatured)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: game.isFeatured ? 'var(--primary-cyan)' : 'var(--text-dim)',
                          fontWeight: 700
                        }}
                      >
                        {game.isFeatured ? (
                          <>
                            <ToggleRight size={28} color="var(--primary-cyan)" /> Featured
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={28} color="var(--text-dim)" /> Standard
                          </>
                        )}
                      </button>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteGame(game._id)}
                        style={{
                          padding: '6px 14px', borderRadius: '6px',
                          background: 'rgba(255,68,68,0.1)', color: '#FF6B6B',
                          border: '1px solid rgba(255,68,68,0.3)', cursor: 'pointer',
                          fontSize: '0.78rem', fontWeight: 700,
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
