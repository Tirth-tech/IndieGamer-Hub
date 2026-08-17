import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getAvatar } from '../utils/textUtils';
import {
  User, Mail, Lock, Globe, FileText, Camera, Save,
  ShieldCheck, Gamepad2, Code2, Eye, EyeOff, ArrowLeft
} from 'lucide-react';

const COUNTRIES = [
  'United States','India','United Kingdom','Germany','France',
  'Canada','Australia','Japan','Brazil','Netherlands','Sweden',
  'Spain','Italy','South Korea','Russia','Poland','Mexico',
  'Argentina','Turkey','Indonesia'
];

const ROLE_BADGE = {
  admin:     { label: 'Admin',     color: '#FF6B00', icon: ShieldCheck },
  developer: { label: 'Developer', color: '#FFB000', icon: Code2 },
  gamer:     { label: 'Gamer',     color: '#39FF88', icon: Gamepad2 },
};

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const toast   = useToast();
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    bio:         user?.bio         || '',
    country:     user?.country     || 'United States',
    avatar:      user?.avatar      || '',
    newPassword: '',
    confirmPass: '',
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        country: user.country || 'United States',
        avatar: user.avatar || '',
      }));
    }
  }, [user]);

  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [activeTab,   setActiveTab]   = useState('profile'); // profile | security | devstats
  const [devStats, setDevStats] = useState(null);
  const [devLoading, setDevLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'developer' || user?.role === 'admin') {
      fetchDevStats();
    }
  }, [user]);

  const fetchDevStats = async () => {
    try {
      setDevLoading(true);
      const res = await axios.get('/api/affiliate/stats');
      setDevStats(res.data);
    } catch (err) {
      console.error('Failed to load developer stats:', err);
    } finally {
      setDevLoading(false);
    }
  };

  const handleDeleteMyGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete your game?')) return;
    try {
      await axios.delete(`/api/games/${gameId}`);
      toast.success('Your game has been deleted successfully', 'Game Deleted');
      fetchDevStats();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete game', 'Error');
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Please log in to view your profile.</p>
      </div>
    );
  }

  const badge = ROLE_BADGE[user.role] || ROLE_BADGE.gamer;
  const BadgeIcon = badge.icon;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  // Convert uploaded image to base64 data URL
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Image must be under 2 MB', 'File too large');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPass) {
      toast.error('Passwords do not match', 'Password Error');
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters', 'Too Short');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name:    form.name,
        email:   form.email,
        bio:     form.bio,
        country: form.country,
        avatar:  form.avatar,
      };
      if (form.newPassword) payload.newPassword = form.newPassword;

      await updateUser(payload);
      toast.success('Profile saved successfully!', 'Profile Updated ✅');
      setForm(f => ({ ...f, newPassword: '', confirmPass: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── Styles ──────────────────────────────────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 42px',
    background: 'rgba(9,9,9,0.9)', border: '1px solid var(--border-color)',
    borderRadius: '8px', color: '#fff', fontSize: '0.93rem',
    outline: 'none', fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px',
    color: 'var(--text-muted)', marginBottom: '7px',
  };
  const tabBtn = (active) => ({
    padding: '10px 22px', borderRadius: '8px', fontWeight: 700,
    fontSize: '0.88rem', cursor: 'pointer', border: 'none',
    background: active ? 'rgba(255,107,0,0.15)' : 'transparent',
    color:      active ? '#FF6B00' : 'var(--text-muted)',
    borderBottom: active ? '2px solid #FF6B00' : '2px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px',
      }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* ── Header card ───────────────────────────────────────────────── */}
      <div className="glass-card" style={{
        padding: '32px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(23,19,15,0.97) 0%, rgba(15,12,9,0.99) 100%)',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>

          {/* Avatar with upload overlay */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={getAvatar(form.avatar || user.avatar, user.name, 150)}
              alt={user.name}
              style={{
                width: 100, height: 100, borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FF6B00',
                boxShadow: '0 0 20px rgba(255,107,0,0.4)',
              }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF6B00&color=fff&size=150&bold=true&format=png`; }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 32, height: 32, borderRadius: '50%',
                background: '#FF6B00', border: '2px solid #090909',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 0 10px rgba(255,107,0,0.5)',
              }}
            >
              <Camera size={14} color="#fff" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
          </div>

          {/* Name + role */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {user.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BadgeIcon size={14} color={badge.color} />
              <span style={{ color: badge.color, fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {badge.label}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user.email}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: '4px' }}>
              🌍 {user.country} &nbsp;·&nbsp; Wishlist: {user.savedGames?.length || 0} games
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
            {[
              { label: 'Saved Games', value: user.savedGames?.length || 0 },
              { label: 'Role', value: badge.label },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{
                padding: '14px 20px', textAlign: 'center', minWidth: 90,
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF6B00', fontFamily: 'var(--font-title)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <button style={tabBtn(activeTab === 'profile')}  onClick={() => setActiveTab('profile')}>👤 Profile Info</button>
        <button style={tabBtn(activeTab === 'security')} onClick={() => setActiveTab('security')}>🔒 Security</button>
        {(user.role === 'developer' || user.role === 'admin') && (
          <button style={tabBtn(activeTab === 'devstats')} onClick={() => setActiveTab('devstats')}>🛠️ My Games & Stats</button>
        )}
      </div>

      {/* ── Profile Tab ────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '28px', background: 'rgba(23,19,15,0.95)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Display Name */}
            <div>
              <label style={labelStyle}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name"
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={inputStyle} value={form.email} onChange={set('email')} placeholder="your@email.com" type="email"
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.country} onChange={set('country')}
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; }}
                >
                  {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#17130F' }}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label style={labelStyle}>Avatar URL <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400 }}>(or use camera button)</span></label>
              <div style={{ position: 'relative' }}>
                <Camera size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={inputStyle} value={form.avatar} onChange={set('avatar')} placeholder="https://..."
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Bio — full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Bio</label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: 14 }} />
                <textarea
                  style={{ ...inputStyle, paddingTop: '12px', paddingBottom: '12px', height: '90px', resize: 'vertical' }}
                  value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself..."
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ gap: '8px', opacity: saving ? 0.7 : 1 }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {/* ── Security Tab ──────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="glass-card" style={{ padding: '28px', background: 'rgba(23,19,15,0.95)' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Change Password</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '24px' }}>Leave blank if you don't want to change your password.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* New Password */}
            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  type={showPass ? 'text' : 'password'}
                  value={form.newPassword} onChange={set('newPassword')}
                  placeholder="Min. 6 characters"
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPass} onChange={set('confirmPass')}
                  placeholder="Re-enter password"
                  onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.boxShadow = '0 0 12px rgba(255,107,0,0.2)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={() => setShowConfirm(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {form.newPassword && (
              <div style={{ gridColumn: '1 / -1' }}>
                {['Weak','Fair','Good','Strong'].map((label, i) => {
                  const strength = form.newPassword.length >= 12 ? 3
                    : form.newPassword.length >= 8 ? 2
                    : form.newPassword.length >= 6 ? 1 : 0;
                  const colors = ['#FF4444','#FFB000','#39FF88','#00A8FF'];
                  return (
                    <span key={i} style={{
                      display: 'inline-block', height: '4px', width: '60px',
                      background: i <= strength ? colors[strength] : 'var(--border-color)',
                      borderRadius: '2px', marginRight: '4px',
                      boxShadow: i <= strength ? `0 0 6px ${colors[strength]}` : 'none',
                      transition: 'all 0.3s',
                    }} />
                  );
                })}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  {form.newPassword.length >= 12 ? 'Strong' : form.newPassword.length >= 8 ? 'Good' : form.newPassword.length >= 6 ? 'Fair' : 'Weak'}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
                color: '#FF6B6B', padding: '10px 20px', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ gap: '8px', opacity: saving ? 0.7 : 1 }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}

      {/* ── Developer My Games & Stats Tab ──────────────────────────────── */}
      {activeTab === 'devstats' && (
        <div className="glass-card" style={{ padding: '28px', background: 'rgba(23,19,15,0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                My Submitted Games & Statistics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>
                View stats and manage only your own games. Developer games require Admin approval before being published.
              </p>
            </div>
            <button onClick={() => navigate('/add-game')} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              + Submit New Game
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>My Total Games</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>{devStats?.games?.length || 0}</span>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Affiliate Clicks</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-magenta)', fontFamily: 'var(--font-heading)' }}>{devStats?.totalClicks || 0}</span>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Est. Revenue</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>{devStats?.estimatedCommission || '$0.00'}</span>
            </div>
          </div>

          {/* Games Table */}
          {devLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your games...</div>
          ) : !devStats?.games || devStats.games.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              You haven't submitted any games yet. Click "+ Submit New Game" to add your title!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 14px' }}>Game Title</th>
                    <th style={{ padding: '10px 14px' }}>Approval Status</th>
                    <th style={{ padding: '10px 14px' }}>Clicks</th>
                    <th style={{ padding: '10px 14px' }}>Rating</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devStats.games.map(game => (
                    <tr key={game._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{game.title}</td>
                      <td style={{ padding: '12px 14px' }}>
                        {game.approvalStatus === 'pending' ? (
                          <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,176,0,0.15)', color: '#FFB000', fontSize: '0.75rem', fontWeight: 800 }}>
                            ⏳ Pending Admin Approval
                          </span>
                        ) : game.approvalStatus === 'rejected' ? (
                          <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(255,68,68,0.15)', color: '#FF6B6B', fontSize: '0.75rem', fontWeight: 800 }}>
                            ❌ Declined
                          </span>
                        ) : (
                          <span style={{ padding: '3px 8px', borderRadius: '12px', background: 'rgba(0,255,102,0.15)', color: 'var(--primary-green)', fontSize: '0.75rem', fontWeight: 800 }}>
                            ✅ Approved & Live
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)' }}>{game.affiliateClicks || 0}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-gold)', fontWeight: 700 }}>★ {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'New'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteMyGame(game._id)}
                          style={{
                            padding: '5px 10px', borderRadius: '4px',
                            background: 'rgba(255,68,68,0.1)', color: '#FF6B6B',
                            border: '1px solid rgba(255,68,68,0.3)', cursor: 'pointer',
                            fontSize: '0.75rem', fontWeight: 700
                          }}
                        >
                          Delete My Game
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
