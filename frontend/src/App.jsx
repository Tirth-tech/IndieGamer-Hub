import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GameDetail from './pages/GameDetail';
import AddGame from './pages/AddGame';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const activate = () => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',   // no offset — reveal immediately when in view
        threshold: 0         // fire as soon as even 1px is visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      revealElements.forEach(el => {
        if (!el.classList.contains('active')) {
          observer.observe(el);
        }
      });

      return observer;
    };

    // Run immediately after paint
    const timer = setTimeout(() => {
      const obs = activate();

      // Also watch for new elements added after async data loads
      const mutationObs = new MutationObserver(() => activate());
      mutationObs.observe(document.body, { childList: true, subtree: true });

      return () => {
        obs.disconnect();
        mutationObs.disconnect();
      };
    }, 80);

    return () => clearTimeout(timer);
  }, [location]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/add-game" element={<AddGame />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
