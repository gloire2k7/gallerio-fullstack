import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const verifyToken = async () => {
      if (!token || isVerifying) return;
      
      setIsVerifying(true);
      try {
        const userData = await authService.verifyToken(token);
        if (isMounted) {
          const userInfo = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            username: userData.username
          };
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        if (isMounted) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (!response.token) {
        throw new Error(response.message || 'Login failed');
      }
      const userData = {
        id: response.id,
        email: response.email,
        role: response.role,
        username: response.username
      };
      setUser(userData);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      // Redirect based on role
      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (response.role === 'ARTIST') {
        navigate('/artist/dashboard');
      } else {
        navigate('/collector/gallery');
      }
    } catch (error) {
      // Pass up backend error message if available
      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Debug log to check user state
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isVerifying }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 