import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      try {
        // Verify token validity with backend
        const response = await authAPI.getMe();
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Expecting { token, user } structure from API
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Logged in successfully');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Login failed. Please try again.';
      
      console.error('Login error:', error);
      logout(); // Clear any partial auth state
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      // Remove redundant phonenumber assignment
      const response = await authAPI.register(userData);
      
      // Expecting { token, user } structure from API
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid registration response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Account created successfully');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Registration failed. Please try again.';
      
      console.error('Registration error:', error);
      logout(); // Clear any partial auth state
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Optional: Token refresh logic
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshToken,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};