import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { register } = useAuth();

   // Form validation
    const validateForm = () =>{
      const newErrors= {};
      if (!formData.name.trim()) 
        {newErrors.name = 'Name is required';}

      if (!formData.email.trim()) 
        {newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.phonenumber.trim()) 
        {newErrors.phonenumber = 'Phone number is required';}
      if (!formData.password.trim()) 
        {newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      if( formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
      
    };
        
  const handleSubmit = async (e) => {
    e.preventDefault();
     if( !validateForm()) {
      return;
    }
     setIsLoading(true); 

     const { confirmPassword: _confirmPassword, ...registrationData } = formData; 
     const result = await register(registrationData);

     if (result.success) {
      setIsRotating(true);
        setTimeout(() => {
          setIsRotating(false);
        navigate('/products');
        }, 800);
     } 
     setIsLoading(false);
    
  };

  const handleInputChange = (e) => {
    setFormData( (prev) => ({
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className={`card-blur p-8 animate-fade-in ${isRotating ? 'animate-rotate-y' : ''}`}>
          <div className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="rainbow-gradient-bg p-3 rounded-full">
                <Flame className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Join <span className="rainbow-gradient">Mobigas</span>
            </h1>
            <p className="text-gray-300 mt-2">Create your account to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="form-label text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.name && <p className="error-text text-red-400">{errors.name}</p>}
            </div>

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
                />
              </div>
              {errors.email && <p className="error-text text-red-400">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phonenumber" className="form-label text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 ${errors.phonenumber ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.phonenumber && <p className="error-text text-red-400">{errors.phonenumber}</p>}
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-text text-red-400">{errors.confirmPassword}</p>}
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded border-gray-600 bg-gray-800/50" 
                required 
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-orange-400 hover:text-orange-300">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-orange-400 hover:text-orange-300">
                  Privacy Policy
                </Link>
              </label>
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
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 