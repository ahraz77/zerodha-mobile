import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import OrderPage from '../pages/OrderPage.jsx';
import CreateAlertScreen from '../pages/createAlert.jsx';
import CreateGTTScreen from '../pages/gtt.jsx';
import OIGreeksMobile from '../pages/optionchain.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function HoldingsStockModal({ isOpen, onClose, stock, onViewChart }) {
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showCreateGTT, setShowCreateGTT] = useState(false);
  const [showOptionChain, setShowOptionChain] = useState(false);
  const [orderType, setOrderType] = useState('');

  // Reset state when modal is closed or opened
  useEffect(() => {
    if (!isOpen) {
      setShowOrderPage(false);
      setShowCreateAlert(false);
      setShowCreateGTT(false);
      setShowOptionChain(false);
      setOrderType('');
    }
  }, [isOpen]);

  if (!isOpen || !stock) return null;

  const handleAddClick = () => {
    setOrderType('BUY');
    setShowOrderPage(true);
  };

  const handleExitClick = () => {
    setOrderType('SELL');
    setShowOrderPage(true);
  };

  const handleBackFromOrder = () => {
    setShowOrderPage(false);
    setOrderType('');
  };

  const handleSetAlertClick = () => {
    setShowCreateAlert(true);
  };

  const handleCreateGTTClick = () => {
    setShowCreateGTT(true);
  };

  const handleBackFromAlert = () => {
    setShowCreateAlert(false);
  };

  const handleBackFromGTT = () => {
    setShowCreateGTT(false);
  };

  const handleOptionChainClick = () => {
    setShowOptionChain(true);
  };

  const handleBackFromOptionChain = () => {
    setShowOptionChain(false);
  };

  if (showOrderPage) {
    return (
      <OrderPage 
        stock={stock}
        orderType={orderType}
        onBack={handleBackFromOrder}
        onClose={onClose}
      />
    );
  }

  if (showCreateAlert) {
    return (
      <div className="fixed inset-0 z-50">
        <CreateAlertScreen 
          stock={stock}
          onBack={handleBackFromAlert}
          onClose={onClose}
        />
      </div>
    );
  }

  if (showCreateGTT) {
    return (
      <div className="fixed inset-0 z-50">
        <CreateGTTScreen 
          stock={stock}
          onBack={handleBackFromGTT}
          onClose={onClose}
        />
      </div>
    );
  }

  if (showOptionChain) {
    return (
      <div className="fixed inset-0 z-50">
        <OIGreeksMobile 
          stock={stock}
          onBack={handleBackFromOptionChain}
          onClose={onClose}
        />
      </div>
    );
  }

  // Sample order book data to match the screenshot
  const orderBookData = {
    bids: [
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 }
    ],
    asks: [
      { price: stock.price ? (stock.price + 0.05).toFixed(2) : '26.05', orders: 1, qty: 150 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 },
      { price: '0.00', orders: 0, qty: 0 }
    ]
  };

  const isNegative = stock.change < 0;
  const changeColor = isNegative ? '#EF4444' : '#10B981';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal - positioned to come from bottom to middle */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white animate-slide-up" style={{ height: '60vh' }}>
        {/* Stock Header */}
        <div className="px-4 py-3 bg-white">
          <div className="text-[20px] font-medium text-black">{stock.name || stock.symbol}</div>
          <div className="flex items-center mt-1">
            <span className="text-[13px] text-gray-500 mr-2">{stock.exch || stock.exchange || 'NSE'}</span>
            <span className="text-[16px] font-medium text-black mr-2">{stock.price?.toFixed(2) || stock.current?.toFixed(2) || stock.ltp?.toFixed(2)}</span>
            <span className="text-[13px]" style={{ color: changeColor }}>
              {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2) || stock.dayChange?.toFixed(2) || '0.00'} ({stock.pct >= 0 ? '+' : ''}{stock.pct?.toFixed(2) || stock.dayChangePercent?.toFixed(2) || '0.00'}%)
            </span>
          </div>
          
          {/* Holdings/Position specific info */}
          {stock.qty && (
            <div className="mt-2 text-[13px] text-gray-600">
              Qty: {stock.qty} • Avg: ₹{stock.avgPrice?.toFixed(2) || stock.average?.toFixed(2) || '0.00'}
            </div>
          )}
          
          {stock.invested && stock.current && (
            <div className="mt-1 text-[13px] text-gray-600">
              Invested: ₹{stock.invested.toFixed(2)} • Current: ₹{stock.current.toFixed(2)} • P&L: <span style={{ color: stock.pnl >= 0 ? '#10B981' : '#EF4444' }}>₹{stock.pnl?.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Add/Exit Buttons */}
        <div className="px-4 py-3 flex gap-3">
          <button 
            onClick={handleAddClick}
            className="flex-1 bg-[#4285F4] text-white py-3 rounded-lg font-medium text-[16px] hover:bg-blue-600 transition-colors"
          >
            ADD
          </button>
          <button 
            onClick={handleExitClick}
            className="flex-1 bg-[#DB4437] text-white py-3 rounded-lg font-medium text-[16px] hover:bg-red-600 transition-colors"
          >
            EXIT
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 flex justify-between">
          <button 
            onClick={() => onViewChart && onViewChart(stock)} 
            className="flex items-center space-x-2 text-[#4285F4] text-[14px] hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            <Icon name="bar-chart-2" className="w-4 h-4" />
            <span>View chart</span>
          </button>
          <button 
            onClick={handleOptionChainClick}
            className="flex items-center space-x-2 text-[#4285F4] text-[14px] hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            <Icon name="list" className="w-4 h-4" />
            <span>Option chain</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Additional Actions */}
        <div className="px-4 py-3 flex justify-between">
          <button 
            onClick={handleSetAlertClick}
            className="flex items-center space-x-2 text-[#4285F4] text-[14px] hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            <Icon name="bell" className="w-4 h-4" />
            <span>Set alert</span>
          </button>
          <button className="flex items-center space-x-2 text-[#4285F4] text-[14px] hover:bg-blue-50 px-2 py-1 rounded transition-colors">
            <Icon name="file-text" className="w-4 h-4" />
            <span>Add notes</span>
          </button>
          <button 
            onClick={handleCreateGTTClick}
            className="flex items-center space-x-2 text-[#4285F4] text-[14px] hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            <Icon name="trending-up" className="w-4 h-4" />
            <span>Create GTT</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Order Book */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 h-full text-[13px]">
            {/* Bid (Buy Orders) */}
            <div className="border-r border-gray-200">
              <div className="px-3 py-2 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-gray-600">
                  <span>Bid</span>
                  <span>Orders</span>
                  <span>Qty</span>
                </div>
              </div>
              <div className="flex-1">
                {orderBookData.bids.map((bid, index) => (
                  <div key={index} className="px-3 py-1">
                    <div className="grid grid-cols-3 gap-2 text-[12px]">
                      <span className="text-[#4285F4] font-medium">{bid.price}</span>
                      <span className="text-gray-600">{bid.orders}</span>
                      <span className="text-gray-900">{bid.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-1 bg-gray-50 border-t">
                <div className="grid grid-cols-3 gap-2 text-[12px] font-medium">
                  <span className="text-[#4285F4]">Total</span>
                  <span className="text-[#4285F4]">0</span>
                  <span className="text-[#4285F4]">0</span>
                </div>
              </div>
            </div>

            {/* Ask (Sell Orders) */}
            <div>
              <div className="px-3 py-2 bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-gray-600">
                  <span>Offer</span>
                  <span>Orders</span>
                  <span>Qty</span>
                </div>
              </div>
              <div className="flex-1">
                {orderBookData.asks.map((ask, index) => (
                  <div key={index} className="px-3 py-1">
                    <div className="grid grid-cols-3 gap-2 text-[12px]">
                      <span className="text-[#DB4437] font-medium">{ask.price}</span>
                      <span className="text-gray-600">{ask.orders}</span>
                      <span className="text-gray-900">{ask.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-1 bg-gray-50 border-t">
                <div className="grid grid-cols-3 gap-2 text-[12px] font-medium">
                  <span className="text-[#DB4437]">Total</span>
                  <span className="text-[#DB4437]">1</span>
                  <span className="text-[#DB4437]">150</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom drag indicator */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-black rounded-full" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default HoldingsStockModal;