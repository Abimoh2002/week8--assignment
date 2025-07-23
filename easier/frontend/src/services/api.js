import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL 
  
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products?limit=20'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  approve: (id) => api.post(`/products/${id}/approve`),
  reject: (id) => api.post(`/products/${id}/reject`),
  
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  delete: (id) => api.delete(`/orders/${id}`),
  getMyOrders: () => api.get('/users/orders'), // Fixed: Use correct user orders endpoint
};

// Cart API - Fixed to use correct endpoints
export const cartAPI = {
  getCart: () => api.get('/orders/cart'),
  addToCart: (productId, quantity) => api.post('/orders/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/orders/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/orders/cart/${itemId}`),
  clearCart: () => api.delete('/orders/cart'),
  checkout: () => api.post('/orders/cart/checkout'),
};

// Users API (Admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api; 