import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';
import { useData } from '../context/DataContext.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function FundsPage({ setActive }) {
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const { funds, loading } = useData();

  const handleBackClick = () => {
    // If this is being used as a component within portfolio, use setActive
    if (setActive) {
      setActive('watchlist'); // Go back to main portfolio view
    } else {
      // If this is a standalone route, navigate to portfolio
      navigate('/portfolio');
    }
  };
  
  // Get the first fund data (assuming single fund record for demo)
  const fundData = funds && funds.length > 0 ? funds[0] : {
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
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white px-4 pt-4">
        <div className="flex items-center mb-4">
          <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-100 active:scale-95 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Funds</h1>
          <div className="w-6"></div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading funds data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-4">
      {/* Top bar */}
      <div className="flex items-center mb-4">
        <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-100 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Funds</h1>
        <div className="w-6"></div>
      </div>

      {/* Available margin card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-5 text-center mb-4">
        <div className="flex items-center justify-center space-x-1">
          <p className="text-sm text-gray-500">Available margin (Cash + Collateral)</p>
          <img src="/images/fund_Amargin.png" alt="info icon" className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 0 transparent)', mixBlendMode: 'darken' }} />
        </div>
        <p className="text-2xl font-semibold text-blue-600 mt-1">₹{fundData.availableMargin}</p>
        <div className="flex justify-center items-center mt-1 space-x-1">
          <img src="/images/console.svg" alt="view icon" className="w-4 h-4" />
          <a href="#" className="text-blue-600 text-sm inline-block hover:underline">View statement</a>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        <button 
          onClick={() => navigate('/addfunds')} 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-center tracking-wide transition-colors"
        >
          + Add funds
        </button>
        <button 
          onClick={() => navigate('/withdrawal')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center tracking-wide transition-colors"
        >
          ↻ Withdraw
        </button>
      </div>

      {/* Available and used margin */}
      <div className="flex justify-between px-1 mb-4">
        <div className="text-center flex-1">
          <p className="text-sm text-gray-500">Available cash</p>
          <p className="text-base text-gray-900 font-medium">{fundData.availableCash}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-sm text-gray-500">Used margin</p>
          <p className="text-base text-gray-900 font-medium">{fundData.usedMargin}</p>
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-200 text-sm text-gray-800">
        <div className="flex justify-between py-2"><span>Opening balance</span><span>{fundData.openingBalance}</span></div>
        <div className="flex justify-between py-2"><span>Payin</span><span>{fundData.payin}</span></div>
        <div className="flex justify-between py-2"><span>Payout</span><span>{fundData.payout}</span></div>
        <div className="flex justify-between py-2"><span>SPAN</span><span>{fundData.span}</span></div>
        <div className="flex justify-between py-2"><span>Delivery margin</span><span>{fundData.deliveryMargin}</span></div>
        <div className="flex justify-between py-2"><span>Exposure</span><span>{fundData.exposure}</span></div>
        <div className="flex justify-between py-2"><span>Option premium</span><span>{fundData.optionPremium}</span></div>
      </div>

      <div className="border-t border-gray-200 mt-3 divide-y divide-gray-200 text-sm text-gray-800">
        <div className="flex justify-between py-2"><span>Collateral (Liquid funds)</span><span>{fundData.collateralLiquid}</span></div>
        <div className="flex justify-between py-2"><span>Collateral (Equity)</span><span>{fundData.collateralEquity}</span></div>
        <div className="flex justify-between py-2 font-medium"><span>Total collateral</span><span>{fundData.totalCollateral}</span></div>
      </div>
    </div>
  );
}