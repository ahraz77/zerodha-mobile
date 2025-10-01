import React, { useState } from 'react';
import { Menu, X, Download, BarChart3, Users, Gift, FileText, CreditCard, Award, HelpCircle, LogOut } from 'lucide-react';

const Console = () => {
  const [currentView, setCurrentView] = useState('main');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Listen for messages from parent window to set initial view
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'SET_VIEW' && event.data.view) {
        setCurrentView(event.data.view);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const menuItems = [
    { id: 'account', label: 'My account', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'funds', label: 'Funds', icon: CreditCard },
    { id: 'rewards', label: 'Rewards & referrals', icon: Award },
    { id: 'gift', label: 'Gift securities', icon: Gift },
  ];

  const renderDownloads = () => (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">O</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Downloads</h1>
      </div>

      <div className="space-y-4">
        {/* Statement Dropdown */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Statement</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>Contract note</option>
            <option>Trading statement</option>
            <option>P&L statement</option>
            <option>Holdings statement</option>
          </select>
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Report type</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Date range</label>
          <input 
            type="text" 
            value="2025-10-01 — 2025-10-01"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            readOnly
          />
        </div>

        {/* Quick Date Options */}
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="text-blue-600 hover:underline">Last 7 days</button>
          <span className="text-gray-400">•</span>
          <button className="text-blue-600 hover:underline">Last 30 days</button>
          <span className="text-gray-400">•</span>
          <button className="text-blue-600 hover:underline">Current FY</button>
          <span className="text-gray-400">•</span>
          <button className="text-blue-600 hover:underline">Prev. FY</button>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Category</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>Equity</option>
            <option>F&O</option>
            <option>Commodity</option>
            <option>Currency</option>
          </select>
        </div>

        {/* Trade Type */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Trade type</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
            <option>Contract note</option>
            <option>All trades</option>
            <option>Intraday</option>
            <option>Delivery</option>
          </select>
        </div>

        {/* Email Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          E-mail
        </button>
      </div>

      {/* Bottom Illustration */}
      <div className="mt-12 text-center">
        <div className="w-32 h-32 mx-auto mb-4 relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-1 bg-yellow-400 rounded transform rotate-45"></div>
          <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-4 -left-4 w-1 h-1 bg-yellow-400 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-sm">Use the form above to download / email your report</p>
      </div>
    </div>
  );

  const renderFamilyHoldings = () => (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">O</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Family holdings</h1>
      </div>

      <div className="text-center text-gray-500 mb-6">2025-10-01</div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Equity</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Debt</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Equity (MF)</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">+ 2 tags</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button className="px-6 py-2 text-gray-500 border-b-2 border-transparent hover:text-blue-600">
          Personal
        </button>
        <button className="px-6 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
          Family
        </button>
      </div>

      {/* Family Accounts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-700">Family accounts</h3>
          <div className="flex items-center space-x-4">
            {/* Donut Chart */}
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="30, 70"
                  strokeDashoffset="0"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="20, 80"
                  strokeDashoffset="-30"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="15, 85"
                  strokeDashoffset="-50"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Analytics</span>
          </div>
        </div>

        {/* Account Entries */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">👤</span>
            </div>
            <div className="flex-1">
              <div className="w-24 h-1 bg-orange-300 rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">👤</span>
            </div>
            <div className="flex-1">
              <div className="w-20 h-1 bg-purple-300 rounded"></div>
              <span className="text-xs text-gray-500 ml-2">Track</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end space-x-1 h-16 mt-8">
          <div className="w-4 h-8 bg-yellow-400 rounded-t"></div>
          <div className="w-4 h-6 bg-blue-300 rounded-t"></div>
          <div className="w-4 h-7 bg-blue-400 rounded-t"></div>
          <div className="w-4 h-12 bg-yellow-500 rounded-t"></div>
          <div className="w-4 h-10 bg-yellow-400 rounded-t"></div>
          <div className="w-4 h-8 bg-blue-500 rounded-t"></div>
          <div className="w-4 h-9 bg-blue-400 rounded-t"></div>
        </div>
      </div>

      {/* Bottom Message */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm mb-4">
          You don't have sub-accounts added to your family.{' '}
          <button className="text-blue-600 hover:underline">Learn more.</button>
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Link a sub-account
        </button>
      </div>
    </div>
  );

  const handleNavClick = (section) => {
    const baseUrl = 'https://zerodha-kite-zeta.vercel.app/console';
    let url;
    
    switch (section) {
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
  };

  const renderMainConsole = () => (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Console</h1>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Row 1 */}
        <button 
          onClick={() => handleNavClick('Portfolio')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">Portfolio</div>
        </button>
        
        <button 
          onClick={() => handleNavClick('Tradebook')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">Tradebook</div>
        </button>

        {/* Row 2 */}
        <button 
          onClick={() => handleNavClick('P&L')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">P&L</div>
        </button>
        
        <button 
          onClick={() => handleNavClick('Tax P&L')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">Tax P&L</div>
        </button>

        {/* Row 3 */}
        <button 
          onClick={() => handleNavClick('Gift stocks')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">Gift stocks</div>
        </button>
        
        <button 
          onClick={() => handleNavClick('Family')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 text-lg font-medium">Family</div>
        </button>

        {/* Row 4 */}
        <button 
          onClick={() => handleNavClick('Downloads')}
          className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center col-span-2"
        >
          <div className="text-blue-600 text-lg font-medium">Downloads</div>
        </button>
      </div>
    </div>
  );

  const renderGift = () => (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">O</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Gift</h1>
      </div>

      {/* Gift Illustration */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center relative">
              <div className="w-6 h-1 bg-yellow-500 rounded"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full"></div>
          <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-blue-300 rounded-full"></div>
          <div className="absolute top-4 -left-4 w-1 h-1 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-8 right-2 w-1 h-1 bg-yellow-400 rounded-full"></div>
        </div>
        
        <p className="text-gray-600 text-lg mb-8">
          You do not hold any stocks approved for gifting.
        </p>
      </div>

      {/* History Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-700">History</h3>
        </div>

        <div className="flex items-center space-x-3 ml-8">
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <span className="text-gray-600">No gifts sent.</span>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">O</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Holdings</h1>
        </div>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* User Info Section */}
      <div className="bg-gray-50 px-4 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">MS</span>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Mohammad Sayad</h2>
            <p className="text-gray-600">FJP018</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-4 px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <IconComponent className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 flex-1 text-left">{item.label}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto pt-8">
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="flex">
            <button className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100">
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </button>
            <div className="w-px bg-gray-200"></div>
            <button className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isMenuOpen) return renderMenu();
    
    switch (currentView) {
      case 'downloads':
        return renderDownloads();
      case 'family':
        return renderFamilyHoldings();
      case 'gift':
        return renderGift();
      case 'main':
      case 'console':
        return renderMainConsole();
      default:
        return renderMainConsole();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      {!isMenuOpen && (
        <div className="bg-gray-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs">9:40</span>
              <div className="flex space-x-1 ml-auto">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs">5G</div>
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3 h-1 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Browser Bar */}
      {!isMenuOpen && (
        <div className="bg-gray-500 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm">◄ Kite</span>
          </div>
          <span className="text-sm text-center flex-1">console.zerodha.com</span>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-1"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Content */}
      {renderContent()}

      {/* Quick Navigation (when not in menu and not on main view) */}
      {!isMenuOpen && currentView !== 'main' && (
        <div className="fixed bottom-4 left-4 right-4 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentView('main')}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Console
          </button>
          <button
            onClick={() => setCurrentView('downloads')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === 'downloads' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Downloads
          </button>
          <button
            onClick={() => setCurrentView('family')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === 'family' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Family
          </button>
          <button
            onClick={() => setCurrentView('gift')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === 'gift' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gift
          </button>
        </div>
      )}
    </div>
  );
};

export default Console;