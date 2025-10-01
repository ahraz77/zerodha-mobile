import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import Holdings from './holdings.jsx';
import Positions from './positions.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import StockModal from '../components/StockModal.jsx';
import SearchPage from '../components/SearchPage.jsx';
import OverviewModal from '../components/OverviewModal.jsx';
import stockAPI from '../services/stockAPI.js';
import { DataProvider, useData } from '../context/DataContext.jsx';
import Funds from './Funds.jsx';
import Settings from './settings.jsx';
import License from './license.jsx';
import InviteFriends from './invite_frds.jsx';
import ConnectedApps from './Connected_Apps.jsx';
import IPOApply from './ipoapply.jsx';
import BasketMobile from './basket.jsx';
import AddFundsMobile from './addfunds.jsx';
import ChartPage from './ChartPage.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Custom gavel to match the screenshot (Feather has no gavel)
function GavelIcon({ className = '', size = 24, strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16.5l3.5 3.5" />
      <path d="M3 21h7" />
      <rect x="12.2" y="4.2" width="5.2" height="3.2" rx="0.8" transform="rotate(45 14.8 5.8)" />
      <path d="M11 12l3 3" />
    </svg>
  );
}

// ---------- Demo data ----------
// Custom Rupee icon (Feather doesn't include a rupee glyph)
function RupeeIcon({ className = '', size = 24, strokeWidth = 2 }) {
  // Feather-like ₹ : two horizontal bars + angled leg
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top bar */}
      <path d="M7 6h10" />
      {/* Middle bar */}
      <path d="M7 10h10" />
      {/* Angled leg */}
      <path d="M13 14l4 6" />
    </svg>
  );
}



// Bids: IPO list (for IPO > Ongoing)
const ipos = [
  { company: 'Nexus Select Trust', symbol: 'NXST', price: '₹95 - ₹100', dates: '9th - 11th May', cta: 'Apply', status: 'ONGOING' },
  { company: 'Innokaiz India Limited', symbol: 'INNOKAIZ', price: '₹76 - ₹78', dates: '28th Apr - 3rd May', status: 'CLOSED', tag: 'SME' },
  { company: 'De Neers Tools Limited', symbol: 'DENEERS', price: '₹95 - ₹101', dates: '28th Apr - 3rd May', status: 'CLOSED', tag: 'SME' },
  { company: 'Mankind Pharma Limited', symbol: 'MANKIND', price: '₹1026 - ₹1080', dates: '25th - 27th Apr', status: 'CLOSED' },
  { company: 'Retina Paints Limited', symbol: 'RETINA', price: '₹30', dates: '19th - 24th Apr', status: 'CLOSED', tag: 'SME' }
];

// Bids: Auctions list
const auctions = [
  { qty: 1, symbol: 'HINDCOPPER', holdPrice: '131.70', pnl: -24.95, ref: '#2531', ltp: '0.00' },
  { qty: 1, symbol: 'HUDCO', holdPrice: '41.35', pnl: 14.69, ref: '#2532', ltp: '0.00' },
  { qty: 5, symbol: 'IOC', holdPrice: '55.04', pnl: 139.30, ref: '#2539', ltp: '0.00' },
  { qty: 1, symbol: 'IRCON', holdPrice: '46.10', pnl: 39.41, ref: '#2540', ltp: '0.00' },
  { qty: 6, symbol: 'JPPOWER', holdPrice: '7.45', pnl: -9.12, ref: '#5003', ltp: '0.00' },
  { qty: 2, symbol: 'L&TFH', holdPrice: '90.92', pnl: 14.25, ref: '#5013', ltp: '0.00' }
];

// Watchlist demo data
const wlFavorites = [
  { name: 'ASTRON', exch: 'NSE', price: 26.05, change: -0.35, pct: -1.32 },
  { name: 'ASIANPAINT', exch: 'NSE', price: 3092.45, change: -45.65, pct: -1.45 },
  { name: 'RITES', exch: 'NSE', price: 396.50, change: 8.15, pct: 2.09 },
  { name: 'BHEL', exch: 'BSE', price: 82.30, change: 0.74, pct: 0.90, copies: 43 },
  { name: 'RELIANCE', exch: 'NSE', price: 2439.30, change: -14.50, pct: -0.59 },
  { name: 'NIFTYBEES', exch: 'BSE', price: 199.79, change: -0.76, pct: -0.37 }
];
const wlMyList = [
  { name: 'LUPIN', exch: 'BSE', price: 0, change: 0, pct: 0 },
  { name: 'RELIANCE', exch: 'NSE', price: 2439.30, change: -14.50, pct: -0.59 },
  { name: 'SBIN', exch: 'NSE', price: 0, change: 0, pct: 0, copies: 4 },
  { name: 'TATAMOTORS', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'MARUTI', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'IRCTC', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'YESBANK', exch: 'NSE', price: 0, change: 0, pct: 0 }
];

