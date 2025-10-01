import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import HoldingsAdmin from './HoldingsAdmin.jsx';
import PositionsAdmin from './PositionsAdmin.jsx';
import OrdersAdmin from './OrdersAdmin.jsx';
import FundsAdmin from './FundsAdmin.jsx';
import ProfileAdmin from './ProfileAdmin.jsx';
import { useData } from '../../context/DataContext.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Re-export useData as useAdminData for backwards compatibility
export const useAdminData = useData;



function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('holdings');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiRequest, refreshData } = useData();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const savedAdminInfo = localStorage.getItem('adminInfo');
    
    if (token && savedAdminInfo) {
      try {
        const adminData = JSON.parse(savedAdminInfo);
        // For now, directly set authentication without backend verification
        // since the token verification endpoint might not exist
        setIsAuthenticated(true);
        setAdminInfo(adminData);
        console.log('Admin session restored from localStorage');
      } catch (error) {
        console.error('Error parsing saved admin info:', error);
        // Clear invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
      }
    }
  }, []);

  const verifyToken = async (token, adminData) => {
    try {
      // Try to verify with backend, but don't fail if endpoint doesn't exist
      const response = await apiRequest('/auth/verify', {
        method: 'POST',
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        setAdminInfo(adminData);
        refreshData(); // Load fresh data after authentication
      }
    } catch (error) {
      console.warn('Token verification failed, but keeping session:', error.message);
      // Even if verification fails, keep the session if token exists
      // This handles cases where the verify endpoint might not be implemented
      setIsAuthenticated(true);
      setAdminInfo(adminData);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success) {
        // Store token and admin info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        
        setIsAuthenticated(true);
        setAdminInfo(response.data.admin);
        setCredentials({ username: '', password: '' });
        
        // Load fresh data after authentication
        refreshData();
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      setIsAuthenticated(false);
      setAdminInfo(null);
      setCredentials({ username: '', password: '' });
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Icon name="shield" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Sign in to manage trading data</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <Icon name="alert-circle" className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter username"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter password"
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Demo credentials:</p>
            <p className="text-xs text-gray-600">Username: <code className="bg-white px-1 rounded">admin</code></p>
            <p className="text-xs text-gray-600">Password: <code className="bg-white px-1 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="settings" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Trading Admin</h1>
                  <p className="text-sm text-gray-500">Portfolio Management System</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Welcome, {adminInfo?.username || 'Admin'}
                  {adminInfo?.lastLogin && (
                    <div className="text-xs text-gray-400">
                      Last login: {new Date(adminInfo.lastLogin).toLocaleString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="log-out" className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              {[
                { key: 'holdings', label: 'Holdings', icon: 'briefcase' },
                { key: 'positions', label: 'Positions', icon: 'trending-up' },
                { key: 'orders', label: 'Orders', icon: 'book-open' },
                { key: 'funds', label: 'Funds', icon: 'dollar-sign' },
                { key: 'profile', label: 'Profile', icon: 'user' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
                {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'holdings' && <HoldingsAdmin />}
          {activeTab === 'positions' && <PositionsAdmin />}
          {activeTab === 'orders' && <OrdersAdmin />}
          {activeTab === 'funds' && <FundsAdmin />}
          {activeTab === 'profile' && <ProfileAdmin />}
        </div>
      </div>
  );
}

export default AdminDashboard;