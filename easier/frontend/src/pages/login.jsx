import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Flame, LogOut, User, Shield, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, user, isAuthenticated } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  // Show logout success message if coming from logout
  useEffect(() => {
    if (location.state?.fromLogout) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const validationErrors = {};
    if (!formData.email.trim()) validationErrors.email = 'Email is required';
    if (!formData.password.trim()) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData.email, formData.password);

      
      if (result.success) {
        // Clear form on successful login
        setFormData({ email: '', password: '' });
        // Trigger rotation animation
        setIsRotating(true);
        setTimeout(() => {
          setIsRotating(false);
        navigate('/products');
        }, 800);
      } else {
        setErrors({ form: result.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleLogout = () => {
    logout();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
  };

  const handleAdminDemoLogin = () => {
    setFormData({
      email: 'admin@mobigas.com',
      password: 'Admin2024!'
    });
  };

  // If user is already logged in, show a different view
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="w-full max-w-md">
          <div className={`card-blur p-8 animate-bounce-in text-center ${isRotating ? 'animate-rotate-y' : ''}`}>
            <div className="flex justify-center mb-6">
              <div className="rainbow-gradient-bg p-4 rounded-full">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Welcome back, {user?.name || user?.email || 'User'}!
            </h1>
            <p className="text-gray-300 mb-6">
              You are already signed in. Redirecting to products...
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/products')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Products
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-900/50 backdrop-blur-md border border-green-400/30 text-green-300 rounded-lg animate-slide-up">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>Successfully logged out! You can now sign in with a different account.</span>
            </div>
          </div>
        )}

        <div className={`card-blur p-8 animate-fade-in ${isRotating ? 'animate-rotate-y' : ''}`}>
          <div className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="rainbow-gradient-bg p-3 rounded-full">
                <Flame className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to <span className="rainbow-gradient">Mobigas</span>
            </h1>
            <p className="text-gray-300 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-text text-red-400">{errors.email}</p>}
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : ''}`}
                  required
                  minLength="6"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="error-text text-red-400">{errors.password}</p>}
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-800/50" />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            {/* Form Error */}
            {errors.form && (
              <div className="p-3 bg-red-900/50 backdrop-blur-md border border-red-400/30 text-red-300 rounded-lg">
                <p className="text-center">{errors.form}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            {/* Demo Login Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={handleDemoLogin}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Try Demo User
              </button>
              <button 
                type="button"
                onClick={handleAdminDemoLogin}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Try Admin Demo
              </button>
            </div>
          </form>
          
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-center text-sm text-gray-400">
              <p className="mb-2">Need help?</p>
              <div className="space-y-1">
                <Link 
                  to="/contact" 
                  className="block text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/faq" 
                  className="block text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 