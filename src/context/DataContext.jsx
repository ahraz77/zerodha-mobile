import React, { createContext, useContext, useState, useEffect } from 'react';

// Data Context
const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API helper function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  console.log(`🔑 Token being sent:`, token ? `${token.substring(0, 20)}...` : 'No token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`📡 API Response [${response.status}]:`, data);
    
    if (!response.ok) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, error);
    throw error;
  }
};

// Initial fallback data (in case API is unavailable)
const initialHoldings = [
  { _id: '1', name: 'ALEMBICLTD', qty: 2, avg: '66.65', invested: '133.30', pct: '+5.03%', change: '+6.70', ltp: '70.00', ltpPct: '-0.57%' },
  { _id: '2', name: 'BHEL', qty: 43, avg: '64.92', invested: '2,791.85', pct: '+26.76%', change: '+747.05', ltp: '82.30', ltpPct: '0.91%' },
  { _id: '3', name: 'GAIL', qty: 16, avg: '98.17', invested: '1,570.75', pct: '+12.05%', change: '+189.25', ltp: '110.00', ltpPct: '-1.52%' },
  { _id: '4', name: 'IDEA', qty: 11, avg: '6.98', invested: '76.80', pct: '+1.26%', change: '+0.97', ltp: '7.07', ltpPct: '-3.81%' }
];

const initialPositions = [
  { _id: '1', symbol: 'USDINR23JUNFUT', segment: 'CDS', qty: -1, avg: '82.0375', product: 'NRML', pnl: '-200.0000', ltp: '0.00' },
  { _id: '2', symbol: 'USDINR23MAYFUT', segment: 'CDS', qty: 1, avg: '82.1625', product: 'NRML', pnl: '-42.5000', ltp: '0.00' },
  { _id: '3', symbol: 'GOLDPETAL23MAYFUT', segment: 'MCX', qty: 1, avg: '6,134.00', product: 'NRML', pnl: '+4.00', ltp: '0.00' },
  { _id: '4', symbol: 'NIFTY2351118700CE', segment: 'NFO', qty: -50, avg: '1.65', product: 'NRML', pnl: '-50.00', ltp: '0.00' },
  { _id: '5', symbol: 'NIFTY2351118750CE', segment: 'NFO', qty: 50, avg: '1.45', product: 'NRML', pnl: '-12.50', ltp: '0.00' }
];

const initialOrders = [
  { _id: '1', type: 'SELL', symbol: 'PNB', qty: 1, status: 'REJECTED', price: '0.00', trigger: '48.50', exchange: 'NSE', product: 'CO', orderType: 'SL-M', time: '13:39:11', ltp: '0.00' },
  { _id: '2', type: 'BUY', symbol: 'INFY', qty: 1, status: 'OPEN', price: '49.50', trigger: '48.50', exchange: 'NSE', product: 'CO', orderType: 'LIMIT', time: '13:39:12', ltp: '0.00' },
  { _id: '3', type: 'BUY', symbol: 'USDINR23MAYFUT', qty: 1, status: 'OPEN', price: '81.0000', trigger: '', exchange: 'CDS', product: 'NRML', orderType: 'LIMIT', time: '13:39:13', ltp: '0.00' },
  { _id: '4', type: 'BUY', symbol: 'USDINR23MAYFUT', qty: 1, status: 'OPEN', price: '0.00', trigger: '', exchange: 'CDS', product: 'MIS', orderType: 'LIMIT', time: '13:39:14', ltp: '0.00' },
  { _id: '5', type: 'BUY', symbol: 'SBIN', qty: 1, status: 'COMPLETE', price: '0.00', trigger: '48.50', exchange: 'NSE', product: 'CNC', orderType: 'MARKET', time: '13:39:15', ltp: '0.00' }
];

const initialFunds = [
  {
    _id: '1',
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
  }
];

// Initial profile data
const initialProfile = {
  name: 'Ahraz',
  userId: 'FJP018',
  initials: 'AZ',
  email: 'ahraz@gmail.com',
  phone: '*6950',
  pan: '*182M',
  demat: '1208160149854261',
  bankAccount: {
    name: 'DCB BANK LTD',
    number: '*2877'
  },
  segments: 'NSE, BSE, MF',
  dematerialization: 'eDIS',
  privacyMode: false,
  supportCode: 'View',
  accountClosureWarning: 'Account closure is permanent and irreversible. Please read this before proceeding.'
};

