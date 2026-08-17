import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Gamepad2, LogIn, Lock, Mail, ShieldCheck, Code, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'developer' | 'gamer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password.trim());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '50px auto', padding: '0 20px' }}>
      <div className="glass-card card-slide-up" style={{ padding: '36px', borderColor: 'var(--primary-green)', boxShadow: 'var(--shadow-green)' }}>
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--primary-green), #059669)',
            padding: '14px',
            borderRadius: '16px',
            marginBottom: '14px',
            boxShadow: '0 0 20px rgba(0, 255, 102, 0.5)'
          }}>
            <Gamepad2 size={34} color="#020402" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.7rem', color: '#fff', fontWeight: 900 }}>
            IndieGamer Hub Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Select your account type and type your email and password to log in.
          </p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--primary-green)', display: 'block', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Choose Login Role:
          </label>
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(255,255,255,0.02)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            {/* Sliding Pill Background Indicator */}
            <div style={{
              position: 'absolute',
              top: '4px',
              left: selectedRole === 'admin' 
                ? '4px' 
                : selectedRole === 'developer' 
                  ? 'calc(33.333% + 1.33px)' 
                  : 'calc(66.666% - 1.33px)',
              width: 'calc(33.333% - 5.33px)',
              height: 'calc(100% - 8px)',
              background: 'rgba(0, 255, 102, 0.15)',
              border: '1px solid var(--primary-green)',
              boxShadow: '0 0 10px rgba(0, 255, 102, 0.25)',
              borderRadius: '7px',
              transition: 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '10px 6px',
                borderRadius: '7px',
                border: 'none',
                background: 'transparent',
                color: selectedRole === 'admin' ? '#fff' : 'var(--text-muted)',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'color 0.2s ease'
              }}
            >
              <ShieldCheck size={14} color={selectedRole === 'admin' ? 'var(--primary-green)' : 'var(--text-dim)'} /> Admin
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('developer')}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '10px 6px',
                borderRadius: '7px',
                border: 'none',
                background: 'transparent',
                color: selectedRole === 'developer' ? '#fff' : 'var(--text-muted)',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'color 0.2s ease'
              }}
            >
              <Code size={14} color={selectedRole === 'developer' ? 'var(--primary-green)' : 'var(--text-dim)'} /> Developer
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('gamer')}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '10px 6px',
                borderRadius: '7px',
                border: 'none',
                background: 'transparent',
                color: selectedRole === 'gamer' ? '#fff' : 'var(--text-muted)',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'color 0.2s ease'
              }}
            >
              <UserCheck size={14} color={selectedRole === 'gamer' ? 'var(--primary-green)' : 'var(--text-dim)'} /> Gamer
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: error.includes('pending admin approval') ? 'rgba(255, 176, 0, 0.15)' : 'rgba(255, 0, 80, 0.15)',
            border: error.includes('pending admin approval') ? '1px solid #FFB000' : '1px solid #f87171',
            color: '#fff',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {error.includes('pending admin approval') ? (
              <div>
                <div style={{ fontWeight: 800, color: '#FFB000', marginBottom: '4px', fontSize: '0.95rem' }}>
                  ⏳ Developer Account Pending Approval
                </div>
                <div>{error}</div>
              </div>
            ) : (
              <span>❌ {error}</span>
            )}
          </div>
        )}

        {/* LOGIN FORM - USER TYPES THEIR OWN EMAIL AND PASSWORD */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div key={selectedRole} className="slide-in-right" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                {selectedRole === 'admin' ? 'Admin Email Address' : selectedRole === 'developer' ? 'Developer Email Address' : 'Gamer Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  placeholder={selectedRole === 'admin' ? 'enter admin email' : selectedRole === 'developer' ? 'Enter developer email' : 'Enter gamer email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px', height: '44px', fontSize: '0.95rem' }}
            >
              <LogIn size={18} /> {loading ? 'Authenticating...' : `Log In as ${selectedRole.toUpperCase()}`}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0, 255, 102, 0.12)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-green)', fontWeight: 700 }}>Register Here</Link>
        </div>

      </div>
    </div>
  );
}
