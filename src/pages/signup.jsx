import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const onlyDigits = (s) => s.replace(/\D/g, "");
  const handleChange = (e) => {
    const digits = onlyDigits(e.target.value).slice(0, 10);
    setPhone(digits);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const valid = phone.length === 10;

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

      {/* Heading */}
      <h1 className="text-3xl font-medium text-gray-900 mb-6 w-full max-w-sm">Open your account</h1>

      {/* Illustration */}
      <div className="w-full max-w-sm mb-4">
        <div className="relative w-full h-32 sm:h-40 rounded-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 400 160" className="w-11/12 h-28 sm:h-32">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#f3f4f6"/>
              </linearGradient>
            </defs>
            <rect x="140" y="56" rx="12" ry="12" width="180" height="40" fill="#e5e7eb" />
            <rect x="158" y="68" rx="4" ry="4" width="80" height="8" fill="#c7d2fe" />
            <rect x="158" y="82" rx="4" ry="4" width="40" height="6" fill="#9aa7ff" />
            <g>
              <rect x="80" y="40" rx="16" ry="16" width="64" height="64" fill="#e6f0ff" />
              <circle cx="112" cy="72" r="18" fill="#9ab6ff" />
              <path d="M101 74c5-2 9-4 11-10 2 6 7 8 11 10-5 3-9 10-11 10-3 0-7-7-11-10z" fill="#ffffff" opacity="0.85"/>
            </g>
            <g>
              <rect x="250" y="92" rx="10" ry="10" width="60" height="34" fill="#ffd180" />
              <text x="280" y="114" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="16" fill="#ffffff">OTP</text>
            </g>
            <g>
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} cx={60 + i * 14} cy={22 + (i % 2) * 4} r="2" fill="#3b82f6" opacity={0.45} />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Phone input */}
      <div className="w-full max-w-sm">
        <label htmlFor="phone" className="sr-only">Phone number</label>
        <div className="flex items-stretch rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
          <div className="px-3 py-3 sm:px-4 sm:py-4 text-gray-900 font-medium bg-white select-none text-sm sm:text-base">+91</div>
          <input
            id="phone"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Phone number"
            value={phone}
            onChange={handleChange}
            className="flex-1 px-3 py-3 sm:px-4 sm:py-4 outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Continue button */}
      <div className="w-full max-w-sm mt-5 sm:mt-6">
        <button
          disabled={!valid}
          className={`w-full py-3 sm:py-4 rounded-xl text-white text-base sm:text-lg font-semibold shadow-sm transition active:scale-[.99] ${
            valid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
          By continuing, you agree to the <a className="text-blue-600 hover:underline" href="#">terms and conditions</a>
        </p>
      </div>

      {/* Footer */}
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