export function DataProvider({ children }) {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [positions, setPositions] = useState(initialPositions);
  const [orders, setOrders] = useState(initialOrders);
  const [funds, setFunds] = useState(initialFunds);
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading data from API...');
      
      // Load all data in parallel with better error handling
      const [holdingsRes, positionsRes, ordersRes, fundsRes, profileRes] = await Promise.all([
        apiRequest('/holdings').catch((err) => {
          console.error('❌ Holdings API failed:', err);
          return { data: initialHoldings };
        }),
        apiRequest('/positions').catch((err) => {
          console.error('❌ Positions API failed:', err);
          return { data: initialPositions };
        }),
        apiRequest('/orders').catch((err) => {
          console.error('❌ Orders API failed:', err);
          return { data: initialOrders };
        }),
        apiRequest('/funds').catch((err) => {
          console.error('❌ Funds API failed:', err);
          return { data: initialFunds };
        }),
        apiRequest('/profile').catch((err) => {
          console.error('❌ Profile API failed:', err);
          return { data: initialProfile };
        })
      ]);

      console.log('✅ API Responses:', { holdingsRes, positionsRes, ordersRes, fundsRes, profileRes });

      setHoldings(holdingsRes.data || initialHoldings);
      setPositions(positionsRes.data || initialPositions);
      setOrders(ordersRes.data || initialOrders);
      setFunds(fundsRes.data || initialFunds);
      setProfile(profileRes.data || initialProfile);
      
      console.log('✅ Data loaded successfully');
    } catch (err) {
      setError('Failed to load data');
      console.error('❌ Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Holdings CRUD operations
  const addHolding = async (holding) => {
    try {
      const response = await apiRequest('/holdings', {
        method: 'POST',
        body: JSON.stringify(holding),
      });
      
      setHoldings(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add holding error:', error);
      throw error;
    }
  };

  const updateHolding = async (id, updatedHolding) => {
    try {
      const response = await apiRequest(`/holdings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedHolding),
      });
      
      setHoldings(prev => prev.map(h => h._id === id ? response.data : h));
      return response.data;
    } catch (error) {
      console.error('Update holding error:', error);
      throw error;
    }
  };

  const deleteHolding = async (id) => {
    try {
      await apiRequest(`/holdings/${id}`, {
        method: 'DELETE',
      });
      
      setHoldings(prev => prev.filter(h => h._id !== id));
    } catch (error) {
      console.error('Delete holding error:', error);
      throw error;
    }
  };

  // Positions CRUD operations
  const addPosition = async (position) => {
    try {
      const response = await apiRequest('/positions', {
        method: 'POST',
        body: JSON.stringify(position),
      });
      
      setPositions(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add position error:', error);
      throw error;
    }
  };

  const updatePosition = async (id, updatedPosition) => {
    try {
      const response = await apiRequest(`/positions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPosition),
      });
      
      setPositions(prev => prev.map(p => p._id === id ? response.data : p));
      return response.data;
    } catch (error) {
      console.error('Update position error:', error);
      throw error;
    }
  };

  const deletePosition = async (id) => {
    try {
      await apiRequest(`/positions/${id}`, {
        method: 'DELETE',
      });
      
      setPositions(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Delete position error:', error);
      throw error;
    }
  };

  const consolidatePositions = async () => {
    try {
      console.log('🔄 Consolidating positions...');
      const response = await apiRequest('/positions/consolidate', {
        method: 'POST',
      });
      
      // Reload positions after consolidation
      await loadData();
      
      console.log('✅ Position consolidation completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Consolidate positions error:', error);
      throw error;
    }
  };

  // Orders CRUD operations
  const addOrder = async (order) => {
    try {
      const response = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      });
      
      setOrders(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add order error:', error);
      throw error;
    }
  };

  const updateOrder = async (id, updatedOrder) => {
    try {
      const response = await apiRequest(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedOrder),
      });
      
      setOrders(prev => prev.map(o => o._id === id ? response.data : o));
      return response.data;
    } catch (error) {
      console.error('Update order error:', error);
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await apiRequest(`/orders/${id}`, {
        method: 'DELETE',
      });
      
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  };

  // Funds CRUD operations
  const addFund = async (fund) => {
    try {
      const response = await apiRequest('/funds', {
        method: 'POST',
        body: JSON.stringify(fund),
      });
      
      setFunds(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add fund error:', error);
      throw error;
    }
  };

  const updateFund = async (id, updatedFund) => {
    try {
      const response = await apiRequest(`/funds/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFund),
      });
      
      setFunds(prev => prev.map(f => f._id === id ? response.data : f));
      return response.data;
    } catch (error) {
      console.error('Update fund error:', error);
      throw error;
    }
  };

  const deleteFund = async (id) => {
    try {
      await apiRequest(`/funds/${id}`, {
        method: 'DELETE',
      });
      
      setFunds(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error('Delete fund error:', error);
      throw error;
    }
  };

  // Profile CRUD operations
  const getProfile = async () => {
    try {
      const response = await apiRequest('/profile');
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      await getProfile();
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  // Refresh data function
  const refreshData = () => {
    loadAllData();
  };

  const value = {
    holdings,
    positions,
    orders,
    funds,
    profile,
    loading,
    error,
    addHolding,
    updateHolding,
    deleteHolding,
    addPosition,
    updatePosition,
    deletePosition,
    consolidatePositions,
    addOrder,
    updateOrder,
    deleteOrder,
    addFund,
    updateFund,
    deleteFund,
    getProfile,
    updateProfile,
    refreshProfile,
    refreshData,
    apiRequest // Export for admin authentication
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;