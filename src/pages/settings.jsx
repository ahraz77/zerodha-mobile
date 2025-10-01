import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext.jsx';
import feather from 'feather-icons';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { goBack } = useNavigation();
  const [theme, setTheme] = useState('default');

  const handleBackClick = () => {
    console.log('Settings - Back button clicked');
    alert('Settings - Back button clicked');
    navigate('/portfolio'); // Always go back to portfolio from settings
  };
  const [biometric, setBiometric] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [stickyOrder, setStickyOrder] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [stickyPins, setStickyPins] = useState(false);
  const [showWatchlistNotes, setShowWatchlistNotes] = useState(true);

  const Switch = ({checked, onChange}) => (
    <div onClick={onChange} className={`relative inline-flex items-center h-6 w-11 rounded-full transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105 active:scale-95 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <span className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-1'}`}></span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-4">
      {/* Top bar */}
      <div className="flex items-center mb-4">
        <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-100 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Settings</h1>
        <div className="w-6"></div>
      </div>

      {/* Theme */}
      <div className="py-4 border-b border-gray-200">
        <p className="text-sm font-bold text-gray-700 mb-4">Theme</p>
        <div className="flex flex-col space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-800">Default</span>
            <input type="radio" name="theme" checked={theme==='default'} onChange={()=>setTheme('default')} className="accent-blue-600" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-800">Dark</span>
            <input type="radio" name="theme" checked={theme==='dark'} onChange={()=>setTheme('dark')} className="accent-blue-600" />
          </label>
        </div>
      </div>

      {/* Toggles */}
      <div className="divide-y divide-gray-200">
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-800">Biometric 2FA authentication</span>
          <Switch checked={biometric} onChange={()=>setBiometric(!biometric)} />
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-800">Order notifications</span>
          <Switch checked={orderNotifications} onChange={()=>setOrderNotifications(!orderNotifications)} />
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Sticky order window</p>
              <p className="text-xs text-gray-500 mt-1">Don't automatically hide order window after order placement.</p>
            </div>
            <Switch checked={stickyOrder} onChange={()=>setStickyOrder(!stickyOrder)} />
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Accessibility mode</p>
              <p className="text-xs text-gray-500 mt-1">Disables transitions and simplifies UI.</p>
            </div>
            <Switch checked={accessibility} onChange={()=>setAccessibility(!accessibility)} />
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Fullscreen</p>
              <p className="text-xs text-gray-500 mt-1">May not work on certain devices.</p>
            </div>
            <Switch checked={fullscreen} onChange={()=>setFullscreen(!fullscreen)} />
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">Sticky pins</p>
              <p className="text-xs text-gray-500 mt-1">Show pinned stock tickers on the top on all screens.</p>
            </div>
            <Switch checked={stickyPins} onChange={()=>setStickyPins(!stickyPins)} />
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-800">Show watchlist notes</span>
          <Switch checked={showWatchlistNotes} onChange={()=>setShowWatchlistNotes(!showWatchlistNotes)} />
        </div>
      </div>
    </div>
  );
}
