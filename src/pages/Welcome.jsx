import React from "react";
import { ArrowRight, User as UserIcon, LogIn } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-white overflow-hidden mobile-viewport-fix">
      {/* Universal mobile container - fits all devices from 320px to 430px+ */}
      <div className="max-w-mobile mx-auto bg-white w-full min-h-[100dvh] relative mobile-viewport-fix">
        <main className="px-4 xs:px-5 sm:px-6 pt-4 xs:pt-5 sm:pt-6 pb-4 min-h-full flex flex-col safe-area-insets">
          {/* Try demo button */}
          <div className="flex justify-end mb-12 xs:mb-14 sm:mb-16 md:mb-20">
            <button className="inline-flex items-center gap-1.5 xs:gap-2 border border-blue-500 text-blue-500 rounded px-3 xs:px-4 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-normal hover:bg-blue-50 active:bg-blue-100 transition-colors touch-manipulation">
              Try demo
              <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
            </button>
          </div>

          {/* Kite logo */}
          <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12">
            <img
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt="Kite by Zerodha logo"
              className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 select-none"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-semibold mb-16 xs:mb-20 sm:mb-24 md:mb-32 leading-tight tracking-tight" style={{ color: '#43434f' }}>
            Welcome to<br />
            Kite by Zerodha
          </h1>

          {/* Action buttons */}
          <nav className="border-t border-b border-gray-200 mb-12 xs:mb-14 sm:mb-16 md:mb-20 flex-shrink-0">
            <ListItem
              label="Continue signup"
              iconRight={<UserIcon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-gray-500" />}
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200"></div>
            <ListItem
              label="Login to Kite"
              iconRight={<LogIn className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-gray-500" />}
              onClick={() => {}}
            />
          </nav>

          {/* Footer */}
          <footer className="pb-4 xs:pb-6 sm:pb-8 mt-auto flex-shrink-0">
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
        </main>
      </div>
    </div>
  );
}

function ListItem({ label, iconRight, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-0 py-4 xs:py-5 sm:py-6 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors active:bg-gray-100 touch-manipulation min-h-[44px]"
    >
      <span className="text-sm xs:text-base sm:text-lg text-gray-600 font-normal">{label}</span>
      {iconRight}
    </button>
  );
}