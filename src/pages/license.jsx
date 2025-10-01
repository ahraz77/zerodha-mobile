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

export default function LicensesPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    console.log('License - Back button clicked');
    navigate('/portfolio');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-4">
      {/* Top bar */}
      <div className="flex items-center mb-6">
        <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-100 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Licenses</h1>
        <div className="w-6"></div>
      </div>

      {/* Kite branding */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kite</h2>
        <img
          src="https://kite.zerodha.com/static/images/kite-logo.svg"
          alt="Kite logo"
          className="w-12 h-12 my-2 select-none"
        />
        <p className="text-sm text-gray-600">3.9.1b234</p>
        <p className="text-sm font-medium text-gray-700 mt-2">Zerodha © 2025. All rights reserved.</p>
        <p className="text-xs text-gray-500 mt-1">Powered by Flutter</p>
      </div>

      {/* License list */}
      <div className="flex flex-col space-y-3">
        <div>
          <p className="text-sm text-gray-800">_fe_analyzer_shared</p>
          <p className="text-xs text-gray-500">1 license.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">_flutterfire_internals</p>
          <p className="text-xs text-gray-500">1 license.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">abseil-cpp</p>
          <p className="text-xs text-gray-500">2 licenses.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">accessibility</p>
          <p className="text-xs text-gray-500">15 licenses.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">aFileChooser</p>
          <p className="text-xs text-gray-500">1 license.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">analyzer</p>
          <p className="text-xs text-gray-500">1 license.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">android_intent_plus</p>
          <p className="text-xs text-gray-500">1 license.</p>
        </div>
        <div>
          <p className="text-sm text-gray-800">angle</p>
          <p className="text-xs text-gray-500">32 licenses.</p>
        </div>
      </div>
    </div>
  );
}
