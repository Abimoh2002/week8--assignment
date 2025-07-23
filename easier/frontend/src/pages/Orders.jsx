import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProductImage } from '../assets/images';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      console.log('Orders response:', response.data); // Debug log
      
      // Handle both response formats: { orders: [...] } or just [...]
      const ordersData = response.data.orders || response.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Set empty array instead of leaving undefined
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your gas cylinder orders</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-gray-50 text-gray-700"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-gray-50 text-gray-700"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No orders found</p>
            <p className="text-gray-400">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="text-gray-400 font-normal">Order</span> #{order.orderNumber || order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {/* Show who ordered if available */}
                    {order.customer && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-semibold">Ordered by:</span> {order.customer.name || order.customer.email || 'N/A'}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)} cursor-pointer`} title={`Status: ${order.status}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm bg-gray-100 rounded p-2 border border-gray-200">
                        <img 
                          src={getProductImage(item.product?.name)} 
                          alt={item.product?.name} 
                          className="w-10 h-10 object-cover rounded border border-gray-300" 
                        />
                        <span className="text-gray-800 font-medium">{item.product?.name || 'Product'}</span>
                        {/* Show gas type (brand + size) if available */}
                        {item.product?.brand && item.product?.cylinderSize && (
                          <span className="text-gray-500 ml-2">{item.product.brand} - {item.product.cylinderSize}</span>
                        )}
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        {item.product?.price && (
                          <span className="text-gray-500 ml-auto">KES {item.product.price.toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-200 pt-4 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm text-gray-800">KES {order.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Delivery:</span>
                    <span className="text-sm text-gray-800">KES {order.deliveryFee?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm text-gray-800">{order.paymentMethod || 'M-Pesa'}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Delivery Address:</span>
                      <span className="text-sm text-gray-800 text-right">{order.deliveryAddress}</span>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Est. Delivery:</span>
                      <span className="text-sm text-gray-800">{order.estimatedDelivery}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="font-bold text-lg text-gray-800">KES {order.total?.toLocaleString() || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <button className="text-slate-600 hover:text-slate-800 flex items-center text-sm font-medium border border-slate-400 px-4 py-2 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 