import React, { useState, useEffect } from 'react';
import BrandProductCard from '../components/BrandProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Products() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  // Fetch products from backend and handle search from URL
  useEffect(() => {
    fetchProducts();
    
    // Handle search query from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      // Handle the API response structure: { products, totalPages, currentPage, total }
      const productsData = response.data.products || response.data;
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data if API fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredProducts = products.filter(product => {
    const q = search.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.brand?.toLowerCase().includes(q) ||
      product.gasType?.toLowerCase().includes(q) ||
      product.cylinderSize?.toLowerCase().includes(q)
    );
  });

  // Add to cart handler
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  // Order now handler
  const handleOrderNow = (product) => {
    toast.success(`${product.name} ordered!`);
    navigate('/contact');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">LPG Gas Cylinders</h1>
            <p className="text-gray-600">Browse and order certified LPG cylinders. All products are EPRA certified and safety compliant.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <input
              type="text"
              placeholder="Search by brand, type, or size..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Please try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <BrandProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onOrderNow={() => handleOrderNow(product)}
                loading={cartLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 