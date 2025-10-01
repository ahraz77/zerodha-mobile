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

function FundForm({ fund, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(fund || {
    availableMargin: '1,00,000.00',
    availableCash: '1,00,000.00',
    usedMargin: '0.00',
    openingBalance: '1,00,000.00',
    payin: '0.00',
    payout: '0.00',
    span: '0.00',
    deliveryMargin: '0.00',
    exposure: '0.00',
    optionPremium: '0.00',
    collateralLiquid: '0.00',
    collateralEquity: '0.00',
    totalCollateral: '0.00'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {fund ? 'Edit Fund Data' : 'Add Fund Data'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Available Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Margin
                </label>
                <input
                  type="text"
                  value={formData.availableMargin}
                  onChange={(e) => handleChange('availableMargin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1,00,000.00"
                />
              </div>

              {/* Available Cash */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Cash
                </label>
                <input
                  type="text"
                  value={formData.availableCash}
                  onChange={(e) => handleChange('availableCash', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1,00,000.00"
                />
              </div>

              {/* Used Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Used Margin
                </label>
                <input
                  type="text"
                  value={formData.usedMargin}
                  onChange={(e) => handleChange('usedMargin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Opening Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Balance
                </label>
                <input
                  type="text"
                  value={formData.openingBalance}
                  onChange={(e) => handleChange('openingBalance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1,00,000.00"
                />
              </div>

              {/* Payin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payin
                </label>
                <input
                  type="text"
                  value={formData.payin}
                  onChange={(e) => handleChange('payin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Payout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout
                </label>
                <input
                  type="text"
                  value={formData.payout}
                  onChange={(e) => handleChange('payout', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* SPAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SPAN
                </label>
                <input
                  type="text"
                  value={formData.span}
                  onChange={(e) => handleChange('span', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Delivery Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Margin
                </label>
                <input
                  type="text"
                  value={formData.deliveryMargin}
                  onChange={(e) => handleChange('deliveryMargin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Exposure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exposure
                </label>
                <input
                  type="text"
                  value={formData.exposure}
                  onChange={(e) => handleChange('exposure', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Option Premium */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option Premium
                </label>
                <input
                  type="text"
                  value={formData.optionPremium}
                  onChange={(e) => handleChange('optionPremium', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Collateral (Liquid funds) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collateral (Liquid funds)
                </label>
                <input
                  type="text"
                  value={formData.collateralLiquid}
                  onChange={(e) => handleChange('collateralLiquid', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Collateral (Equity) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collateral (Equity)
                </label>
                <input
                  type="text"
                  value={formData.collateralEquity}
                  onChange={(e) => handleChange('collateralEquity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Total Collateral */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Collateral
                </label>
                <input
                  type="text"
                  value={formData.totalCollateral}
                  onChange={(e) => handleChange('totalCollateral', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {fund ? 'Update Fund' : 'Add Fund'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
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

function FundsAdmin() {
  const { funds, addFund, updateFund, deleteFund, loading } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFund = () => {
    setEditingFund(null);
    setShowForm(true);
  };

  const handleEditFund = (fund) => {
    setEditingFund(fund);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsProcessing(true);
    try {
      if (editingFund) {
        await updateFund(editingFund._id, formData);
      } else {
        await addFund(formData);
      }
      setShowForm(false);
      setEditingFund(null);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error saving fund data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fund data?')) {
      setIsProcessing(true);
      try {
        await deleteFund(id);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting fund data. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFund(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading funds data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Funds Management</h2>
        <button
          onClick={handleAddFund}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Add Fund Data</span>
        </button>
      </div>

      {/* Funds Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Cash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opening Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funds.map((fund) => (
                <tr key={fund._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{fund.availableMargin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{fund.availableCash}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{fund.usedMargin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{fund.openingBalance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditFund(fund)}
                        disabled={isProcessing}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        title="Edit"
                      >
                        <Icon name="edit-2" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fund._id)}
                        disabled={isProcessing}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
        </div>

        {funds.length === 0 && (
          <div className="text-center py-12">
            <Icon name="database" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funds data</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first fund entry.</p>
            <button
              onClick={handleAddFund}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Fund Data
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <FundForm
          fund={editingFund}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default FundsAdmin;