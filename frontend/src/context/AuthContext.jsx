import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('civicpulse_token');
    if (token) {
      API.get('/auth/me')
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('civicpulse_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const { token, user: userData } = res.data;
      localStorage.setItem('civicpulse_token', token);
      localStorage.setItem('civicpulse_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, role = 'CITIZEN', departmentId = null, phoneNumber = '') => {
    const res = await API.post('/auth/register', { name, email, password, role, departmentId, phoneNumber });
    if (res.success && res.data) {
      const { token, user: userData } = res.data;
      localStorage.setItem('civicpulse_token', token);
      localStorage.setItem('civicpulse_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('civicpulse_token');
    localStorage.removeItem('civicpulse_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
