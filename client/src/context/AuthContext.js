import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This calls your backend to get the logged-in user's data
          const userData = await api.get('tourists/me'); 
          setUser(userData);
        } catch (error) {
          console.error("Session expired or invalid. Logging out.", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const userData = await api.get('tourists/me');
    setUser(userData);
  };
  
  const register = async (userData) => {
    const data = await api.post('auth/register', userData);
    localStorage.setItem('token', data.token);
    const newUserData = await api.get('tourists/me');
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, loading, login, register, logout, setUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};