import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Monitor, Eye, Flag, Settings, Edit3, Plus, Minus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StockModal from '../components/StockModal';
import { useNavigation } from '../context/NavigationContext';

// Custom Icons to match the toolbar
function CandlestickIcon({ className, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center">
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="6" y1="4" x2="6" y2="8"/>
        <line x1="6" y1="16" x2="6" y2="20"/>
        <rect x="4" y="8" width="4" height="8"/>
        <line x1="18" y1="2" x2="18" y2="6"/>
        <line x1="18" y1="14" x2="18" y2="22"/>
        <rect x="16" y="6" width="4" height="8"/>
      </svg>
    </button>
  );
}

function BarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="4" height="18"/>
      <rect x="10" y="8" width="4" height="13"/>
      <rect x="17" y="6" width="4" height="15"/>
    </svg>
  );
}

function LineIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,6 13,14 8,10 2,18"/>
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

function TimeframeButton({ active, children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

export default function ChartPage({ stock, onBack }) {
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [timeframe, setTimeframe] = useState('4H');
  const [selectedTimeframe, setSelectedTimeframe] = useState('4H');
  const [price, setPrice] = useState(2524.25);
  const [change, setChange] = useState(1.42);
  const [chartData, setChartData] = useState([]);
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  const [showChartTypeDropdown, setShowChartTypeDropdown] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('Candle');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedCandleIndex, setSelectedCandleIndex] = useState(null);

  const handleBack = () => {
    if (onBack) {
      // If onBack is provided (modal/component mode), use it
      onBack();
    } else {
      // Otherwise use proper navigation history
      goBack();
    }
  };

  // Real-time price and candle updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const newData = [...prevData];
        const lastCandle = newData[newData.length - 1];
        
        // Generate realistic price movement
        const volatility = 5;
        const trend = Math.random() > 0.5 ? 1 : -1;
        const priceMove = trend * (Math.random() * volatility + 1);
        
        // Update current candle (last one)
        const newClose = Math.max(2820, Math.min(3020, lastCandle.close + priceMove));
        const newHigh = Math.max(lastCandle.high, newClose + Math.random() * 3);
        const newLow = Math.min(lastCandle.low, newClose - Math.random() * 3);
        
        // Update the last candle
        newData[newData.length - 1] = {
          ...lastCandle,
          close: parseFloat(newClose.toFixed(2)),
          high: parseFloat(Math.min(3020, newHigh).toFixed(2)),
          low: parseFloat(Math.max(2820, newLow).toFixed(2)),
          isGreen: newClose >= lastCandle.open,
          volume: lastCandle.volume + Math.floor(Math.random() * 100)
        };
        
        // Update current price display
        setPrice(newClose);
        
        // Calculate change percentage
        const basePrice = 2524.25;
        const changePercent = ((newClose - basePrice) / basePrice) * 100;
        setChange(parseFloat(changePercent.toFixed(2)));
        
        // Occasionally add a new candle (every 30 seconds approximately)
        if (Math.random() < 0.033) { // 1/30 chance each second
          const newCandleOpen = newClose;
          const newCandleMove = (Math.random() - 0.5) * 10;
          const newCandleClose = Math.max(2820, Math.min(3020, newCandleOpen + newCandleMove));
          
          newData.push({
            date: new Date(),
            open: parseFloat(newCandleOpen.toFixed(2)),
            high: parseFloat(Math.max(newCandleOpen, newCandleClose + Math.random() * 5).toFixed(2)),
            low: parseFloat(Math.min(newCandleOpen, newCandleClose - Math.random() * 5).toFixed(2)),
            close: parseFloat(newCandleClose.toFixed(2)),
            isGreen: newCandleClose >= newCandleOpen,
            volume: Math.floor(Math.random() * 20000) + 5000
          });
          
          // Keep only last 15 candles for smooth animation
          if (newData.length > 15) {
            newData.shift();
          }
        }
        
        return newData;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Initialize chart data
  useEffect(() => {
    const generateInitialCandlestickData = () => {
      const data = [];
      
      // Initial realistic data points
      const candleData = [
        { open: 2945, close: 2930, high: 2950, low: 2920, isGreen: false },
        { open: 2930, close: 2855, high: 2940, low: 2820, isGreen: false }, // Big red candle
        { open: 2855, close: 2870, high: 2880, low: 2850, isGreen: true },
        { open: 2870, close: 2875, high: 2885, low: 2865, isGreen: true },
        { open: 2875, close: 2867, high: 2890, low: 2860, isGreen: false },
        { open: 2867, close: 2876, high: 2888, low: 2860, isGreen: true },
        { open: 2876, close: 2970, high: 2975, low: 2870, isGreen: true }, // Big green candle
        { open: 2970, close: 2525, high: 2975, low: 2520, isGreen: false } // Current live candle
      ];
      
      candleData.forEach((candle, i) => {
        data.push({
          date: new Date(Date.now() - (candleData.length - i) * 4 * 60 * 60 * 1000),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          isGreen: candle.isGreen,
          volume: Math.floor(Math.random() * 20000) + 5000
        });
      });
      
      return data;
    };

    setChartData(generateInitialCandlestickData());
  }, []);

  const stockName = stock?.name || 'HINDUNILVR';
  const isPositive = change >= 0;

  const timeframeOptions = [
    '1 Min', '2 Min', '3 Min', '4 Min', '5 Min', '10 Min', '15 Min', '30 Min',
    '1 Hour', '2 Hours', '3 Hours', '4 Hours', '1 D', '1 W', '1 Mo', 'Custom'
  ];

  const chartTypes = [
    { name: 'Candle', icon: CandlestickIcon },
    { name: 'Bar', icon: BarIcon },
    { name: 'Colored Bar', icon: BarIcon },
    { name: 'Line', icon: LineIcon },
    { name: 'Vertex Line', icon: LineIcon },
    { name: 'Step', icon: BarIcon },
    { name: 'Mountain', icon: LineIcon },
    { name: 'Baseline', icon: LineIcon },
    { name: 'Hollow Candle', icon: CandlestickIcon },
    { name: 'Volume Candle', icon: CandlestickIcon },
    { name: 'Colored HLC Bar', icon: BarIcon },
    { name: 'Scatterplot', icon: LineIcon },
    { name: 'Histogram', icon: BarIcon }
  ];

  const aggregatedTypes = [
    'Heikin Ashi', 'Kagi', 'Line Break', 'Renko', 'Range Bars', 'Point & Figure'
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <button onClick={handleBack}>
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-4">
          <RotateCcw className="w-6 h-6 text-gray-600" />
          <Monitor className="w-6 h-6 text-gray-600" />
          <button 
            onClick={() => setShowBuyModal(true)}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-600"
          >
            B
          </button>
          <button 
            onClick={() => setShowSellModal(true)}
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-red-600"
          >
            S
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 relative">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <CandlestickIcon 
              className="w-5 h-5 text-gray-700" 
              onClick={() => setShowChartTypeDropdown(!showChartTypeDropdown)}
            />
            {showChartTypeDropdown && (
              <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
                <div className="mb-4">
                  <h3 className="text-blue-500 text-sm font-medium mb-3">Chart Types</h3>
                  <div className="space-y-2">
                    {chartTypes.map((type) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <type.icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{type.name}</span>
                        </div>
                        <input 
                          type="radio" 
                          name="chartType"
                          checked={selectedChartType === type.name}
                          onChange={() => {
                            setSelectedChartType(type.name);
                            setShowChartTypeDropdown(false);
                          }}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-blue-500 text-sm font-medium mb-3">Aggregated Types</h3>
                  <div className="space-y-2">
                    {aggregatedTypes.map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{type}</span>
                        </div>
                        <input 
                          type="radio" 
                          name="chartType"
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-sm font-medium text-gray-700"
              onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
            >
              <span>{selectedTimeframe}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showTimeframeDropdown && (
              <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 w-32">
                {timeframeOptions.map((tf) => (
                  <button
                    key={tf}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedTimeframe === tf ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedTimeframe(tf);
                      setTimeframe(tf);
                      setShowTimeframeDropdown(false);
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
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

      {/* Chart Header with SELECT TOOL */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">SELECT TOOL</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Stock Info */}
      <div className="px-4 py-2 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{stockName}</h1>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{price.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 bg-white relative px-4 min-h-0">
        <div className="h-full relative" style={{ minHeight: '400px' }}>
          {/* Price Scale */}
          <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>3020.00</span>
            <span>3010.00</span>
            <span>3000.00</span>
            <span>2990.00</span>
            <span>2980.00</span>
            <span>2970.00</span>
            <span>2960.00</span>
            <span>2950.00</span>
            <span>2940.00</span>
            <span>2930.00</span>
            <span>2920.00</span>
            <span>2910.00</span>
            <span>2900.00</span>
            <span>2890.00</span>
            <span>2880.00</span>
            <span>2870.00</span>
            <span>2860.00</span>
            <span>2850.00</span>
            <span>2840.00</span>
            <span>2830.00</span>
            <span>2820.00</span>
          </div>

          {/* Chart Canvas */}
          <div className="h-full mr-16 relative overflow-hidden">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0">
              {Array.from({ length: 21 }, (_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full border-t border-gray-100" 
                  style={{ top: `${(i * 100) / 20}%` }}
                />
              ))}
            </div>

            {/* Candlesticks with proper gaps and animations */}
            <div className="absolute inset-0 flex items-end justify-center px-8" style={{ gap: '20px' }}>
              {chartData.map((candle, index) => {
                const minPrice = 2820;
                const maxPrice = 3020;
                const priceRange = maxPrice - minPrice;
                
                // Calculate positions as percentages from bottom
                const highPercent = ((candle.high - minPrice) / priceRange) * 100;
                const lowPercent = ((candle.low - minPrice) / priceRange) * 100;
                const openPercent = ((candle.open - minPrice) / priceRange) * 100;
                const closePercent = ((candle.close - minPrice) / priceRange) * 100;
                
                const bodyBottom = Math.min(openPercent, closePercent);
                const bodyTop = Math.max(openPercent, closePercent);
                const bodyHeight = Math.max(1, bodyTop - bodyBottom);
                
                const wickBottom = lowPercent;
                const wickTop = highPercent;
                const wickHeight = wickTop - wickBottom;
                
                // Check if this candle is selected for tooltip
                const showTooltip = selectedCandleIndex === index;
                
                // Check if this is the current (last) candle for animation
                const isCurrentCandle = index === chartData.length - 1;
                
                return (
                  <div 
                    key={`${index}-${candle.date}`} 
                    className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 ${isCurrentCandle ? 'animate-pulse' : ''}`}
                    style={{ width: '16px', height: '100%' }}
                    onClick={() => setSelectedCandleIndex(selectedCandleIndex === index ? null : index)}
                  >
                    {/* High-Low Wick */}
                    <div 
                      className={`absolute w-0.5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${candle.isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ 
                        bottom: `${wickBottom}%`,
                        height: `${Math.max(1, wickHeight)}%`
                      }}
                    />
                    {/* Open-Close Body */}
                    <div 
                      className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${candle.isGreen ? 'bg-green-500 border border-green-600' : 'bg-red-500 border border-red-600'} ${isCurrentCandle ? 'shadow-lg' : ''}`}
                      style={{ 
                        width: '16px',
                        bottom: `${bodyBottom}%`,
                        height: `${Math.max(3, bodyHeight)}%`,
                        minHeight: '3px'
                      }}
                    />
                    
                    {/* Live indicator for current candle */}
                    {isCurrentCandle && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Tooltip for selected candle */}
                    {showTooltip && (
                      <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blue-500 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-20">
                        <div className="text-center">
                          <div className="font-semibold">{new Date(candle.date).toLocaleString()}</div>
                          <div className="text-lg font-bold">{candle.close}</div>
                          <div className="border-t border-blue-300 my-1"></div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>OPEN: <span className="font-semibold">{candle.open}</span></div>
                            <div>CLOSE: <span className="font-semibold">{candle.close}</span></div>
                            <div>HIGH: <span className="font-semibold">{candle.high.toFixed(2)}</span></div>
                            <div>LOW: <span className="font-semibold">{candle.low}</span></div>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-gray-200">VOLUME</div>
                            <div className="font-bold">{(candle.volume / 1000).toFixed(1)}k</div>
                          </div>
                        </div>
                        {/* Arrow pointing down */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Price Line - Animated */}
            <div 
              className={`absolute w-full border-t-2 border-dashed transition-all duration-300 ${isPositive ? 'border-green-500' : 'border-red-500'}`}
              style={{ bottom: `${((price - 2820) / (3020 - 2820)) * 100}%` }}
            />
            
            {/* Current Price Label - Animated */}
            <div 
              className={`absolute right-0 text-white text-xs px-2 py-1 rounded-l transform -translate-y-1/2 transition-all duration-300 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ bottom: `${((price - 2820) / (3020 - 2820)) * 100}%` }}
            >
              {price.toFixed(2)}
            </div>

            {/* Price movement indicator */}
            <div 
              className={`absolute right-4 text-xs px-1 py-0.5 rounded transition-all duration-300 ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              style={{ bottom: `${((price - 2820) / (3020 - 2820)) * 100 + 2}%` }}
            >
              {isPositive ? '↗' : '↘'}
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-16 right-4 flex items-center space-x-2 bg-gray-800 bg-opacity-75 rounded-full px-3 py-2">
          <Minus className="w-4 h-4 text-white" />
          <Plus className="w-4 h-4 text-white" />
        </div>

        {/* Navigation Arrow */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-green-500 text-white px-2 py-1 rounded text-sm">»</div>
        </div>
      </div>

      {/* Date Scale */}
      <div className="px-4 py-2 bg-white border-t">
        <div className="flex justify-between text-xs text-gray-500 mr-16">
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
            Chg. {isPositive ? '+' : ''}{change}%
          </div>
          <div className="flex items-center space-x-4">
            <TimeframeButton active={timeframe === '1D'} onClick={() => setTimeframe('1D')}>1D</TimeframeButton>
            <TimeframeButton active={timeframe === '5D'} onClick={() => setTimeframe('5D')}>5D</TimeframeButton>
            <TimeframeButton active={timeframe === '1M'} onClick={() => setTimeframe('1M')}>1M</TimeframeButton>
            <TimeframeButton active={timeframe === '1Y'} onClick={() => setTimeframe('1Y')}>1Y</TimeframeButton>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center py-2">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>

      {/* Buy/Sell Modals */}
      {showBuyModal && (
        <StockModal 
          isOpen={showBuyModal}
          stock={stock || { 
            name: stockName, 
            price: price, 
            change: change, 
            pct: change, 
            exch: 'NSE' 
          }}
          onClose={() => setShowBuyModal(false)}
          mode="buy"
        />
      )}

      {showSellModal && (
        <StockModal 
          isOpen={showSellModal}
          stock={stock || { 
            name: stockName, 
            price: price, 
            change: change, 
            pct: change, 
            exch: 'NSE' 
          }}
          onClose={() => setShowSellModal(false)}
          mode="sell"
        />
      )}

      {/* Click outside to close dropdowns */}
      {(showTimeframeDropdown || showChartTypeDropdown || selectedCandleIndex !== null) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowTimeframeDropdown(false);
            setShowChartTypeDropdown(false);
            setSelectedCandleIndex(null);
          }}
        />
      )}
    </div>
  );
}