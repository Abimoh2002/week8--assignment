import React, { useState, useEffect } from 'react';
import { Plus, Upload, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Dialog } from '@headlessui/react';
import Papa from 'papaparse';
import { productsAPI } from '../services/api';

const BRANDS = ['Total', 'K-gas', 'Pro-gas', 'Sky-gas', 'Other'];
const SIZES = ['3kg', '6kg', '12kg', '13kg', '50kg'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    brand: '',
    cylinderSize: '',
    refillPrice: '',
    stockQuantity: '',
    certification: 'EPRA Certified',
    safetyFeatures: '',
  });
  const [formError, setFormError] = useState('');
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Add approvalStatus to mock data
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProducts([
        {
          _id: '1',
          brand: 'Total',
          cylinderSize: '6kg',
          refillPrice: 1500,
          stockQuantity: 10,
          certification: 'EPRA Certified',
          safetyFeatures: ['Valve protection', 'Leak test'],
          approvalStatus: 'approved',
        },
        {
          _id: '2',
          brand: 'K-gas',
          cylinderSize: '13kg',
          refillPrice: 3200,
          stockQuantity: 3,
          certification: 'EPRA Certified',
          safetyFeatures: ['Valve protection'],
          approvalStatus: 'pending',
        },
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve/Reject handlers (API integrated)
  const handleApprove = async (id) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      await productsAPI.approve(id);
      setProducts(products.map(p => p._id === id ? { ...p, approvalStatus: 'approved' } : p));
    } catch (err) {
      alert('Failed to approve product.');
    } finally {
      setActionLoading(l => ({ ...l, [id]: false }));
    }
  };
  const handleReject = async (id) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      await productsAPI.reject(id);
      setProducts(products.map(p => p._id === id ? { ...p, approvalStatus: 'rejected' } : p));
    } catch (err) {
      alert('Failed to reject product.');
    } finally {
      setActionLoading(l => ({ ...l, [id]: false }));
    }
  };

  // Placeholder handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setForm({
      brand: '',
      cylinderSize: '',
      refillPrice: '',
      stockQuantity: '',
      certification: 'EPRA Certified',
      safetyFeatures: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleEditProduct = (id) => {
    const prod = products.find(p => p._id === id);
    if (prod) {
      setEditingProduct(prod);
      setForm({
        brand: prod.brand,
        cylinderSize: prod.cylinderSize,
        refillPrice: prod.refillPrice,
        stockQuantity: prod.stockQuantity,
        certification: prod.certification,
        safetyFeatures: prod.safetyFeatures.join(', '),
      });
      setFormError('');
      setModalOpen(true);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p._id !== id));
    }
  };
  const handleBulkUpload = () => {
    setBulkError('');
    setBulkModalOpen(true);
  };

  const handleBulkFile = (e) => {
    setBulkError('');
    const file = e.target.files[0];
    if (!file) return;
    setBulkLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const required = ['brand', 'cylinderSize', 'refillPrice', 'stockQuantity', 'certification', 'safetyFeatures'];
        for (let row of rows) {
          for (let key of required) {
            if (!row[key]) {
              setBulkError(`Missing field '${key}' in one or more rows.`);
              setBulkLoading(false);
              return;
            }
          }
        }
        // Add products
        const newProducts = rows.map(row => ({
          _id: Date.now().toString() + Math.random(),
          brand: row.brand,
          cylinderSize: row.cylinderSize,
          refillPrice: Number(row.refillPrice),
          stockQuantity: Number(row.stockQuantity),
          certification: row.certification,
          safetyFeatures: row.safetyFeatures.split(',').map(f => f.trim()).filter(Boolean),
        }));
        setProducts([...newProducts, ...products]);
        setBulkModalOpen(false);
        setBulkLoading(false);
      },
      error: (err) => {
        setBulkError('Failed to parse CSV.');
        setBulkLoading(false);
      }
    });
  };

  const sampleCSV =
    'brand,cylinderSize,refillPrice,stockQuantity,certification,safetyFeatures\n' +
    'Total,6kg,1500,10,EPRA Certified,"Valve protection, Leak test"\n' +
    'K-gas,13kg,3200,3,EPRA Certified,"Valve protection"';

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.brand || !form.cylinderSize || !form.refillPrice || !form.stockQuantity) {
      return 'All fields except safety features are required.';
    }
    if (isNaN(Number(form.refillPrice)) || isNaN(Number(form.stockQuantity))) {
      return 'Refill price and stock must be numbers.';
    }
    return '';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    const newProduct = {
      _id: editingProduct ? editingProduct._id : Date.now().toString(),
      brand: form.brand,
      cylinderSize: form.cylinderSize,
      refillPrice: Number(form.refillPrice),
      stockQuantity: Number(form.stockQuantity),
      certification: form.certification,
      safetyFeatures: form.safetyFeatures.split(',').map(f => f.trim()).filter(Boolean),
    };
    if (editingProduct) {
      setProducts(products.map(p => p._id === editingProduct._id ? newProduct : p));
    } else {
      setProducts([newProduct, ...products]);
    }
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Modal for Add/Edit Product */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
            <Dialog.Title className="text-lg font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</Dialog.Title>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select name="brand" value={form.brand} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                  <option value="">Select brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cylinder Size</label>
                <select name="cylinderSize" value={form.cylinderSize} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                  <option value="">Select size</option>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Refill Price (KES)</label>
                <input name="refillPrice" type="number" value={form.refillPrice} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certification</label>
                <input name="certification" value={form.certification} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Safety Features (comma separated)</label>
                <input name="safetyFeatures" value={form.safetyFeatures} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProduct ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      {/* Modal for Bulk Upload */}
      <Dialog open={bulkModalOpen} onClose={() => setBulkModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
            <Dialog.Title className="text-lg font-bold mb-4">Bulk Upload Products (CSV)</Dialog.Title>
            <div className="space-y-4">
              <input type="file" accept=".csv" onChange={handleBulkFile} className="w-full" />
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleCSV)}`}
                download="sample-products.csv"
                className="text-blue-600 underline text-sm"
              >
                Download sample CSV
              </a>
              {bulkError && <div className="text-red-600 text-sm">{bulkError}</div>}
              {bulkLoading && <LoadingSpinner size="small" />}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setBulkModalOpen(false)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage all LPG products</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button onClick={handleBulkUpload} className="btn-secondary flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload (CSV)
            </button>
            <button onClick={handleAddProduct} className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refill Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.cylinderSize}</td>
                    <td className="px-6 py-4 whitespace-nowrap">KES {product.refillPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={product.stockQuantity < 5 ? 'text-red-600 font-bold' : ''}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.certification}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ul className="list-disc pl-4">
                        {product.safetyFeatures.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        product.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.approvalStatus.charAt(0).toUpperCase() + product.approvalStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                      <button onClick={() => handleEditProduct(product._id)} className="text-blue-600 hover:text-blue-900 mr-2">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 mr-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {product.approvalStatus === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(product._id)} disabled={actionLoading[product._id]} className="text-green-600 hover:text-green-900 border border-green-600 rounded px-2 py-1 text-xs">
                            {actionLoading[product._id] ? 'Approving...' : 'Approve'}
                          </button>
                          <button onClick={() => handleReject(product._id)} disabled={actionLoading[product._id]} className="text-yellow-700 hover:text-yellow-900 border border-yellow-700 rounded px-2 py-1 text-xs">
                            {actionLoading[product._id] ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
} 