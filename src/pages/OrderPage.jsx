import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import { useData } from '../context/DataContext.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function OrderPage({ stock, orderType, onClose }) {
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState(stock?.price || '26.05');
  const [orderMode, setOrderMode] = useState('Regular');
  const [orderTypeSelect, setOrderTypeSelect] = useState('Limit');
  const [validity, setValidity] = useState('Longterm');
  const [stopLoss, setStopLoss] = useState(false);
  const [gtt, setGtt] = useState(false);
  const [marketProtection, setMarketProtection] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isBuy = orderType === 'BUY';
  const { addOrder, addPosition } = useData();
  
  // Exchange selection
  const [selectedExchange, setSelectedExchange] = useState('NSE');
  const exchanges = [
    { name: 'NSE', price: stock?.price || '26.05', available: true },
    { name: 'BSE', price: '0.00', available: false }
  ];

  const orderModes = ['Regular', 'MTF', 'AMO', 'Iceberg', 'Cover'];

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Create order data
      const orderData = {
        type: orderType,
        symbol: stock?.name || 'UNKNOWN',
        qty: parseInt(quantity),
        status: 'COMPLETE', // Simulate immediate execution for demo
        price: parseFloat(price),
        trigger: stopLoss ? price : '',
        exchange: selectedExchange,
        product: orderMode === 'Regular' ? 'CNC' : 'MIS',
        orderType: orderTypeSelect.toUpperCase(),
        time: new Date().toLocaleTimeString(),
        ltp: parseFloat(price)
      };

      // Add order to orders list
      await addOrder(orderData);
      console.log('✅ Order placed successfully:', orderData);

      // Backend will automatically handle position creation/consolidation for completed orders
      // No need to manually create positions on frontend

      // Show success message and close
      alert(`${orderType} order placed successfully!${isBuy ? ' Position will be updated automatically.' : ''}`);
      onClose();
      
    } catch (error) {
      console.error('❌ Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={onClose} className="p-2">
          <Icon name="chevron-left" className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">{stock?.name || 'ASTRON'}</h1>
        <button className="p-2">
          <Icon name="more-vertical" className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Exchange Selection */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {exchanges.map((exchange) => (
            <button
              key={exchange.name}
              onClick={() => exchange.available && setSelectedExchange(exchange.name)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${
                selectedExchange === exchange.name && exchange.available
                  ? 'border-blue-500 bg-blue-50'
                  : exchange.available
                  ? 'border-gray-300'
                  : 'border-gray-200 opacity-50'
              }`}
              disabled={!exchange.available}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedExchange === exchange.name && exchange.available
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedExchange === exchange.name && exchange.available && (
                  <div className="w-full h-full rounded-full bg-blue-500"></div>
                )}
              </div>
              <span className={`text-sm font-medium ${
                exchange.available ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {exchange.name}
              </span>
              <span className={`text-sm ${
                exchange.available ? 'text-gray-600' : 'text-gray-400'
              }`}>
                ₹{exchange.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Order Mode Selection */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {orderModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setOrderMode(mode)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                orderMode === mode
                  ? isBuy 
                    ? 'text-blue-600 border-blue-600'
                    : 'text-red-600 border-red-600'
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Quantity */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-3">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="1"
            min="1"
          />
        </div>

        {/* Order Type and Price */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <label className="text-base font-medium text-gray-900">Limit</label>
            <button className={`p-1 ${isBuy ? 'text-blue-500' : 'text-red-500'}`}>
              <Icon name="edit-2" className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="26.05"
            min="0"
          />
        </div>

        {/* Validity */}
        <div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setValidity('Intraday')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                validity === 'Intraday'
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                validity === 'Intraday'
                  ? 'border-gray-500 bg-gray-500'
                  : 'border-gray-300'
              }`}>
                {validity === 'Intraday' && (
                  <div className="w-full h-full rounded-full bg-gray-500"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Intraday</span>
            </button>
            <button
              onClick={() => setValidity('Longterm')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                validity === 'Longterm'
                  ? isBuy 
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                validity === 'Longterm'
                  ? isBuy 
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-red-500 bg-red-500'
                  : 'border-gray-300'
              }`}>
                {validity === 'Longterm' && (
                  <div className={`w-full h-full rounded-full ${isBuy ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Longterm</span>
            </button>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          {/* Stop Loss */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-900">Stoploss</span>
              <button className="p-1">
                <Icon name="info" className="w-4 h-4 text-blue-500" />
              </button>
            </div>
            <button
              onClick={() => setStopLoss(!stopLoss)}
              className="transition-transform active:scale-95"
            >
              <img 
                src="/images/toggle.png" 
                alt="Toggle" 
                className="w-16 h-14 transition-transform duration-300"
              />
            </button>
          </div>

          {/* GTT */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-900">GTT</span>
              <button className="p-1">
                <Icon name="info" className="w-4 h-4 text-blue-500" />
              </button>
            </div>
            <button
              onClick={() => setGtt(!gtt)}
              className="transition-transform active:scale-95"
            >
              <img 
                src="/images/toggle.png" 
                alt="Toggle" 
                className="w-16 h-14 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Market Protection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-900">Market protection</span>
              <button className="p-1">
                <Icon name="info" className="w-4 h-4 text-blue-500" />
              </button>
            </div>
            <button
              onClick={() => setMarketProtection(!marketProtection)}
              className="transition-transform active:scale-95"
            >
              <img 
                src="/images/toggle.png" 
                alt="Toggle" 
                className="w-16 h-14 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Advanced Section */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base text-blue-600">Help</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base text-blue-600">Advanced</span>
              <Icon 
                name="chevron-down" 
                className={`w-5 h-5 text-blue-600 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
              />
            </div>
          </button>
          
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center text-gray-600">
                <Icon name="chevron-up" className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Less</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white">
        {/* Amount Info */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <span>Amount</span>
          <div className="flex items-center space-x-4">
            <span>₹0.00 + ₹0.00</span>
            <span>Avail. ₹1,00,000.00</span>
            <button className="p-1">
              <Icon name="refresh-cw" className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>

        {/* Swipe Button */}
        <div className="relative">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className={`relative w-full h-16 rounded-xl overflow-hidden transition-all duration-300 ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed'
                : isBuy 
                  ? 'bg-blue-500 hover:bg-blue-600 active:scale-98' 
                  : 'bg-red-500 hover:bg-red-600 active:scale-98'
            }`}
          >
            {/* Swipe Track */}
            <div className="absolute inset-y-2 left-2 right-16 bg-black bg-opacity-10 rounded-lg"></div>
            
            {/* Swipe Handle */}
            <div className={`absolute left-2 top-2 bottom-2 w-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isProcessing 
                ? 'bg-gray-300'
                : 'bg-white shadow-lg hover:shadow-xl'
            }`}>
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
            
            {/* Button Text */}
            <div className="flex items-center justify-center h-full text-white">
              <span className="text-lg font-semibold tracking-wide">
                {isProcessing ? 'PROCESSING...' : `SWIPE TO ${isBuy ? 'BUY' : 'SELL'}`}
              </span>
            </div>
            
            {/* Shine Effect */}
            {!isProcessing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 -skew-x-12 transform translate-x-full hover:translate-x-0"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;