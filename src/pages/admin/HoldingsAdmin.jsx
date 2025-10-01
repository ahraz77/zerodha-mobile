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

function HoldingForm({ holding, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(holding || {
    name: '',
    qty: '',
    avg: '',
    invested: '',
    pct: '',
    change: '',
    ltp: '',
    ltpPct: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate invested amount if not provided
    const qty = parseFloat(formData.qty) || 0;
    const avg = parseFloat(formData.avg) || 0;
    const calculatedInvested = (qty * avg).toFixed(2);
    
    const submissionData = {
      ...formData,
      qty: parseInt(formData.qty) || 0,
      invested: formData.invested || calculatedInvested
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
            {holding ? 'Edit Holding' : 'Add New Holding'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., RELIANCE"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => handleChange('qty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invested Amount</label>
              <input
                type="text"
                value={formData.invested}
                onChange={(e) => handleChange('invested', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Auto-calculated if empty"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">P&L %</label>
                <input
                  type="text"
                  value={formData.pct}
                  onChange={(e) => handleChange('pct', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+5.03%"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">P&L Amount</label>
                <input
                  type="text"
                  value={formData.change}
                  onChange={(e) => handleChange('change', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+6.70"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LTP</label>
                <input
                  type="text"
                  value={formData.ltp}
                  onChange={(e) => handleChange('ltp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="70.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LTP %</label>
                <input
                  type="text"
                  value={formData.ltpPct}
                  onChange={(e) => handleChange('ltpPct', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="-0.57%"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {holding ? 'Update' : 'Add'} Holding
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

function HoldingsAdmin() {
  const { holdings, addHolding, updateHolding, deleteHolding } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [editingHolding, setEditingHolding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHoldings = holdings.filter(holding =>
    holding.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingHolding(null);
    setShowForm(true);
  };

  const handleEdit = (holding) => {
    setEditingHolding(holding);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingHolding) {
        await updateHolding(editingHolding._id, formData);
      } else {
        await addHolding(formData);
      }
      setShowForm(false);
      setEditingHolding(null);
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save holding: ' + error.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHolding(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holding?')) {
      try {
        await deleteHolding(id);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete holding: ' + error.message);
      }
    }
  };

  const getPnlColor = (value) => {
    if (value.startsWith('+')) return 'text-green-600';
    if (value.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Holdings Management</h2>
          <p className="text-gray-600">Manage portfolio holdings data</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Icon name="plus" className="w-5 h-5" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Search holdings..."
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Total Holdings</div>
          <div className="text-2xl font-bold text-gray-900">{holdings.length}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500">Total Invested</div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{holdings.reduce((sum, h) => sum + parseFloat(h.invested.replace(/,/g, '')), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty & Avg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoldings.map((holding) => (
                <tr key={holding._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{holding.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Qty: {holding.qty}</div>
                    <div className="text-sm text-gray-500">Avg: ₹{holding.avg}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">₹{holding.invested}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getPnlColor(holding.pct)}`}>{holding.pct}</div>
                    <div className={`text-sm ${getPnlColor(holding.change)}`}>{holding.change}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">₹{holding.ltp}</div>
                    <div className={`text-sm ${getPnlColor(holding.ltpPct)}`}>{holding.ltpPct}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(holding)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Icon name="edit-2" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(holding._id)}
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
          
          {filteredHoldings.length === 0 && (
            <div className="text-center py-12">
              <Icon name="inbox" className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No holdings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first holding.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Icon name="plus" className="w-5 h-5" />
                  <span>Add First Holding</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <HoldingForm
          holding={editingHolding}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default HoldingsAdmin;