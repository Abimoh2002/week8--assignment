import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    setLoading(true);
    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      console.log('Clearing cart...'); // Debug log
      await cartAPI.clearCart();
      console.log('Cart cleared successfully'); // Debug log
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (checkoutData) => {
    if (!isAuthenticated) {
      throw new Error('Please login to checkout');
    }

    setLoading(true);
    try {
      await cartAPI.checkout(checkoutData);
      await fetchCart(); // Refresh cart after checkout
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart item count
  const cartItemCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    cartItemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 