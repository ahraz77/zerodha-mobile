import React, { useState } from 'react';
import feather from 'feather-icons';
import { useAdminData } from './AdminDashboard.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function PositionForm({ position, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(position || {
    symbol: '',
    segment: '',
    qty: '',
    avg: '',
    product: '',
    pnl: '',
    ltp: ''
  });

  const segments = ['CDS', 'MCX', 'NFO', 'NSE', 'BSE'];
  const products = ['NRML', 'MIS', 'CNC', 'CO', 'BO'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      qty: parseInt(formData.qty) || 0
    };
    
    onSubmit(submissionData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {position ? 'Edit Position' : 'Add New Position'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., USDINR23JUNFUT"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                <select
                  value={formData.segment}
                  onChange={(e) => handleChange('segment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Segment</option>
                  {segments.map(segment => (
                    <option key={segment} value={segment}>{segment}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={formData.product}
                  onChange={(e) => handleChange('product', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => handleChange('qty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0 (use negative for sell)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Price</label>
                <input
                  type="text"
                  value={formData.avg}
                  onChange={(e) => handleChange('avg', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">P&L</label>
                <input
                  type="text"
                  value={formData.pnl}
                  onChange={(e) => handleChange('pnl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+100.00 or -50.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LTP</label>
                <input
                  type="text"
                  value={formData.ltp}
                  onChange={(e) => handleChange('ltp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {position ? 'Update' : 'Add'} Position
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PositionsAdmin() {
  const { positions, addPosition, updatePosition, deletePosition } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('');

  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = !filterSegment || position.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const handleAddNew = () => {
    setEditingPosition(null);
    setShowForm(true);
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPosition) {
        await updatePosition(editingPosition._id, formData);
      } else {
        await addPosition(formData);
      }
      setShowForm(false);
      setEditingPosition(null);
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save position: ' + error.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPosition(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await deletePosition(id);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete position: ' + error.message);
      }
    }
  };

  const getPnlColor = (value) => {
    if (value.startsWith('+')) return 'text-green-600';
    if (value.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getQtyColor = (qty) => {
    if (qty > 0) return 'text-blue-600';
    if (qty < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const segments = [...new Set(positions.map(p => p.segment))];
  const totalPnl = positions.reduce((sum, p) => {
    const pnl = parseFloat(p.pnl.replace(/[+,]/g, ''));
    return sum + pnl;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Positions Management</h2>
          <p className="text-gray-600">Manage trading positions data</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Icon name="plus" className="w-5 h-5" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Search positions..."
            />
          </div>
        </div>
        
        <div>
          <select
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Segments</option>
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Total Positions</div>
          <div className="text-2xl font-bold text-gray-900">{positions.length}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Total P&L</div>
          <div className={`text-2xl font-bold ${getPnlColor(totalPnl >= 0 ? '+' : '-')}`}>
            ₹{totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty & Avg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPositions.map((position) => (
                <tr key={position._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{position.symbol}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {position.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getQtyColor(position.qty)}`}>
                      Qty: {position.qty}
                    </div>
                    <div className="text-sm text-gray-500">Avg: {position.avg}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {position.product}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getPnlColor(position.pnl)}`}>
                      ₹{position.pnl}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">₹{position.ltp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(position)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Icon name="edit-2" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(position._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Icon name="trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <Icon name="trending-up" className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterSegment ? 'Try adjusting your search or filter.' : 'Get started by adding your first position.'}
              </p>
              {!searchTerm && !filterSegment && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Icon name="plus" className="w-5 h-5" />
                  <span>Add First Position</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PositionForm
          position={editingPosition}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default PositionsAdmin;