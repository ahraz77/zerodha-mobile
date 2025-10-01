import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import StockModal from './StockModal.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Search API service
const searchStocks = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    // For demo, using a mock API response that matches common Indian stocks
    const mockResults = [
      // Bank Nifty related
      { symbol: 'BANKNIFTY1', exchange: 'NSE', name: 'KOTAKMAMC-KOTAKBKETF', type: 'ETF' },
      { symbol: 'BANKNIFTY1', exchange: 'BSE', name: 'KOTAKMAMC-KOTAKBKETF', type: 'ETF' },
      { symbol: 'BANKNIFTY SEP FUT', exchange: 'NFO', name: 'Bank Nifty September Future', type: 'FUT' },
      { symbol: 'BANKNIFTY OCT FUT', exchange: 'NFO', name: 'Bank Nifty October Future', type: 'FUT' },
      { symbol: 'BANKNIFTY NOV FUT', exchange: 'NFO', name: 'Bank Nifty November Future', type: 'FUT' },
      { symbol: 'BANKNIFTY SEP 40500 PE', exchange: 'NFO', name: 'Bank Nifty Sep 40500 Put', type: 'PE' },
      { symbol: 'BANKNIFTY SEP 40500 CE', exchange: 'NFO', name: 'Bank Nifty Sep 40500 Call', type: 'CE' },
      { symbol: 'BANKNIFTY SEP 42000 PE', exchange: 'NFO', name: 'Bank Nifty Sep 42000 Put', type: 'PE' },
      
      // INFY related
      { symbol: 'INFY', exchange: 'NSE', name: 'Infosys Limited', type: 'EQ' },
      { symbol: 'INFY', exchange: 'BSE', name: 'Infosys Limited', type: 'EQ' },
      { symbol: 'INFY SEP FUT', exchange: 'NFO', name: 'Infosys September Future', type: 'FUT' },
      { symbol: 'INFY OCT FUT', exchange: 'NFO', name: 'Infosys October Future', type: 'FUT' },
      { symbol: 'INFY SEP 1500 CE', exchange: 'NFO', name: 'Infosys Sep 1500 Call', type: 'CE' },
      { symbol: 'INFY SEP 1500 PE', exchange: 'NFO', name: 'Infosys Sep 1500 Put', type: 'PE' },
      
      // Common stocks
      { symbol: 'RELIANCE', exchange: 'NSE', name: 'Reliance Industries Ltd', type: 'EQ' },
      { symbol: 'TCS', exchange: 'NSE', name: 'Tata Consultancy Services', type: 'EQ' },
      { symbol: 'HDFCBANK', exchange: 'NSE', name: 'HDFC Bank Limited', type: 'EQ' },
      { symbol: 'ICICIBANK', exchange: 'NSE', name: 'ICICI Bank Limited', type: 'EQ' },
      { symbol: 'SBIN', exchange: 'NSE', name: 'State Bank of India', type: 'EQ' },
      { symbol: 'BHARTIARTL', exchange: 'NSE', name: 'Bharti Airtel Limited', type: 'EQ' },
      { symbol: 'KOTAKBANK', exchange: 'NSE', name: 'Kotak Mahindra Bank', type: 'EQ' },
      { symbol: 'LT', exchange: 'NSE', name: 'Larsen & Toubro Ltd', type: 'EQ' },
      { symbol: 'ASIANPAINT', exchange: 'NSE', name: 'Asian Paints Limited', type: 'EQ' },
      { symbol: 'MARUTI', exchange: 'NSE', name: 'Maruti Suzuki India Ltd', type: 'EQ' },
    ];

    return mockResults.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

function SearchPage({ onClose, onAddStock, onViewChart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('MF');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const tabs = ['MF', 'IPO', 'Events', 'Brands', 'ETF', 'G-Sec'];

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(async () => {
        const results = await searchStocks(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const getExchangeColor = (exchange) => {
    const colors = {
      'NSE': 'text-[#e11d48] bg-[#fef2f2]',
      'BSE': 'text-[#2563eb] bg-[#eff6ff]', 
      'NFO': 'text-[#6b7280] bg-[#f9fafb]',
      'MCX': 'text-[#059669] bg-[#f0fdf4]'
    };
    return colors[exchange] || 'text-[#6b7280] bg-[#f9fafb]';
  };

  const handleAddStock = (stock, event) => {
    event.stopPropagation(); // Prevent stock modal from opening when + button is clicked
    onAddStock(stock);
  };

  const handleStockClick = (stock) => {
    // Transform search result to stock modal format
    const stockData = {
      name: stock.symbol,
      exch: stock.exchange,
      price: Math.random() * 1000 + 100, // Mock price for demo
      change: (Math.random() - 0.5) * 20,
      pct: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 1000000),
      fullName: stock.name
    };
    stockData.pct = (stockData.change / stockData.price) * 100;
    
    setSelectedStock(stockData);
    setShowStockModal(true);
  };

  const handleCloseStockModal = () => {
    setShowStockModal(false);
    setSelectedStock(null);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 bg-[#f7f8fa] z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#eef1f5] px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 -ml-2">
            <Icon name="arrow-left" className="w-6 h-6 text-[#374151]" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-[16px] text-[#9aa3af] bg-transparent outline-none placeholder-[#9aa3af]"
              placeholder="Search eg: infy bse, nifty fut"
              autoFocus
            />
          </div>
          {searchQuery && (
            <button onClick={handleClear} className="text-[#2563eb] text-[16px] font-medium">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#eef1f5] px-4 py-3">
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[16px] font-medium transition-colors ${
                activeTab === tab ? 'text-[#0f172a]' : 'text-[#6b7280]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 bg-white overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#6b7280]">Searching...</div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="divide-y divide-[#eef1f5]">
            {searchResults.map((stock, index) => (
              <div 
                key={`${stock.symbol}-${stock.exchange}-${index}`} 
                className="px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleStockClick(stock)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`px-2 py-1 rounded text-[12px] font-medium ${getExchangeColor(stock.exchange)}`}>
                    {stock.exchange}
                  </div>
                  <div className="flex-1">
                    <div className="text-[16px] font-medium text-[#0f172a]">
                      {stock.symbol}
                    </div>
                    <div className="text-[14px] text-[#6b7280] mt-0.5">
                      {stock.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleAddStock(stock, e)}
                  className="w-8 h-8 rounded border-2 border-[#2563eb] flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <Icon name="plus" className="w-5 h-5 text-[#2563eb]" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        ) : searchQuery.length >= 2 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Icon name="search" className="w-12 h-12 text-[#d1d5db] mb-4" />
            <div className="text-[16px] font-medium text-[#374151] mb-2">No results found</div>
            <div className="text-[14px] text-[#6b7280]">Try searching for different keywords</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Icon name="search" className="w-12 h-12 text-[#d1d5db] mb-4" />
            <div className="text-[16px] font-medium text-[#374151] mb-2">Search for stocks</div>
            <div className="text-[14px] text-[#6b7280]">Type at least 2 characters to search</div>
          </div>
        )}
      </div>

      {/* Stock Modal */}
      <StockModal 
        isOpen={showStockModal}
        stock={selectedStock} 
        onClose={handleCloseStockModal}
        onViewChart={onViewChart}
      />
    </div>
  );
}

export default SearchPage;