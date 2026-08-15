import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Pin, Send, User, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function ForumSection({ gameId, gameTitle }) {
  const { user } = useAuth();
  const toast = useToast();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Thread Form state
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  // Reply Form state
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, [gameId]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/forums/game/${gameId}`);
      setThreads(res.data.threads);
    } catch (err) {
      console.error('Failed to fetch forum threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenThread = async (thread) => {
    setActiveThread(thread);
    try {
      const res = await axios.get(`/api/forums/thread/${thread._id}`);
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch thread posts:', err);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`/api/forums/game/${gameId}`, {
        title: newThreadTitle,
        content: newThreadContent
      });
      setNewThreadTitle('');
      setNewThreadContent('');
      setIsCreatingThread(false);
      fetchThreads();
      handleOpenThread(res.data.thread);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create thread', 'Thread Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThread) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`/api/forums/thread/${activeThread._id}/reply`, {
        content: replyContent
      });
      setPosts(prev => [...prev, res.data.post]);
      setReplyContent('');
      setActiveThread(prev => ({ ...prev, postCount: prev.postCount + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post reply', 'Reply Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare color="var(--primary-cyan)" size={22} /> Community Forum: {gameTitle}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Discuss strategies, lore, updates, and feedback directly with developers and fellow gamers.
          </p>
        </div>

        {activeThread ? (
          <button
            onClick={() => setActiveThread(null)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back to All Threads
          </button>
        ) : (
          user && (
            <button
              onClick={() => setIsCreatingThread(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Start New Discussion
            </button>
          )
        )}
      </div>

      {/* New Thread Form Modal */}
      {isCreatingThread && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', borderColor: 'var(--primary-cyan)' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', marginBottom: '14px' }}>
            Create New Discussion Thread
          </h3>
          <form onSubmit={handleCreateThread} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Thread Title (e.g. Secret area in Level 3?)"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="input-field"
              required
            />
            <textarea
              placeholder="Write your main post thoughts..."
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              className="input-field"
              rows={4}
              required
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsCreatingThread(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Publishing...' : 'Publish Thread'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW THREAD DETAILS */}
      {activeThread ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              {activeThread.pinned && (
                <span className="badge-featured" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Pin size={12} /> PINNED
                </span>
              )}
              <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.5rem' }}>
                {activeThread.title}
              </h2>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', gap: '16px' }}>
              <span>Started by <strong style={{ color: '#fff' }}>{activeThread.authorName}</strong></span>
              <span>{new Date(activeThread.createdAt).toLocaleDateString()}</span>
              <span>{activeThread.postCount} replies</span>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              {activeThread.content}
            </div>
          </div>

          {/* Posts List */}
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.1rem', marginTop: '10px' }}>
            Replies ({posts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map((post, idx) => (
              <div key={post._id || idx} className="glass-card" style={{ padding: '16px 20px', marginLeft: idx === 0 ? '0' : '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80'}
                      alt={post.authorName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-cyan)' }}>
                      {post.authorName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {post.content}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input Box */}
          {user ? (
            <form onSubmit={handlePostReply} className="glass-card" style={{ padding: '16px', marginTop: '10px' }}>
              <h4 style={{ color: '#fff', marginBottom: '10px', fontSize: '0.95rem' }}>Post a Reply</h4>
              <textarea
                placeholder="Share your thoughts or answer..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="input-field"
                rows={3}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                  <Send size={14} /> {submitting ? 'Posting...' : 'Send Reply'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Log in to join the discussion and post replies.
            </div>
          )}
        </div>
      ) : (
        /* THREADS LIST */
        <div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading discussion threads...</div>
          ) : threads.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                No active discussions yet for {gameTitle}. Be the first to open a thread!
              </p>
              {user && (
                <button onClick={() => setIsCreatingThread(true)} className="btn-primary">
                  Start First Discussion
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {threads.map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleOpenThread(t)}
                  className="glass-card"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderColor: t.pinned ? 'var(--primary-magenta)' : undefined
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {t.pinned && <Pin size={14} color="var(--primary-magenta)" />}
                      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                        {t.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '14px' }}>
                      <span>By {t.authorName}</span>
                      <span>Last activity: {new Date(t.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--primary-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MessageSquare size={14} /> {t.postCount || 1} posts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
