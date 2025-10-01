import React from 'react';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function ConnectedApps() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    console.log('Connected Apps - Back button clicked');
    alert('Connected Apps - Back button clicked');
    navigate('/portfolio');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center px-4 pt-4 pb-2 bg-gray-50">
        <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-200 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Connected apps</h1>
        <div className="w-6"></div>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-2">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 ml-3 text-gray-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 104 10.5a6.5 6.5 0 0013 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search apps"
            className="flex-1 px-3 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Apps list */}
      <div className="flex flex-col divide-y divide-gray-200 bg-white">
        <div className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {/* Support Portal logo */}
            <img src="/images/support_portal.png" alt="Support Portal" className="w-10 h-10 object-contain" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">Support Portal</p>
            <p className="text-xs text-gray-500">Zerodha support portal</p>
          </div>
          <div className="text-xs text-gray-400">Connected</div>
        </div>

        <div className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {/* Kite Android logo */}
            <img src="/images/kite.png" alt="Kite Android" className="w-10 h-10 object-contain" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">Kite Android</p>
            <p className="text-xs text-gray-500">Trading platform for Android devices</p>
          </div>
          <div className="text-xs text-gray-400">Connected</div>
        </div>

        <div className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {/* Coin by Zerodha logo */}
            <img src="/images/coin.png" alt="Coin by Zerodha" className="w-10 h-10 object-contain" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">Coin by Zerodha</p>
            <p className="text-xs text-gray-500">Coin @ Zerodha - Invest in thousands of direct mutual funds</p>
          </div>
          <div className="text-xs text-gray-400">Connected</div>
        </div>
      </div>
    </div>
  );
}
