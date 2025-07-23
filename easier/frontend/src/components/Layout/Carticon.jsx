import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { cartItemCount } = useCart();

  return (
    <Link to="/cart" className="relative inline-flex items-center p-2 text-gray-700 hover:text-slate-600 transition-colors">
      <ShoppingCart className="h-6 w-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </span>
      )}
    </Link>
  );
} 