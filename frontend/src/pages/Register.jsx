import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Gamepad2, UserPlus, Lock, Mail, User, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const { register, setSession } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('gamer');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('United States');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUserId, setPendingUserId] = useState(() => sessionStorage.getItem('pending_dev_id') || '');
  const [pending, setPending] = useState(() => Boolean(sessionStorage.getItem('pending_dev_id')));
  const [pendingName, setPendingName] = useState(() => sessionStorage.getItem('pending_dev_name') || '');

  useEffect(() => {
    if (!pending || !pendingUserId) return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`/api/auth/status/${pendingUserId}`);
        if (res.data?.status === 'approved') {
          sessionStorage.removeItem('pending_dev_id');
          sessionStorage.removeItem('pending_dev_name');
          sessionStorage.removeItem('pending_dev_email');
          setSession(res.data.token, res.data.user);
          if (toast?.success) {
            toast.success('Your developer account has been approved!', 'Account Approved 🎉');
          }
          navigate('/');
        } else if (res.data?.status === 'rejected') {
          sessionStorage.removeItem('pending_dev_id');
          sessionStorage.removeItem('pending_dev_name');
          sessionStorage.removeItem('pending_dev_email');
          setPending(false);
          setPendingUserId('');
          if (toast?.error) {
            toast.error('Your developer request was rejected by admin.', 'Request Rejected ❌');
          }
          setError('Your developer account request was rejected by the administrator.');
        }
      } catch (err) {
        console.warn('Approval status check error:', err.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2500);
    return () => clearInterval(interval);
  }, [pending, pendingUserId, setSession, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await register({ name, email, password, role, bio, country });
      if (res?.pending) {
        const uId = res.user?._id || res.user?.id || '';
        setPendingUserId(uId);
        setPendingName(name);
        sessionStorage.setItem('pending_dev_id', uId);
        sessionStorage.setItem('pending_dev_name', name);
        sessionStorage.setItem('pending_dev_email', email);
        setPending(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Pending approval screen ───────────────────────────────────────────────
  if (pending) {
    return (
      <div style={{ maxWidth: '520px', margin: '60px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{
          padding: '44px 36px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(23,19,15,0.97) 0%, rgba(15,12,9,0.99) 100%)',
          border: '1px solid rgba(255,176,0,0.4)',
          boxShadow: '0 0 40px rgba(255,107,0,0.15)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #FF6B00, #FFB000)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', boxShadow: '0 0 30px rgba(255,107,0,0.5)',
          }}>⏳</div>

          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: '#fff', marginBottom: '10px', fontWeight: 900 }}>
            Request Under Review
          </h2>
          <p style={{ color: '#FFB000', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
            Hey {pendingName || 'Developer'}! 🎮
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Your <strong style={{ color: '#FF6B00' }}>Developer account</strong> request has been submitted.
            The admin has been notified and will review your request shortly.
          </p>

          {/* Status steps */}
          <div style={{ textAlign: 'left', margin: '0 auto 28px', maxWidth: 320 }}>
            {[
              { icon: '✅', label: 'Account created', done: true },
              { icon: '📧', label: 'Admin notified via email', done: true },
              { icon: '⏳', label: 'Awaiting admin approval', done: false },
              { icon: '🚀', label: 'Developer access granted', done: false },
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
                <span style={{ fontSize: '0.87rem', fontWeight: 600, color: step.done ? '#fff' : 'var(--text-muted)' }}>
                  {step.label}
                </span>
                {step.done && <span style={{ marginLeft: 'auto', color: '#39FF88', fontSize: '0.75rem', fontWeight: 700 }}>DONE</span>}
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
            You'll receive an email once approved. This page will automatically update!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => {
              sessionStorage.removeItem('pending_dev_id');
              setPending(false);
              setPendingUserId('');
            }} className="btn-secondary">Cancel & Register Again</button>
            <button onClick={() => navigate('/')} className="btn-secondary">Browse Games</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '0 20px' }}>
      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex', background: 'linear-gradient(135deg, #FF6B00, #FFB000)',
            padding: '12px', borderRadius: '12px', marginBottom: '12px'
          }}>
            <Gamepad2 size={32} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: '#fff' }}>Join IndieGamer Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Connect with developers and discover games.</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.4)',
            color: '#FF6B6B', padding: '10px 14px', borderRadius: '6px',
            fontSize: '0.85rem', marginBottom: '18px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Role Tabs */}
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Account Role *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setRole('gamer')} style={{
                flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                border: role === 'gamer' ? '2px solid #FF6B00' : '1px solid var(--border-color)',
                background: role === 'gamer' ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)',
                color: role === 'gamer' ? '#fff' : 'var(--text-muted)',
              }}>🎮 Gamer</button>

              <button type="button" onClick={() => setRole('developer')} style={{
                flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                border: role === 'developer' ? '2px solid #FFB000' : '1px solid var(--border-color)',
                background: role === 'developer' ? 'rgba(255,176,0,0.12)' : 'rgba(255,255,255,0.03)',
                color: role === 'developer' ? '#fff' : 'var(--text-muted)',
              }}>🛠️ Indie Developer</button>
            </div>

            {role === 'developer' && (
              <div style={{
                marginTop: '10px', padding: '10px 14px', borderRadius: '6px',
                background: 'rgba(255,176,0,0.07)', border: '1px solid rgba(255,176,0,0.25)',
                fontSize: '0.8rem', color: '#FFB000', display: 'flex', gap: '8px',
              }}>
                <span>⚠️</span>
                <span>Developer accounts require <strong>admin approval</strong>. You'll receive an email once approved.</span>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Display Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input type="text" placeholder="PixelWarrior_99" value={name} onChange={(e) => setName(e.target.value)} className="input-field" style={{ paddingLeft: '38px' }} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input type="email" placeholder="pixel@gamer.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '38px' }} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password (min 6 chars) *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: '38px' }} minLength={6} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Country / Region *</label>
            <div style={{ position: 'relative' }}>
              <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" style={{ paddingLeft: '38px', background: 'rgba(8,14,9,0.95)', cursor: 'pointer' }} required>
                <option value="United States" style={{ background: 'var(--bg-dark)' }}>United States (USD $)</option>
                <option value="India" style={{ background: 'var(--bg-dark)' }}>India (INR ₹)</option>
                <option value="United Kingdom" style={{ background: 'var(--bg-dark)' }}>United Kingdom (USD $)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Short Bio</label>
            <textarea placeholder="Tell the community about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} className="input-field" rows={2} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', height: '44px' }}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: '#FF6B00', fontWeight: 600 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}
