import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('indie_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('indie_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setUser(null);
      localStorage.removeItem('indie_user');
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('indie_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('User session check warning:', err.response?.data?.error || err.message);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const newToken = res.data.token;
    const userData = res.data.user;
    
    localStorage.setItem('indie_token', newToken);
    localStorage.setItem('indie_user', JSON.stringify(userData));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);

    // Developer pending approval — no token issued, don't log them in
    if (res.data.pending) {
      return res.data; // just return so Register.jsx can show the pending screen
    }

    const newToken = res.data.token;
    const userRes  = res.data.user;

    localStorage.setItem('indie_token', newToken);
    localStorage.setItem('indie_user', JSON.stringify(userRes));

    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userRes);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('indie_token');
    localStorage.removeItem('indie_user');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  const toggleWishlist = async (gameId) => {
    if (!user) return false;
    try {
      const res = await axios.post(`/api/auth/wishlist/${gameId}`);
      const updatedSaved = res.data.savedGames;
      setUser(prev => {
        const nextUser = { ...prev, savedGames: updatedSaved };
        localStorage.setItem('indie_user', JSON.stringify(nextUser));
        return nextUser;
      });
      return res.data.isSaved;
    } catch (err) {
      console.error('Wishlist error:', err);
      return false;
    }
  };

  // Country & Currency Localization Support
  const [guestCountry, setGuestCountry] = useState(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && (tz.includes('Kolkata') || tz.includes('India') || tz.startsWith('Asia/Calcutta'))) {
        return 'India';
      }
      if (tz && (tz.includes('London') || tz.includes('GB') || tz.startsWith('Europe/London'))) {
        return 'United Kingdom';
      }
    } catch (e) {
      console.warn('Timezone detection error:', e);
    }
    return 'United States';
  });

  const activeCountry = user?.country || guestCountry;

  const setCountryPref = (countryName) => {
    if (user) {
      setUser(prev => {
        const nextUser = { ...prev, country: countryName };
        localStorage.setItem('indie_user', JSON.stringify(nextUser));
        return nextUser;
      });
      // Try updating user profile on backend if backend endpoint exists
      axios.put('/api/auth/profile', { country: countryName }).catch(() => {});
    } else {
      setGuestCountry(countryName);
    }
  };

  const formatPrice = (usdPrice) => {
    if (usdPrice === 0 || usdPrice === 'FREE') return 'FREE';
    const parsedPrice = parseFloat(usdPrice);
    if (isNaN(parsedPrice)) return usdPrice;

    if (activeCountry === 'India') {
      // 1 USD = 83 INR
      return `₹${(parsedPrice * 83).toFixed(2)}`;
    }
    // United Kingdom (as requested, shows Dollar) & United States / others show Dollar
    return `$${parsedPrice.toFixed(2)}`;
  };

  const setSession = (newToken, userData) => {
    localStorage.setItem('indie_token', newToken);
    localStorage.setItem('indie_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
  };

  const updateUser = async (profileData) => {
    const res = await axios.put('/api/auth/profile', profileData);
    if (res.data?.user) {
      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem('indie_user', JSON.stringify(updated));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout,
      setSession, 
      toggleWishlist,
      updateUser,
      activeCountry,
      setCountryPref,
      formatPrice
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
