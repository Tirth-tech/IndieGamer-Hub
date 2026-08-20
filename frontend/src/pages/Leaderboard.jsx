import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, ShieldCheck, Code2, Gamepad2, Search, Calendar, Globe, Award, UserCheck } from 'lucide-react';
import { getAvatar } from '../utils/textUtils';

const ROLE_BADGE = {
  admin:     { label: 'Admin',     color: '#FF6B00', icon: ShieldCheck, bg: 'rgba(255, 107, 0, 0.12)' },
  developer: { label: 'Developer', color: '#FFB000', icon: Code2, bg: 'rgba(255, 176, 0, 0.12)' },
  gamer:     { label: 'Gamer',     color: '#39FF88', icon: Gamepad2, bg: 'rgba(57, 255, 136, 0.12)' },
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ admin: 0, developer: 0, gamer: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all | admin | developer | gamer

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leaderboard');
      setUsers(res.data.users || []);
      setCounts(res.data.counts || { admin: 0, developer: 0, gamer: 0 });
    } catch (err) {
      console.error('Failed to load community leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (user.country && user.country.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalMembers = counts.admin + counts.developer + counts.gamer;

  const statCard = (title, count, icon: any, color) => (
    <div className="glass-card" style={{
      padding: '20px',
      flex: 1,
      minWidth: '200px',
      borderLeft: `4px solid ${color}`,
      background: 'linear-gradient(135deg, rgba(23,19,15,0.95) 0%, rgba(15,12,9,0.98) 100%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            {title}
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {count}
          </span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.05)',
          color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px', background: 'rgba(255,107,0,0.06)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,107,0,0.2)' }}>
          <Trophy color="var(--primary-green)" size={22} className="pulse-glow" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Hub Champions
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
          IndieGamer Hub <span style={{ color: 'var(--primary-green)' }}>Leaderboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '10px auto 0' }}>
          Meet the community members, verified creators, and site admins who power our indie game network. Rank is based on joining order.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '36px' }}>
        {statCard("Total Members", totalMembers, <UserCheck size={20} />, "var(--primary-green)")}
        {statCard("Gamers Joined", counts.gamer, <Gamepad2 size={20} />, "#39FF88")}
        {statCard("Verified Developers", counts.developer, <Code2 size={20} />, "#FFB000")}
        {statCard("Platform Admins", counts.admin, <ShieldCheck size={20} />, "#FF6B00")}
      </div>

      {/* Controls & Filter Panel */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', background: 'rgba(15,12,9,0.96)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search members by name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Pioneer Members' },
              { id: 'admin', label: 'Admins' },
              { id: 'developer', label: 'Developers' },
              { id: 'gamer', label: 'Gamers' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: roleFilter === tab.id ? 'var(--primary-green)' : 'var(--border-color)',
                  background: roleFilter === tab.id ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: roleFilter === tab.id ? 'var(--primary-green)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Leaderboard Table/List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading community roster...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>No members match filters</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try resetting search query or filtering to all members.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px 0', background: 'rgba(23,19,15,0.95)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '12px 24px', width: '80px' }}>Rank</th>
                  <th style={{ padding: '12px 16px' }}>User Details</th>
                  <th style={{ padding: '12px 16px', width: '140px' }}>Role</th>
                  <th style={{ padding: '12px 16px', width: '160px' }}>Country</th>
                  <th style={{ padding: '12px 24px', width: '160px' }}>Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((member, idx) => {
                  const badge = ROLE_BADGE[member.role] || ROLE_BADGE.gamer;
                  const BadgeIcon = badge.icon;
                  const globalIndex = users.findIndex(u => u._id === member._id) + 1;

                  // Custom visual for Top 3
                  let rankDisplay: any = `#${globalIndex}`;
                  if (globalIndex === 1) rankDisplay = <span style={{ fontSize: '1.3rem' }} title="Pioneer Champion">🥇</span>;
                  else if (globalIndex === 2) rankDisplay = <span style={{ fontSize: '1.3rem' }}>🥈</span>;
                  else if (globalIndex === 3) rankDisplay = <span style={{ fontSize: '1.3rem' }}>🥉</span>;

                  return (
                    <tr
                      key={member._id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 107, 0, 0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Rank Number */}
                      <td style={{ padding: '16px 24px', fontWeight: 800, color: 'var(--primary-green)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                        {rankDisplay}
                      </td>

                      {/* User Avatar + Name + Bio */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={getAvatar(member.avatar, member.name, 100)}
                            alt={member.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: `2px solid ${badge.color}`,
                              boxShadow: `0 0 10px ${badge.color}15`
                            }}
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=FF6B00&color=fff&size=100&bold=true&format=png`; }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{member.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {member.bio || 'Passionate indie gamer.'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: badge.bg,
                          color: badge.color,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <BadgeIcon size={12} />
                          {badge.label}
                        </div>
                      </td>

                      {/* Country info */}
                      <td style={{ padding: '16px', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe size={14} color="var(--primary-green)" />
                          {member.country || 'United States'}
                        </div>
                      </td>

                      {/* Join Date */}
                      <td style={{ padding: '16px 24px', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={13} />
                          {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
