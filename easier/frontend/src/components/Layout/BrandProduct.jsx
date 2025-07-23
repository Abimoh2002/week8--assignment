import React from 'react';
import { getProductImage } from '../assets/images';

export default function BrandProductCard({ product, onAddToCart, onOrderNow, loading = false }) {
  // Prefer product.imageUrl if available, otherwise use getProductImage
  const productImage = product.imageUrl || getProductImage(product.name || `${product.cylinderSize} ${product.brand}`);
  
  return (
    <div className="bg-white border rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="font-bold text-lg mb-2 text-gray-800 text-center">{product.name}</div>
      
      {/* Image container with proper sizing and fallback */}
      <div className="w-full h-32 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border" style={{minHeight: '128px'}}>
        <img 
          src={productImage} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden items-center justify-center text-gray-400 text-sm fallback-image" style={{width: '100%', height: '100%'}}>
          <div className="text-center w-full">
            <div className="text-2xl mb-1">🛢️</div>
            <div>Gas Cylinder</div>
          </div>
        </div>
      </div>
      
      <div className="text-md font-semibold mb-2 text-gray-700">{product.brand} - {product.cylinderSize}</div>
      <div className="text-blue-700 font-bold text-lg mb-2">KES {product.price?.toLocaleString()}</div>
      <div className="text-gray-600 text-sm mb-4 text-center">{product.description}</div>
      
      {/* Stock status */}
      <div className="text-sm mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
          product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {product.stockQuantity > 10 ? 'In Stock' :
           product.stockQuantity > 0 ? `Low Stock (${product.stockQuantity})` :
           'Out of Stock'}
        </span>
      </div>
      
      {/* Features section - show safety features if available */}
      {product.safetyFeatures && product.safetyFeatures.length > 0 && (
        <ul className="text-xs text-gray-600 mb-4 list-disc list-inside">
          {product.safetyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
        </ul>
      )}
      
      {/* Empty cylinder exchange notice */}
      {product.emptyCylinderExchange && (
        <div className="text-xs text-orange-600 mb-4 text-center">
          ⚠️ Empty cylinder exchange required
        </div>
      )}
      
      <div className="flex gap-3 w-full mt-auto">
        <button
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onAddToCart}
          disabled={loading || product.stockQuantity === 0 || !product.availability}
        >
          {loading ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onOrderNow}
          disabled={product.stockQuantity === 0 || !product.availability}
        >
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Order Now'}
        </button>
      </div>
    </div>
  );
} 