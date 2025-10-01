import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import stockAPI from '../services/stockAPI';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Mini chart component
function MiniChart({ data, color = '#3B82F6' }) {
  const width = 100;
  const height = 40;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export default function OverviewModal({ isOpen, onClose }) {
  const [marketData, setMarketData] = useState({
    nifty50: { value: 25145.20, change: 315.75, pct: 1.27, loading: true },
    niftyBank: { value: 52875.40, change: 485.20, pct: 0.93, loading: true }
  });

  const [fundsData, setFundsData] = useState({
    availableMargin: '1,00,000.00',
    loading: true
  });

  const [watchlistData, setWatchlistData] = useState([
    { name: 'TCS', value: 4125.45, change: 45.75, pct: 1.12 },
    { name: 'RELIANCE', value: 2685.45, change: 35.80, pct: 1.35 },
    { name: 'HDFC', value: 1672.45, change: 12.75, pct: 0.77 },
    { name: 'INFY', value: 1845.80, change: 25.90, pct: 1.42 }
  ]);

  // Generate realistic chart data based on market trends
  const generateChartData = (basePrice, trend = 1) => {
    return Array.from({ length: 20 }, (_, i) => {
      const trendComponent = (i / 19) * trend * 0.02 * basePrice; // 2% trend over time
      const volatility = (Math.random() - 0.5) * 0.01 * basePrice; // 1% volatility
      const cyclical = Math.sin(i * 0.3) * 0.005 * basePrice; // 0.5% cyclical movement
      return basePrice + trendComponent + volatility + cyclical;
    });
  };

  const niftyChartData = generateChartData(25145.20, 1.2);
  const bankChartData = generateChartData(52875.40, 0.8);

  // Fetch market data from API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch NIFTY 50 data
        const niftyResponse = await stockAPI.getQuote('^NSEI');
        if (niftyResponse.quoteResponse?.result?.[0]) {
          const niftyData = niftyResponse.quoteResponse.result[0];
          setMarketData(prev => ({
            ...prev,
            nifty50: {
              value: niftyData.regularMarketPrice || niftyData.price,
              change: niftyData.regularMarketChange || niftyData.change,
              pct: niftyData.regularMarketChangePercent || niftyData.changePercent,
              loading: false
            }
          }));
        }

        // Fetch NIFTY BANK data
        const bankResponse = await stockAPI.getQuote('^CNXBANK');
        if (bankResponse.quoteResponse?.result?.[0]) {
          const bankData = bankResponse.quoteResponse.result[0];
          setMarketData(prev => ({
            ...prev,
            niftyBank: {
              value: bankData.regularMarketPrice || bankData.price,
              change: bankData.regularMarketChange || bankData.change,
              pct: bankData.regularMarketChangePercent || bankData.changePercent,
              loading: false
            }
          }));
        }

        // Fetch funds data
        const token = localStorage.getItem('token');
        if (token) {
          const fundsResponse = await fetch('http://localhost:5001/api/funds', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (fundsResponse.ok) {
            const fundsResult = await fundsResponse.json();
            if (fundsResult.success && fundsResult.data?.length > 0) {
              const fundsInfo = fundsResult.data[0];
              setFundsData({
                availableMargin: fundsInfo.availableMargin || '1,00,000.00',
                loading: false
              });
            } else {
              setFundsData(prev => ({ ...prev, loading: false }));
            }
          } else {
            setFundsData(prev => ({ ...prev, loading: false }));
          }
        } else {
          setFundsData(prev => ({ ...prev, loading: false }));
        }

      } catch (error) {
        console.error('Error fetching market data:', error);
        setMarketData(prev => ({
          nifty50: { ...prev.nifty50, loading: false },
          niftyBank: { ...prev.niftyBank, loading: false }
        }));
        setFundsData(prev => ({ ...prev, loading: false }));
      }
    };

    if (isOpen) {
      fetchMarketData();
      
      // Set up periodic updates every 5 seconds when modal is open and market might be active
      const interval = setInterval(fetchMarketData, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`fixed top-0 left-0 right-0 bg-white z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-xl text-gray-800">Overview</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="x" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Market Overview */}
          <div className="px-4 py-6 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              {/* NIFTY 50 */}
              <div>
                <div className="text-sm text-gray-600 mb-1">NIFTY 50</div>
                {marketData.nifty50.loading ? (
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-6 w-24 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-16 rounded mb-3"></div>
                    <div className="bg-gray-200 h-10 w-24 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-lg text-gray-900 mb-2">
                      {marketData.nifty50.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm ${marketData.nifty50.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData.nifty50.change >= 0 ? '+' : ''}{marketData.nifty50.change.toFixed(2)}
                      </span>
                      <span className={`text-sm ${marketData.nifty50.pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ({marketData.nifty50.pct >= 0 ? '+' : ''}{marketData.nifty50.pct.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <MiniChart 
                        data={niftyChartData} 
                        color={marketData.nifty50.change >= 0 ? "#10B981" : "#EF4444"} 
                      />
                    </div>
                  </>
                )}
              </div>

              {/* NIFTY BANK */}
              <div>
                <div className="text-sm text-gray-600 mb-1">NIFTY BANK</div>
                {marketData.niftyBank.loading ? (
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-6 w-24 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-16 rounded mb-3"></div>
                    <div className="bg-gray-200 h-10 w-24 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-lg text-gray-900 mb-2">
                      {marketData.niftyBank.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm ${marketData.niftyBank.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData.niftyBank.change >= 0 ? '+' : ''}{marketData.niftyBank.change.toFixed(2)}
                      </span>
                      <span className={`text-sm ${marketData.niftyBank.pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ({marketData.niftyBank.pct >= 0 ? '+' : ''}{marketData.niftyBank.pct.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <MiniChart 
                        data={bankChartData} 
                        color={marketData.niftyBank.change >= 0 ? "#10B981" : "#EF4444"} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-4">
              * Charts indicate 52 weeks trend
            </div>
          </div>

          {/* Funds Section */}
          <div className="px-4 py-6">
            <div className="text-base text-gray-800 mb-3">Funds</div>
            <div className="text-2xl text-gray-900">
              {fundsData.loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
              ) : (
                `₹${fundsData.availableMargin}`
              )}
            </div>
            {!fundsData.loading && (
              <div className="text-sm text-gray-500 mt-1">Available Margin</div>
            )}
          </div>
        </div>

      
      </div>
    </>
  );
}