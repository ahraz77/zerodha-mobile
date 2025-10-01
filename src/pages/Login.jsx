import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 py-6">
      {/* Top Bar with Back Icon and Kite by Zerodha Logo */}
      <div className="w-full flex justify-between items-center mb-6 max-w-sm">
        <button onClick={handleBackClick} className="text-gray-700 hover:text-gray-900 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <img
          src="https://kite.zerodha.com/static/images/kite-logo.svg"
          alt="Kite by Zerodha logo"
          className="w-10 h-10 select-none"
        />
      </div>

      {/* Login Heading */}
      <h1 className="text-3xl font-medium text-gray-900 mb-8 w-full max-w-sm">Login</h1>

      {/* Input Fields */}
      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Phone or User ID"
            className="w-full border border-gray-300 rounded-lg py-4 pl-4 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg py-4 pl-4 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"

          >
            {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Login Button and Forgot Password exactly as screenshot */}
      <div className="w-full max-w-sm mt-8">
        <button className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white py-4 rounded-lg font-medium text-center tracking-wide transition-colors">
          LOGIN
        </button>
        <div className="mt-4 flex justify-center">
          <a href="#" className="text-[#4285f4] text-sm hover:underline">
            Forgot user ID or password?
          </a>
        </div>
      </div>

      {/* Footer moved just below login section */}
      <footer className="pt-8 w-full max-w-sm text-left">
        <div className="flex items-center mb-2 xs:mb-3 sm:mb-4">
          <img
            src="https://zerodha.com/static/images/logo.svg"
            alt="Zerodha logo"
            className="h-3 xs:h-3.5 sm:h-4 select-none"
            style={{ filter: 'invert(37%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(93%) contrast(89%)' }}
          />
        </div>
        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="mb-1.5 xs:mb-2 text-xs leading-relaxed break-words">
            NSE & BSE – SEBI Registration no.: INZ000031633 | MCX - SEBI Registration no.: INZ000038238 | CDSL – SEBI Registration no.: IN-DP-431-2019
          </p>
          <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 text-xs">
            <a href="#" className="underline underline-offset-2">Smart Online Dispute Resolution</a>
            <span>|</span>
            <a href="#" className="underline underline-offset-2">SEBI SCORES</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
