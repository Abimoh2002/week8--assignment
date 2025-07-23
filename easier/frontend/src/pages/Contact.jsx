import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../assets/images';

export default function Cart() {
  const [step, setStep] = useState(1);
  const [emptyCylinderConfirm, setEmptyCylinderConfirm] = useState(false);
  const [deliveryType, setDeliveryType] = useState('ASAP');
  const [scheduledDate, setScheduledDate] = useState('');
  const navigate = useNavigate();
  const { 
    cart, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    checkout 
  } = useCart();

  // Stepper logic
  const hasEmptyCylinder = cart.items?.some(item => item.product?.emptyCylinderExchange);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const handleProceed = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (hasEmptyCylinder && !emptyCylinderConfirm) {
        toast.error('Please confirm empty cylinder return policy.');
        return;
      }
      if (deliveryType === 'Scheduled' && !scheduledDate) {
        toast.error('Please select a delivery date.');
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order with compliance info
      await checkout({
        emptyCylinderReturned: hasEmptyCylinder ? emptyCylinderConfirm : false,
        deliveryType,
        scheduledDate: deliveryType === 'Scheduled' ? scheduledDate : null
      });
      toast.success('Order placed!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (loading && cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper UI */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>1 <span>Cart</span></div>
          <div className="h-1 w-8 bg-gray-300 rounded" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>2 <span>Compliance & Delivery</span></div>
          <div className="h-1 w-8 bg-gray-300 rounded" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>3 <span>Confirm</span></div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                    <button
                      onClick={handleClearCart}
                      className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                      disabled={loading}
                    >
                      Clear Cart
                    </button>
                  </div>
                  <div className="space-y-4">
                    {cart.items?.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 border border-gray-200">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                                                  <img
                          src={getProductImage(item.product?.name) || 'https://via.placeholder.com/80x80?text=Gas+Cylinder'}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                        />
                        </div>
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-800 truncate">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {item.product?.description}
                          </p>
                          <p className="text-lg font-semibold text-gray-800 mt-1">
                            KES {item.product?.price?.toLocaleString()}
                          </p>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                            disabled={loading || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                            disabled={loading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="ml-4 text-slate-500 hover:text-slate-700"
                          disabled={loading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cart.items?.length || 0} items):</span>
                      <span className="text-gray-800">KES {cart.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="text-gray-800">KES {cart.deliveryFee?.toLocaleString() || 0}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-xl text-gray-800">KES {cart.total?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-slate-600 hover:bg-slate-700 text-white w-full py-3 text-lg mb-3 rounded-lg"
                    disabled={loading || cart.items?.length === 0}
                    onClick={handleProceed}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="small" className="mr-2" />
                        Updating...
                      </span>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                  <a
                    href="/products"
                    className="block text-center text-slate-600 hover:text-slate-800 text-sm mt-2"
                  >
                    &larr; Continue Shopping
                  </a>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Free delivery on orders over KES 5,000. Estimated delivery: 1-2 days in Nairobi, 2-4 days nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Compliance & Delivery */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Compliance & Delivery</h2>
              
              {/* Empty Cylinder Exchange */}
              {hasEmptyCylinder && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Empty Cylinder Exchange</h3>
                  <p className="text-orange-700 text-sm mb-3">
                    Some items in your cart require empty cylinder exchange. Please confirm you have empty cylinders to return.
                  </p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emptyCylinderConfirm}
                      onChange={(e) => setEmptyCylinderConfirm(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-orange-800">
                      I confirm I have empty cylinders to return for exchange
                    </span>
                  </label>
                </div>
              )}

              {/* Delivery Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Delivery Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="ASAP"
                      checked={deliveryType === 'ASAP'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="mr-2"
                    />
                    <span>As Soon As Possible (1-2 days)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="Scheduled"
                      checked={deliveryType === 'Scheduled'}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="mr-2"
                    />
                    <span>Schedule for specific date</span>
                  </label>
                </div>
                
                {deliveryType === 'Scheduled' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Confirmation</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
                  <div className="text-sm text-gray-600">
                    <p>Total Items: {cart.items?.length || 0}</p>
                    <p>Total Amount: KES {cart.total?.toLocaleString() || 0}</p>
                    <p>Delivery: {deliveryType === 'Scheduled' ? `Scheduled for ${scheduledDate}` : 'ASAP'}</p>
                    {hasEmptyCylinder && (
                      <p>Empty Cylinder Exchange: {emptyCylinderConfirm ? 'Confirmed' : 'Not confirmed'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Placing Order...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 