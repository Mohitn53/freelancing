// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('dropcode_token'));

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const res = await profileApi.get();
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err.message);
          // logout only if token is expired/invalid (401)
          if (err.message.includes('401') || err.message.toLowerCase().includes('token')) {
             handleLogout();
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('dropcode_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('dropcode_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