// ---------- Portfolio Page ----------
function PortfolioPage({ setActive, onViewChart }) {
  const [tab, setTab] = useState('holdings');
  const [showOverview, setShowOverview] = useState(false);
  const { holdings, positions } = useData();
  
  // Calculate actual counts
  const holdingsCount = holdings ? holdings.length : 0;
  const positionsCount = positions ? positions.length : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl leading-8 text-[#0f172a] font-bold">Portfolio</h1>
          <div className="flex items-center gap-5">
            <button onClick={() => setActive('basket')} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
            </button>
            <button 
              onClick={() => setShowOverview(true)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-center gap-6 text-[16px] text-[#334155]">
          <button onClick={() => setTab('holdings')} className={`relative pb-2 transition-colors ${tab === 'holdings' ? 'text-[#3D73F1]' : ''}`}>
            <span className="align-middle">Holdings</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] ${tab === 'holdings' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>{holdingsCount}</span>
            {tab === 'holdings' && <span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />}
          </button>
          <button onClick={() => setTab('positions')} className={`relative pb-2 transition-colors ${tab === 'positions' ? 'text-[#3D73F1]' : ''}`}>
            <span>Positions</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] ${tab === 'positions' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>{positionsCount}</span>
            {tab === 'positions' && <span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />}
          </button>
        </div>
      </div>

      {/* Content components */}
      {tab === 'holdings' ? <Holdings onViewChart={onViewChart} /> : <Positions onViewChart={onViewChart} />}
      
      {/* Overview Modal */}
      <OverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
      />
    </div>
  );
}

// ---------- Watchlist Page ----------
function WatchlistRow({ item, onStockClick }) {
  const pos = item.change > 0;
  const zero = item.price === 0;
  return (
    <div 
      className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onStockClick(item)}
    >
      <div className="grid grid-cols-[1fr_auto] items-center">
        <div>
          <div className="text-[15px] tracking-wide text-[#0f172a]">{item.name}</div>
          <div className="mt-1 text-[12px] text-[#9aa3af] flex items-center gap-2">
            <span>{item.exch}</span>
            {item.copies && (
              <span className="inline-flex items-center gap-1 text-[#94a3b8]"><Icon name="copy" className="w-3.5 h-3.5" /> {item.copies}</span>
            )}
          </div>
        </div>
        <div className={`text-[15px] ${zero ? 'text-[#6b7280]' : pos ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {zero ? '0.00' : item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
        <div />
        <div className={`justify-self-end ${zero ? '' : pos ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {zero ? '0.00 (0.00%)' : `${pos ? '+' : ''}${item.change.toFixed(2)} (${pos ? '+' : ''}${item.pct.toFixed(2)}%)`}
        </div>
      </div>
    </div>
  );
}

function WatchlistPage({ setActive, onViewChart }) {
  const [tab, setTab] = useState('favorites');
  const [watchlistData, setWatchlistData] = useState({ favorites: [], myList: [] });
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  // Debug: Test if modal works
  const handleOverviewClick = () => {
    console.log('Overview button clicked!');
    setShowOverview(true);
  };

  // Stock symbols for each list - now using state to allow dynamic updates
  const [favoriteSymbols, setFavoriteSymbols] = useState(['RELIANCE', 'TCS', 'HDFC', 'INFY', 'ASIANPAINT', 'MARUTI']);
  const [myListSymbols, setMyListSymbols] = useState(['SBIN', 'TATAMOTORS', 'BHARTIARTL', 'BAJFINANCE', 'HCLTECH', 'HINDUNILVR', 'ICICIBANK']);

  useEffect(() => {
    fetchWatchlistData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchWatchlistData, 30000);
    return () => clearInterval(interval);
  }, [favoriteSymbols, myListSymbols]);

  const fetchWatchlistData = async () => {
    try {
      console.log('Fetching watchlist data...', { favoriteSymbols, myListSymbols });
      const [favoritesData, myListData] = await Promise.all([
        stockAPI.fetchStockData(favoriteSymbols),
        stockAPI.fetchStockData(myListSymbols)
      ]);
      console.log('Received data:', { favoritesData, myListData });

      const formatStockData = (data, symbols) => {
        return data.map((stock, index) => ({
          name: stock.symbol,
          exch: stock.symbol.startsWith('^') || stock.symbol.includes('INDEX') ? 'INDICES' : 'NSE',
          price: stock.price,
          change: stock.change,
          pct: stock.changePercent,
          copies: stock.symbol === 'BHEL' ? 43 : stock.symbol === 'SBIN' ? 4 : undefined,
          volume: stock.volume,
          lastUpdated: stock.lastUpdated
        }));
      };

      setWatchlistData({
        favorites: formatStockData(favoritesData, favoriteSymbols),
        myList: formatStockData(myListData, myListSymbols)
      });
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
      // Fallback to original dummy data
      setWatchlistData({
        favorites: wlFavorites,
        myList: wlMyList
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleAddStock = async (stock) => {
    console.log('Adding stock to watchlist:', stock);
    
    // Add stock to current tab (favorites or myList)
    const currentTab = tab === 'favorites' ? 'favorites' : 'myList';
    const stockSymbol = stock.symbol;
    
    // Check if stock already exists in current tab
    const currentItems = tab === 'favorites' ? favoriteSymbols : myListSymbols;
    if (currentItems.includes(stockSymbol)) {
      console.log('Stock already exists in', currentTab);
      setShowSearch(false);
      return;
    }
    
    // Update the symbols array for the current tab
    if (tab === 'favorites') {
      setFavoriteSymbols(prev => [...prev, stockSymbol]);
    } else {
      setMyListSymbols(prev => [...prev, stockSymbol]);
    }
    
    try {
      // Fetch real-time data for the new stock
      const stockData = await stockAPI.fetchStockData([stockSymbol]);
      const newStock = {
        name: stockData[0].symbol,
        exch: stock.exchange || 'NSE',
        price: stockData[0].price,
        change: stockData[0].change,
        pct: stockData[0].changePercent,
        volume: stockData[0].volume,
        lastUpdated: stockData[0].lastUpdated
      };
      
      // Add to watchlist data
      setWatchlistData(prev => ({
        ...prev,
        [currentTab]: [...prev[currentTab], newStock]
      }));
      
      console.log('Stock added successfully:', newStock);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      
      // Fallback: add with basic info
      const newStock = {
        name: stockSymbol,
        exch: stock.exchange || 'NSE',
        price: 0,
        change: 0,
        pct: 0
      };
      
      setWatchlistData(prev => ({
        ...prev,
        [currentTab]: [...prev[currentTab], newStock]
      }));
    }
    
    // Close search page
    setShowSearch(false);
  };

  if (showSearch) {
    return (
      <SearchPage 
        onClose={handleCloseSearch}
        onAddStock={handleAddStock}
        onViewChart={onViewChart}
      />
    );
  }

  const items = tab === 'favorites' ? (watchlistData.favorites || []) : (watchlistData.myList || []);
  const count = tab === 'favorites' ? `${items.length}/100` : `${items.length}/100`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl leading-8 text-[#0f172a] font-bold">Watchlist</h1>
          <div className="flex items-center gap-5">
            <button onClick={() => setActive('basket')} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
            </button>
            <button 
              onClick={handleOverviewClick}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
            </button>
          </div>
        </div>
      </header>

      {/* Top tabs */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-6 text-[16px] text-[#374151]">
          {([
            {key:'favorites', label:'Favorites'}, {key:'my', label:'My list'}
          ]).map(({key,label}) => (
            <button key={key} onClick={()=>setTab(key)} className={`relative pb-2 ${tab===key?'text-[#2563eb]':''}`}>
              {label}
              {tab===key && <span className="absolute -bottom-[3px] left-0 w-8 h-[3px] bg-[#2563eb] rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 mt-3">
        <button 
          onClick={handleSearchClick}
          className="w-full bg-white rounded-[12px] px-3 py-3 flex items-center justify-between shadow-[0_1px_0_0_#eef1f5] hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 text-[#9aa3af]">
            <Icon name="search" className="w-5 h-5 text-[#9aa3af]" />
            <span className="text-[15px]">Search & add</span>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
            <span>{count}</span>
            <Icon name="sliders" className="w-5 h-5 text-[#6b7280]" />
          </div>
        </button>
      </div>

      {/* List */}
      <div className="mt-2 bg-white divide-y divide-[#eef1f5]">
        {loading ? (
          <div className="p-8 text-center text-[#9aa3af]">
            <div className="animate-spin mx-auto mb-2 w-6 h-6 border-2 border-[#0070f3] border-t-transparent rounded-full"></div>
            <div>Loading watchlist...</div>
          </div>
        ) : (
          items.map((item, idx) => (
            <div 
              key={idx}
              className="px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              onClick={() => handleStockClick(item)}
            >
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="text-[15px] tracking-wide text-[#0f172a]">{item.name}</div>
                  <div className="mt-1 text-[12px] text-[#9aa3af] flex items-center gap-2">
                    <span>{item.exch}</span>
                    {item.copies && (
                      <span className="inline-flex items-center gap-1 text-[#94a3b8]">
                        <Icon name="copy" className="w-3.5 h-3.5" /> {item.copies}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`text-[15px] ${item.price === 0 ? 'text-[#6b7280]' : item.change > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {item.price === 0 ? '0.00' : item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                <div />
                <div className={`justify-self-end ${item.price === 0 ? '' : item.change > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {item.price === 0 ? '0.00 (0.00%)' : `${item.change > 0 ? '+' : ''}${item.change.toFixed(2)} (${item.change > 0 ? '+' : ''}${item.pct.toFixed(2)}%)`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stock Modal */}
      <StockModal 
        isOpen={showModal}
        stock={selectedStock} 
        onClose={handleCloseModal}
        onViewChart={onViewChart}
      />
      
      {/* Overview Modal */}
      <OverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
      />
    </div>
  );
}

// ---------- Orders Page ----------
function StatusChip({ children, tone='gray' }) {
  const tones = {
    gray: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]',
    green: 'bg-[#EAF7EE] text-[#10B981] border-[#c7f0d9]',
    red: 'bg-[#FEE2E2] text-[#EF4444] border-[#fecaca]',
    blue: 'bg-[#EEF2FF] text-[#2563eb] border-[#e0e7ff]'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] border ${tones[tone]}`}>{children}</span>;
}

function OrdersPage({ setActive }) {
  const [tab, setTab] = useState('open');
  const [showOverview, setShowOverview] = useState(false);
  const { orders, loading, error } = useData();

  const Header = (
    <header className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl leading-8 text-[#0f172a] font-bold">Orders</h1>
        <div className="flex items-center gap-5">
          <button onClick={() => setActive('basket')} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
          </button>
          <button 
            onClick={() => setShowOverview(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
          </button>
        </div>
      </div>
    </header>
  );

  const TopTabs = (
    <div className="px-4 mt-4">
      <div
        className="flex items-center gap-6 text-[16px] text-[#6b7280] overflow-x-auto whitespace-nowrap -mx-4 px-4"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {([
          { k: 'open', l: 'Open', n: 6 },
          { k: 'executed', l: 'Executed', n: 5 },
          { k: 'gtt', l: 'GTT', n: 5 },
          { k: 'baskets', l: 'Baskets', n: 5 },
          { k: 'sips', l: 'SIPs', n: 2 },
          { k: 'alerts', l: 'Alerts', n: 3 }
        ]).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`relative pb-3 shrink-0 ${tab === t.k ? 'text-[#2563eb]' : 'text-[#6b7280]'}`}
          >
            {t.l}
            <span
              className={`ml-2 inline-flex items-center justify-center rounded-full min-w-[20px] h-[20px] text-[11px] ${
                tab === t.k ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-[#e5e7eb] text-[#6b7280]'
              }`}
            >
              {t.n}
            </span>
            {tab === t.k && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563eb]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchRow = (
    <div className="px-4 mt-3">
      <div className="flex items-center justify-between bg-white rounded-t-[16px] px-3 py-2">
        <div className="flex items-center gap-4">
          {(tab === 'open' || tab === 'executed' || tab === 'gtt' || tab === 'alerts') && (
            <>
              <Icon name="search" className="w-5 h-5 text-[#2563eb]" />
              <Icon name="sliders" className="w-5 h-5 text-[#2563eb]" />
            </>
          )}
          {tab === 'baskets' && (
            <Icon name="search" className="w-5 h-5 text-[#2563eb]" />
          )}
          {tab === 'sips' && (
            <Icon name="search" className="w-5 h-5 text-[#2563eb]" />
          )}
        </div>
        <div className="flex items-center gap-4 text-[#2563eb]">
          {tab === 'executed' && (
            <>
              <div className="flex items-center gap-2">
                <Icon name="file-text" className="w-3 h-3 text-[#2563eb]" />
                <span className="text-[13px]">Contract note</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/console.svg" className="w-3 h-3" style={{ mixBlendMode: 'multiply' }} alt="Tradebook" />
                <span className="text-[13px]">Tradebook</span>
              </div>
            </>
          )}
          {tab === 'open' && (
            <>
              <img src="/images/console.svg" className="w-3 h-3" style={{ mixBlendMode: 'multiply' }} alt="Tradebook" />
              <span className="text-[13px]">Tradebook</span>
            </>
          )}
          {tab === 'alerts' && (
            <>
              <span className="text-[13px] text-[#2563eb]">+ New alert</span>
            </>
          )}
          {tab === 'baskets' && (
            <>
              <span className="text-[13px] text-[#2563eb]">+ New basket</span>
            </>
          )}
          {tab === 'sips' && (
            <>
              <span className="text-[13px] text-[#2563eb]">+ New SIP</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {Header}
      {TopTabs}
      {SearchRow}

      {/* Content sections */}
      {tab==='open' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-red-500">Error loading orders: {error}</div>
          ) : orders.filter(order => order.status === 'OPEN').length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No open orders</div>
          ) : (
            orders.filter(order => order.status === 'OPEN').map((order) => (
              <div key={order._id || order.id} className="px-4 py-4">
                <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                  <div className="flex items-center gap-3">
                    <StatusChip tone={order.type === 'SELL' ? 'red' : 'blue'}>{order.type}</StatusChip> 
                    <span>0/{order.qty}</span>
                  </div>
                  <div className="justify-self-end inline-flex items-center gap-2">
                    <Icon name="clock" className="w-4 h-4 text-[#94a3b8]" /> 
                    {order.time}
                    <StatusChip>{order.status}</StatusChip>
                  </div>
                </div>
                <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                  <div className="text-[18px] tracking-wide text-[#0f172a]">{order.symbol}</div>
                  <div className="text-[15px] text-[#0f172a]">
                    {order.price !== '0.00' ? order.price : ''} 
                    {order.trigger && order.trigger !== '' ? ` / ${order.trigger} trg.` : ''}
                  </div>
                </div>
                <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                  <div>{order.exchange}  {order.product}  {order.orderType}</div>
                  <div className="justify-self-end">LTP {order.ltp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab==='executed' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-red-500">Error loading orders: {error}</div>
          ) : orders.filter(order => ['COMPLETE', 'REJECTED', 'CANCELLED'].includes(order.status)).length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No executed orders</div>
          ) : (
            orders.filter(order => ['COMPLETE', 'REJECTED', 'CANCELLED'].includes(order.status)).map((order) => (
              <div key={order._id || order.id} className="px-4 py-4">
                <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                  <div className="flex items-center gap-3">
                    <StatusChip tone={order.type === 'SELL' ? 'red' : 'blue'}>{order.type}</StatusChip> 
                    <span>{order.status === 'COMPLETE' ? `${order.qty}/${order.qty}` : `0/${order.qty}`}</span>
                  </div>
                  <div className="justify-self-end inline-flex items-center gap-2">
                    <Icon name="clock" className="w-4 h-4 text-[#94a3b8]" /> 
                    {order.time}
                    <StatusChip tone={order.status === 'COMPLETE' ? 'green' : 'red'}>{order.status}</StatusChip>
                  </div>
                </div>
                <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                  <div className="text-[18px] tracking-wide text-[#0f172a]">{order.symbol}</div>
                  <div className="text-[15px] text-[#0f172a]">
                    {order.status === 'COMPLETE' && order.price !== '0.00' ? `Avg. ${order.price}` : order.price !== '0.00' ? order.price : '0.00'}
                  </div>
                </div>
                <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                  <div>{order.exchange}  {order.product}  {order.orderType}</div>
                  <div />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab==='gtt' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[1,2,3,4,5].map((i)=> (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                <div className="flex items-center gap-3"><StatusChip tone="gray">{i===1||i===4? 'OCO' : 'SINGLE'}</StatusChip> <StatusChip tone={i===2||i===3?'red':'blue'}>{(i===2||i===3)?'SELL':'BUY'}</StatusChip></div>
                <StatusChip tone="green">{i<=3?'ACTIVE':'TRIGGERED'}</StatusChip>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] tracking-wide text-[#0f172a]">{i===1?'PNB':i===2?'IDEA':i===3?'ONGC':'NIFTY2351118300CE'}</div>
                <div className="text-[15px] text-[#0f172a]">{i===1?'47.80 / 52.85':i===2?'6.65':i===3?'136.20': i===4?'50.40 / 51.45':'51.05 / 50.00'}</div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                <div>Qty {i===1? '1/1' : i===4 || i===5 ? '50/50' : '1'}</div>
                <div className="justify-self-end">LTP 0.00</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='baskets' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {['Bull call spread','Calender spread','Butterfly Spread','IT stocks','ETFs'].map((n,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="text-[16px] text-[#0f172a]">{n}</div>
                  <div className="text-[12px] text-[#9aa3af] mt-1">Created on 8th May 2023</div>
                </div>
                <div className="text-[14px] text-[#6b7280]">{[2,2,3,4,4][idx]} items</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='sips' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[{n:'Weekly SIPs', s:'ACTIVE', sub:'Executes today'},{n:'Monthly SIPs', s:'PAUSED', sub:'Created on 15th February 2023'}].map((r,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="text-[16px] text-[#0f172a]">{r.n}</div>
                  <div className="text-[12px] text-[#9aa3af] mt-1">{r.sub}</div>
                </div>
                <StatusChip tone={r.s==='ACTIVE'?'green':'red'}>{r.s}</StatusChip>
              </div>
              <div className="text-[12px] text-[#6b7280] mt-1">1 basket</div>
            </div>
          ))}
        </div>
      )}

      {tab==='alerts' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[{t:'Nifty 10% down from all time high', s:'ENABLED', sub:'Last price of NIFTY 50(INDICES) < 17,300.00'}, {t:'SBIN up- buy 100 qty', s:'DISABLED', sub:'Last price of SBIN(NSE) >= 573.35'}, {t:'Buy at 50rs', s:'ENABLED', sub:'Last price of NIFTY23MAY18300CE(NFO) < 50.00'}].map((a,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div className="text-[16px] text-[#0f172a]">{a.t}</div>
                <StatusChip tone={a.s==='ENABLED'?'green':'red'}>{a.s}</StatusChip>
              </div>
              <div className="text-[12px] text-[#9aa3af] mt-1">{a.sub}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Overview Modal */}
      <OverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
      />
    </div>
  );
}

// ---------- Bids Page ----------
function BidsPage({ setActive }) {
  const [tab, setTab] = useState('ipo');
  const [ipoSub, setIpoSub] = useState('ongoing');
  const [showOverview, setShowOverview] = useState(false);
  const [showIPOApply, setShowIPOApply] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState(null);

  const handleApplyClick = (ipo) => {
    setSelectedIPO(ipo);
    setShowIPOApply(true);
  };

  const handleBackFromIPO = () => {
    setShowIPOApply(false);
    setSelectedIPO(null);
  };

  const Header = (
    <header className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl leading-8 text-[#0f172a] font-bold">Bids</h1>
        <div className="flex items-center gap-5">
          <button onClick={() => setActive('basket')} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
          </button>
          <button 
            onClick={() => setShowOverview(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
          </button>
        </div>
      </div>
    </header>
  );

  const TabPills = (
    <div className="px-4 mt-4">
      <div className="flex items-center justify-center gap-6 text-[16px] text-[#334155]">
        {(['ipo','govt','auctions']).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative pb-2 transition-colors ${tab===t?'text-[#3D73F1]':''}`}>
            <span className="align-middle">{t === 'ipo' ? 'IPO' : t === 'govt' ? 'Govt. securities' : 'Auctions'}</span>
            {t==='ipo' && (<span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] ${tab==='ipo'?'bg-[#dbeafe] text-[#3D73F1]':'bg-[#e5e7eb] text-[#475569]'}`}>1</span>)}
            {t==='auctions' && (<span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] ${tab==='auctions'?'bg-[#dbeafe] text-[#3D73F1]':'bg-[#e5e7eb] text-[#475569]'}`}>18</span>)}
            {tab===t && <span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchRow = (
    <div className="px-4 mt-3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center bg-white rounded-t-[16px] px-3 py-2">
        <div className="flex items-center gap-4"><Icon name="search" className="w-5 h-5 text-[#2563eb]" /><Icon name="sliders" className="w-5 h-5 text-[#2563eb]" /></div>
        <div />
        {tab==='ipo' ? (
          <div className="flex gap-1 text-[13px]">
            {(['ongoing','applied','upcoming']).map(s => (
              <button key={s} onClick={()=>setIpoSub(s)} className={`px-3 h-6 inline-flex items-center rounded-[8px] ${ipoSub===s?'bg-[#e5edff] text-[#2563eb]':'text-[#6b7280] bg-white hover:bg-[#f9fafb]'} transition-all duration-200`}>{s[0].toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        ) : <div />}
      </div>
    </div>
  );

  // Show IPO Apply page if selected
  if (showIPOApply) {
    return <IPOApply onBack={handleBackFromIPO} ipoData={selectedIPO} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {Header}
      {TabPills}
      {SearchRow}

      {tab==='ipo' && ipoSub==='ongoing' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {ipos.map((it, idx) => (
            <div key={idx} className="px-4 py-5">
              <div className="text-[13px] text-[#9aa3af]">{it.company}</div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] tracking-wide text-[#0f172a] flex items-center gap-2">{it.symbol}{it.tag && <span className="text-[12px] text-[#2563eb]">{it.tag}</span>}</div>
                {it.cta ? (
                  <button 
                    onClick={() => handleApplyClick(it)}
                    className="justify-self-end h-8 px-3.5 rounded-[8px] bg-[#3B82F6] text-white text-[14px] shadow-sm hover:bg-[#2563eb] active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#bfdbfe]"
                  >
                    {it.cta}
                  </button>
                ) : (
                  <span className="justify-self-end h-8 inline-flex items-center px-3.5 rounded-[8px] bg-[#f3f4f6] text-[#6b7280] text-[13px] border border-[#e5e7eb]">{it.status}</span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto] text-[14px] text-[#6b7280]"><div>{it.price}</div><div className="justify-self-end">{it.dates}</div></div>
            </div>
          ))}
          <div className="px-4 py-5"><button className="text-[#2563eb] text-[16px] inline-flex items-center gap-2 hover:underline active:translate-y-[0.5px] transition">View upcoming IPOs <Icon name="arrow-right" className="w-5 h-5 text-[#2563eb]" /></button></div>
        </div>
      )}

      {tab==='govt' && (
        <div className="bg-white flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="w-44 h-36 border-2 border-dashed border-[#d1d5db] rounded-[12px] flex items-center justify-center mb-6"><div className="w-24 h-16 bg-[#f3f4f6] rounded" /></div>
          <div className="text-[18px] text-[#374151]">No securities available for bidding</div>
          <button className="mt-4 text-[#2563eb] text-[16px]">Read more</button>
        </div>
      )}

      {tab==='auctions' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {auctions.map((a, i) => (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]"><div>Eligible qty <span className="text-[#0f172a]">{a.qty}</span></div><div className="justify-self-end">Holding P&L <span className={`${a.pnl>=0?'text-[#10B981]':'text-[#EF4444]'}`}>{a.pnl>=0?`+${a.pnl.toFixed(2)}`:a.pnl.toFixed(2)}</span></div></div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center"><div className="text-[18px] text-[#0f172a] tracking-wide">{a.symbol}</div><div className="text-[14px] text-[#6b7280]">{a.ref}</div></div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[13px] text-[#9aa3af]"><div>Holding price <span className="text-[#0f172a]">{a.holdPrice}</span></div><div className="justify-self-end">LTP {a.ltp}</div></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Overview Modal */}
      <OverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
      />
    </div>
  );
}

// ---------- Profile Page ----------
function RowItem({ left, right, icon, onClick }) {
  return (
    <div 
      className="px-4 py-4 flex items-center justify-between border-b border-[#eef1f5] cursor-pointer active:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[15px] text-[#0f172a]">{left}</span>
      </div>
      {right || <Icon name="chevron-right" className="w-5 h-5 text-[#9aa3af]" />}
    </div>
  );
}

function ChipLink({ children, onClick }) {
  const handleConsoleClick = () => {
    const baseUrl = 'https://zerodha-kite-zeta.vercel.app/console';
    let url;
    
    // Map console items to their respective URLs
    switch (children) {
      case 'Portfolio':
        url = `${baseUrl}?tab=Portfolio`;
        break;
      case 'Tradebook':
        url = `${baseUrl}?tab=Dashboard`;
        break;
      case 'P&L':
      case 'Tax P&L':
      case 'Gift stocks':
      case 'Family':
      case 'Downloads':
        url = `${baseUrl}?tab=Reports`;
        break;
      default:
        url = `${baseUrl}?tab=Reports`;
    }
    
    // Open in new external Chrome tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <button 
      onClick={handleConsoleClick}
      className="text-[#2563eb] text-[15px] px-2 py-1 rounded-md hover:underline active:translate-y-[0.5px]"
    >
      {children}
    </button>
  );
}

function ProfilePage({ setActive, showAppCode, setShowAppCode, appCode, navigate }) {
  const [privacy, setPrivacy] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Countdown timer for app code changes
  useEffect(() => {
    if (showAppCode) {
      setCountdown(30); // Reset countdown when modal opens
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 30; // Reset to 30 when it reaches 0
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showAppCode, appCode]); // Reset when appCode changes

  // External links handlers
  const handleSupportPortalClick = () => {
    window.open('https://support.zerodha.com/', '_blank');
  };

  const handleContactClick = () => {
    window.open('https://zerodha.com/contact', '_blank');
  };

  const handleUserManualClick = () => {
    window.open('https://kite.trade/docs/kite/', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4 bg-[#eff1f5]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[20px] text-[#0f172a] font-medium">Ahraz</div>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setActive('basket')} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
              <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
            </button>
            <button 
              onClick={() => setShowOverview(true)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
            </button>
          </div>
        </div>
      </header>

      {/* Account Card */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-[12px] shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[16px] font-medium text-[#0f172a]">FJP018</div>
              <div className="text-[13px] text-[#9aa3af]">ahraz@gmail.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center text-[14px] text-[#334155]">AZ</div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[14px] text-[#6b7280]">Privacy mode</div>
            <button onClick={()=>setPrivacy(!privacy)} className="transition-transform active:scale-95">
              <img 
                src="/images/toggle.png" 
                alt="Toggle" 
                className="w-16 h-14 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Account section */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Account</div>
        <RowItem 
          left="Funds" 
          right={<RupeeIcon className="w-5 h-5 text-[#6b7280]" size={20} strokeWidth={2} />} 
          onClick={() => setActive('funds')}
        />
        <RowItem 
          left="App Code" 
          right={<Icon name="lock" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={() => setShowAppCode(true)}
        />
        <RowItem 
          left="Profile" 
          right={<Icon name="user" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Profile RowItem clicked!');
            console.log('Navigate function:', navigate);
            console.log('Current location:', window.location.href);
            
            // Try multiple navigation methods
            try {
              if (navigate && typeof navigate === 'function') {
                console.log('Using React Router navigate');
                navigate('/profile');
              } else {
                console.log('Using window.location');
                window.location.href = '/profile';
              }
            } catch (error) {
              console.error('Navigation error:', error);
              alert('Navigation failed: ' + error.message);
            }
          }}
        />
        <RowItem 
          left="Settings" 
          right={<Icon name="settings" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={() => setActive('settings')}
        />
        <RowItem 
          left="Connected apps" 
          right={<Icon name="box" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={() => setActive('connected_apps')}
        />
        <RowItem left="Logout" right={<Icon name="log-out" className="w-5 h-5 text-[#6b7280]" />} />
      </section>

      {/* Console quick links */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Console</div>
        <div className="px-4 pb-4 flex flex-wrap gap-x-6 gap-y-3 text-[#2563eb]">
          <ChipLink>Portfolio</ChipLink>
          <ChipLink>Tradebook</ChipLink>
          <ChipLink>P&amp;L</ChipLink>
          <ChipLink>Tax P&amp;L</ChipLink>
          <ChipLink>Gift stocks</ChipLink>
          <ChipLink>Family</ChipLink>
          <ChipLink>Downloads</ChipLink>
        </div>
      </section>

      {/* Support */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Support</div>
        <RowItem 
          left="Support portal" 
          right={<Icon name="life-buoy" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={handleSupportPortalClick}
        />
        <RowItem 
          left="User manual" 
          right={<Icon name="help-circle" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={handleUserManualClick}
        />
        <RowItem 
          left="Contact" 
          right={<Icon name="phone" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={handleContactClick}
        />
      </section>

      {/* Others */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Others</div>
        <RowItem 
          left="Invite friends" 
          right={<Icon name="user-plus" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={() => setActive('invite_frds')}
        />
        <RowItem 
          left="Licenses" 
          right={<Icon name="file-text" className="w-5 h-5 text-[#6b7280]" />} 
          onClick={() => setActive('license')}
        />
        <div className="px-4 py-4 text-[12px] text-[#9aa3af]">Kite v3 b234</div>
      </section>

      {/* Footer */}
      <div className="py-8 flex items-center justify-center text-[#c4c7ce]">
        <div className="tracking-widest text-[12px]">ZERODHA</div>
      </div>
      
      {/* Overview Modal */}
      <OverviewModal 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
      />
      
      {/* App Code Modal */}
      {showAppCode && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAppCode(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full bg-white rounded-t-2xl transform transition-transform duration-300 animate-slide-up">
            <div className="px-6 py-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">App Code</h2>
              <p className="text-gray-600 text-sm mb-8">Enter this code to login to Kite web</p>
              
              {/* Code Display */}
              <div className="flex justify-center items-center space-x-3 mb-8">
                {appCode.split('').map((digit, index) => (
                  <span 
                    key={index} 
                    className="text-4xl text-gray-900"
                  >
                    {digit}
                  </span>
                ))}
              </div>
              
              {/* Timer indicator */}
              <div className="text-blue-500 text-sm">
                Changes in {countdown}s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Shell with bottom nav ----------
export default function App() {
  // Initialize active tab from localStorage or default to 'watchlist'
  const [active, setActive] = useState(() => {
    return localStorage.getItem('activeTab') || 'watchlist';
  });
  const [adminMode, setAdminMode] = useState(false);
  const [showAppCode, setShowAppCode] = useState(false);
  const [appCode, setAppCode] = useState('064745');
  const [showChart, setShowChart] = useState(false);
  const [selectedChartStock, setSelectedChartStock] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', active);
  }, [active]);

  // Check URL parameters and handle navigation state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
      // If there's a tab parameter in URL, use it
      setActive(tabParam);
    } else {
      // Otherwise, check for specific URL patterns
      const pathname = location.pathname;
      if (pathname.includes('/portfolio')) {
        // If we're on portfolio page without specific tab, keep current active tab
        // This maintains the state when refreshing
      }
    }
  }, [location.search, location.pathname]);

  // Generate new 6-digit app code every 30 seconds
  useEffect(() => {
    const generateCode = () => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setAppCode(newCode);
    };

    const interval = setInterval(generateCode, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Admin access - triple click on logo to activate
  // Chart navigation functions
  const handleShowChart = (stock) => {
    setSelectedChartStock(stock);
    setShowChart(true);
  };

  const handleCloseChart = () => {
    setShowChart(false);
    setSelectedChartStock(null);
  };

  const handleLogoClick = () => {
    let clickCount = parseInt(localStorage.getItem('logoClicks') || '0');
    clickCount++;
    localStorage.setItem('logoClicks', clickCount.toString());
    
    if (clickCount >= 3) {
      setAdminMode(true);
      localStorage.removeItem('logoClicks');
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      localStorage.removeItem('logoClicks');
    }, 2000);
  };

  if (adminMode) {
    return (
      <DataProvider>
        <AdminDashboard />
      </DataProvider>
    );
  }

  if (showChart) {
    return (
      <ChartPage 
        stock={selectedChartStock}
        onBack={handleCloseChart}
      />
    );
  }

  return (
    <DataProvider>
      <div className="relative min-h-screen bg-[#f7f8fa]">
      {/* Hidden Admin Access Button - moved to bottom left to avoid interference */}
      <button
        onClick={handleLogoClick}
        className="fixed bottom-20 left-2 w-8 h-8 opacity-0 hover:opacity-20 z-50 bg-blue-600 rounded"
        title="Triple click for admin access"
      />
      
      <div className="pb-[calc(64px+env(safe-area-inset-bottom))]">
        {active === 'watchlist' && <WatchlistPage setActive={setActive} onViewChart={handleShowChart} />}
        {active === 'orders' && <OrdersPage setActive={setActive} />}
        {active === 'portfolio' && <PortfolioPage setActive={setActive} onViewChart={handleShowChart} />}
        {active === 'bids' && <BidsPage setActive={setActive} />}
        {active === 'basket' && <BasketMobile setActive={setActive} />}
        {active === 'user' && <ProfilePage setActive={setActive} showAppCode={showAppCode} setShowAppCode={setShowAppCode} appCode={appCode} navigate={navigate} />}
        {active === 'funds' && <Funds setActive={setActive} />}
        {active === 'addfunds' && <AddFundsMobile setActive={setActive} />}
        {active === 'settings' && <Settings />}
        {active === 'license' && <License />}
        {active === 'invite_frds' && <InviteFriends />}
        {active === 'connected_apps' && <ConnectedApps />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#e5e7eb] grid grid-cols-5" style={{height:'calc(64px + env(safe-area-inset-bottom))', paddingBottom:'env(safe-area-inset-bottom)'}}>
        {/* Watchlist */}
        <button onClick={()=>setActive('watchlist')} className={`flex flex-col items-center justify-center text-[12px] ${active==='watchlist'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="bookmark" className={`w-7 h-7 ${active==='watchlist'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Watchlist</span>
        </button>
        {/* Orders (placeholder) */}
        <button onClick={()=>setActive('orders')} className={`flex flex-col items-center justify-center text-[12px] ${active==='orders'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="book" className={`w-7 h-7 ${active==='orders'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Orders</span>
        </button>
        {/* Portfolio */}
        <button onClick={()=>setActive('portfolio')} className={`flex flex-col items-center justify-center text-[12px] ${active==='portfolio'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="briefcase" className={`w-7 h-7 ${active==='portfolio'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Portfolio</span>
        </button>
        {/* Bids */}
        <button onClick={()=>setActive('bids')} className={`flex flex-col items-center justify-center text-[12px] ${active==='bids'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <img 
            src={active === 'bids' ? '/images/bids_blue.jpg' : '/images/bids.jpg'}
            className="w-[26px] h-[26px]"
            style={{ 
              mixBlendMode: 'multiply'
            }} 
            alt="Bids" 
          />
          <span className="mt-1">Bids</span>
        </button>
        {/* User */}
        <button onClick={()=>setActive('user')} className={`flex flex-col items-center justify-center text-[12px] ${active==='user'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="user" className={`w-7 h-7 ${active==='user'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">FJP018</span>
        </button>
      </nav>
    </div>
    </DataProvider>
  );
}
