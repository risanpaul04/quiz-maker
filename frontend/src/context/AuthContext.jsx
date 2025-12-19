import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await authAPI.signup({ username, email, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (error) {
      // ignore network/logout errors — still clear local state
    }

  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};