import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Monitor, Eye, Flag, Settings, Edit3, Plus, Minus } from 'lucide-react';

// Custom Icons to match the toolbar
function CandlestickIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="4" x2="6" y2="8"/>
      <line x1="6" y1="16" x2="6" y2="20"/>
      <rect x="4" y="8" width="4" height="8"/>
      <line x1="18" y1="2" x2="18" y2="6"/>
      <line x1="18" y1="14" x2="18" y2="22"/>
      <rect x="16" y="6" width="4" height="8"/>
    </svg>
  );
}

function FunctionIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

function CloudIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  );
}

export default function ChartPage() {
  const [price, setPrice] = useState(89.35);
  const [change, setChange] = useState(0.85);

  // Realistic chart data with proper candlestick patterns
  const chartData = [
    { open: 83.5, close: 84.2, high: 84.8, low: 83.1, isGreen: true },
    { open: 84.2, close: 83.8, high: 84.5, low: 83.6, isGreen: false },
    { open: 83.8, close: 85.1, high: 85.3, low: 83.7, isGreen: true },
    { open: 85.1, close: 84.6, high: 85.4, low: 84.3, isGreen: false },
    { open: 84.6, close: 86.2, high: 86.5, low: 84.4, isGreen: true },
    { open: 86.2, close: 85.8, high: 86.7, low: 85.5, isGreen: false },
    { open: 85.8, close: 87.3, high: 87.8, low: 85.6, isGreen: true },
    { open: 87.3, close: 88.1, high: 88.4, low: 87.0, isGreen: true },
    { open: 88.1, close: 87.5, high: 88.6, low: 87.2, isGreen: false },
    { open: 87.5, close: 89.2, high: 89.5, low: 87.3, isGreen: true },
    { open: 89.2, close: 88.9, high: 89.8, low: 88.7, isGreen: false },
    { open: 88.9, close: 90.1, high: 90.4, low: 88.6, isGreen: true },
    { open: 90.1, close: 89.8, high: 90.6, low: 89.5, isGreen: false },
    { open: 89.8, close: 91.2, high: 91.7, low: 89.6, isGreen: true },
    { open: 91.2, close: 90.5, high: 91.8, low: 90.2, isGreen: false },
    { open: 90.5, close: 92.1, high: 92.5, low: 90.3, isGreen: true },
    { open: 92.1, close: 91.8, high: 92.8, low: 91.5, isGreen: false },
    { open: 91.8, close: 93.2, high: 93.6, low: 91.6, isGreen: true },
    { open: 93.2, close: 92.9, high: 93.8, low: 92.6, isGreen: false },
    { open: 92.9, close: 89.35, high: 93.4, low: 89.1, isGreen: false } // Current candle
  ];

  const isPositive = change >= 0;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <X className="w-6 h-6 text-gray-600" />
        <div className="flex items-center space-x-4">
          <RotateCcw className="w-6 h-6 text-gray-600" />
          <Monitor className="w-6 h-6 text-gray-600" />
          <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            B
          </button>
          <button className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
            S
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <CandlestickIcon className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">4H</span>
          <Eye className="w-5 h-5 text-gray-700" />
          <FunctionIcon className="w-5 h-5 text-gray-700" />
          <CloudIcon className="w-5 h-5 text-gray-700" />
          <Flag className="w-5 h-5 text-gray-700" />
          <Settings className="w-5 h-5 text-gray-700" />
          <Edit3 className="w-5 h-5 text-gray-700" />
          <Plus className="w-5 h-5 text-gray-700" />
        </div>
        <div className="text-gray-600">
          <span className="mr-2">...</span>
        </div>
      </div>

      {/* Chart Header */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">SELECT TOOL</span>
          </div>
        </div>
      </div>

      {/* Stock Info */}
      <div className="px-4 py-2 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">TATASTEEL</h1>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{price.toFixed(2)}</div>
            <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{((change/price)*100).toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 bg-white relative px-4 min-h-0">
        <div className="h-full relative" style={{ minHeight: '400px' }}>
          {/* Price Scale */}
          <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>95.00</span>
            <span>94.00</span>
            <span>93.00</span>
            <span>92.00</span>
            <span>91.00</span>
            <span>90.00</span>
            <span>89.00</span>
            <span>88.00</span>
            <span>87.00</span>
            <span>86.00</span>
            <span>85.00</span>
            <span>84.00</span>
            <span>83.00</span>
          </div>

          {/* Chart Canvas */}
          <div className="h-full mr-12 relative overflow-hidden">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0">
              {Array.from({ length: 13 }, (_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full border-t border-gray-100" 
                  style={{ top: `${(i * 100) / 12}%` }}
                />
              ))}
            </div>

            {/* Realistic Candlesticks */}
            <div className="absolute inset-0 flex items-end px-4" style={{ gap: '4px' }}>
              {chartData.map((candle, index) => {
                const minPrice = 83;
                const maxPrice = 95;
                const priceRange = maxPrice - minPrice;
                
                // Calculate positions as percentages from bottom
                const highPercent = ((candle.high - minPrice) / priceRange) * 100;
                const lowPercent = ((candle.low - minPrice) / priceRange) * 100;
                const openPercent = ((candle.open - minPrice) / priceRange) * 100;
                const closePercent = ((candle.close - minPrice) / priceRange) * 100;
                
                const bodyBottom = Math.min(openPercent, closePercent);
                const bodyTop = Math.max(openPercent, closePercent);
                const bodyHeight = Math.max(2, bodyTop - bodyBottom);
                
                const wickBottom = lowPercent;
                const wickTop = highPercent;
                const wickHeight = wickTop - wickBottom;
                
                return (
                  <div key={index} className="relative flex-shrink-0" style={{ width: '12px', height: '100%' }}>
                    {/* High-Low Wick - Thin Shadow Lines */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2"
                      style={{ 
                        width: '1px',
                        bottom: `${wickBottom}%`,
                        height: `${Math.max(1, wickHeight)}%`,
                        backgroundColor: candle.isGreen ? '#22c55e' : '#ef4444'
                      }}
                    />
                    {/* Realistic Candlestick Body */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 border"
                      style={{ 
                        width: '10px',
                        bottom: `${bodyBottom}%`,
                        height: `${Math.max(2, bodyHeight)}%`,
                        minHeight: '2px',
                        backgroundColor: candle.isGreen ? 'transparent' : '#ef4444',
                        borderColor: candle.isGreen ? '#22c55e' : '#ef4444',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Current Price Line with Green Arrow */}
            <div 
              className="absolute w-full border-t border-dashed border-gray-400"
              style={{ bottom: `${((price - 83) / (95 - 83)) * 100}%` }}
            />
            
            {/* Current Price Label with Arrow */}
            <div 
              className="absolute right-0 transform -translate-y-1/2 flex items-center"
              style={{ bottom: `${((price - 83) / (95 - 83)) * 100}%` }}
            >
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-l font-medium">
                {price.toFixed(2)}
              </div>
              <div className="w-0 h-0 border-l-4 border-l-green-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-75 rounded-full px-4 py-2">
          <Minus className="w-5 h-5 text-white" />
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Date Scale */}
      <div className="px-4 py-2 bg-white border-t">
        <div className="flex justify-between text-xs text-gray-500 mr-12">
          <span>16/09</span>
          <span>17/09</span>
          <span>18/09</span>
          <span>19/09</span>
          <span>20/09</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-4 py-4 bg-white border-t">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            Chg. {isPositive ? '+' : ''}{change}
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">1D</button>
            <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">5D</button>
            <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">1M</button>
            <button className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-600">1Y</button>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center py-2">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}