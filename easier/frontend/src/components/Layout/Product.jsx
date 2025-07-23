import React from 'react';
import { getProductImage } from '../assets/images';

/**
 * Product component for displaying a single product with image and details.
 * @param {Object} props
 * @param {Object} props.product - The product object (expects name, brand, price, etc.)
 * @param {string} [props.image] - Optional local image import to override product image
 * @param {function} [props.onAddToCart] - Optional handler for add to cart
 * @param {function} [props.onOrderNow] - Optional handler for order now
 */
export default function Product({ product, image, onAddToCart, onOrderNow }) {
  // Get the correct image for this product
  const productImage = image || getProductImage(product.name);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={productImage}
          alt={product.name}
          className="h-20 w-20 object-contain rounded border border-gray-300 bg-gray-50"
        />
        <div>
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <div className="text-sm text-gray-500">{product.brand} &bull; {product.cylinderSize}</div>
          {product.certification && (
            <div className="text-xs text-gray-400 mt-1">{product.certification}</div>
          )}
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {product.safetyFeatures?.map((f, i) => (
          <span key={i} className="inline-flex items-center px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded-full">
            {f}
          </span>
        ))}
      </div>
      <div className="mb-2 text-sm text-gray-600">{product.description}</div>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-lg font-bold text-slate-700">KES {product.price?.toLocaleString()}</span>
        <span className="text-sm text-blue-600">Refill: KES {product.refillPrice?.toLocaleString()}</span>
      </div>
      <div className="mb-2 text-xs text-gray-500">
        {product.emptyCylinderExchange && (
          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2">Empty Cylinder Exchange Required</span>
        )}
        Stock: <span className={product.stockQuantity < 5 ? 'text-red-600 font-bold' : 'text-gray-700'}>{product.stockQuantity}</span>
      </div>
      <div className="flex gap-2 mt-auto">
        {onAddToCart && (
          <button
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            onClick={() => onAddToCart(product)}
            disabled={!product.availability || product.stockQuantity === 0}
          >
            Add to Cart
          </button>
        )}
        {onOrderNow && (
          <button
            className="flex-1 bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            onClick={() => onOrderNow(product)}
            disabled={!product.availability || product.stockQuantity === 0}
          >
            Order Now
          </button>
        )}
      </div>
    </div>
  );
} 