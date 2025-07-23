import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Truck, 
  Flame,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchLowStock();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real app, you'd fetch these from your API
      // For now, we'll use mock data
      setStats({
        totalUsers: 25,
        totalOrders: 150,
        totalProducts: 12,
        totalRevenue: 450000
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await productsAPI.getAll();
      const products = res.data.products || res.data;
      setLowStock(products.filter(p => p.stockQuantity < 5 && p.approvalStatus === 'approved'));
    } catch (err) {
      setLowStock([]);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      link: '/admin/orders'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all registered users',
      icon: UserCheck,
      link: '/admin/users',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Manage Orders',
      description: 'Track and update order statuses',
      icon: Truck,
      link: '/admin/orders',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove gas cylinders',
      icon: Flame,
      link: '/admin/products',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Sales reports and analytics',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Low Stock Alerts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-red-700 mb-2 flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" /> Low Stock Alerts
          </h2>
          {lowStock.length === 0 ? (
            <div className="text-gray-500 text-sm">No low stock products.</div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="divide-y divide-red-100">
                {lowStock.map(p => (
                  <li key={p._id} className="py-2 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{p.name} ({p.brand}, {p.cylinderSize})</span>
                    <span className="text-red-700 font-bold">Stock: {p.stockQuantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.name || 'Admin'}! Here's what's happening with your gas cylinder business.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover:shadow-lg transition-shadow duration-200 p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{1000 + index}</p>
                      <p className="text-sm text-gray-500">Customer {index + 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">KES {(index + 1) * 2500}</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/orders"
                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
              >
                View all orders
                <TrendingUp className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">User {index + 1}</p>
                      <p className="text-sm text-gray-500">user{index + 1}@example.com</p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/users"
                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
              >
                View all users
                <TrendingUp className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 