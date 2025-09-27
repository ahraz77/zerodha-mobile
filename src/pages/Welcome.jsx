import React from "react";
import { ArrowRight, User as UserIcon, LogIn } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-800 antialiased">
      {/* iPhone style container with larger scaling */}
      <div className="max-w-sm mx-auto scale-110 origin-top">
        {/* Top bar */}
        <header className="px-4 pt-6 flex items-center justify-end">
          <button
            className="inline-flex items-center gap-2 border border-[#3b82f6] text-[#3b82f6] rounded-md px-6 py-2 text-base font-normal hover:bg-blue-50 transition"
            aria-label="Try demo"
          >
            <span className="tracking-wide">Try demo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <main className="px-4 pt-4">
          {/* Brand mark */}
          <div className="mb-10 flex justify-start">
            <img
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt="Kite by Zerodha logo"
              className="w-16 h-16 select-none"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl leading-tight tracking-tight font-semibold text-neutral-900 mb-10">
            <span className="block">Welcome to</span>
            <span className="block">Kite by Zerodha</span>
          </h1>

          {/* Options list */}
          <nav aria-label="Primary">
            <ul className="rounded-2xl overflow-hidden border-t border-b border-neutral-200">
              <ListItem
                label="Continue signup"
                iconRight={<UserIcon className="h-6 w-6 text-neutral-500" aria-hidden="true" />}
                onClick={() => {}}
              />
              <div className="h-px bg-neutral-200" />
              <ListItem
                label="Login to Kite"
                iconRight={<LogIn className="h-6 w-6 text-neutral-500" aria-hidden="true" />}
                onClick={() => {}}
              />
            </ul>
          </nav>

          {/* Footer */}
          <footer className="mt-16 pb-16">
            <div className="flex items-center gap-3 mb-4">
              {/* Only Zerodha logo in #808080 color */}
              <img
                src="https://zerodha.com/static/images/logo.svg"
                alt="Zerodha logo"
                className="h-6 select-none"
                style={{ filter: 'invert(37%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(93%) contrast(89%)' }}
              />
            </div>
            <div className="text-sm leading-relaxed text-neutral-500">
              <p className="mb-2">
                NSE & BSE – SEBI Registration no.: INZ000031633 | MCX - SEBI Registration no.: INZ000038238 | CDSL – SEBI Registration no.: IN-DP-431-2019
              </p>
              <p className="flex flex-wrap gap-x-3 gap-y-1">
                <FooterLink href="#" text="Smart Online Dispute Resolution" />
                <span className="text-neutral-300">|</span>
                <FooterLink href="#" text="SEBI SCORES" />
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ListItem({ label, iconRight, onClick }) {
  return (
    <li className="border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-5 py-6 text-left hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <span className="text-lg text-neutral-500">{label}</span>
        <span>{iconRight}</span>
      </button>
    </li>
  );
}

function FooterLink({ href, text }) {
  return (
    <a
      href={href}
      className="underline underline-offset-4 decoration-neutral-300 text-neutral-500 hover:decoration-blue-400 hover:text-neutral-700 transition"
    >
      {text}
    </a>
  );
}