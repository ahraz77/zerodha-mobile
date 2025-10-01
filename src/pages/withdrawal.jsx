import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigation } from '../context/NavigationContext.jsx';

export default function WithdrawPage() {
  const { goBack, navigateToPage } = useNavigation();
  const [mode, setMode] = useState("regular");
  const [amount, setAmount] = useState("");

  const handleBackToFunds = () => {
    // Since users typically come from portfolio's funds component, go back to portfolio with funds tab
    navigateToPage('/portfolio?tab=funds');
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#000000] font-sans flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-[#f5f6f8] border-b border-[#e5e7eb] w-full">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={handleBackToFunds} aria-label="Close" className="p-2 -ml-2 rounded-full active:scale-95">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <h1 className="text-[17px] font-medium text-[#1c1c1e]">Withdraw</h1>
          <DonutIcon className="w-6 h-6" />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center w-full border-t border-[#e5e7eb] bg-white px-4 py-2">
          <div className="flex items-center w-full justify-center relative">
            <div className="absolute left-4">
              <DonutIcon className="w-6 h-6" />
            </div>
            <span className="text-[15px] text-[#1c1c1e]">Funds</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-24 w-full max-w-full bg-white">
        {/* Summary card */}
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 rounded-md border border-[#e5e7eb] bg-white shadow-sm"
        >
          <div className="p-4 space-y-3 text-[15px] text-[#1c1c1e]">
            <Row label="Closing balance" value="₹92.82" />
            <Row label="Unsettled credits (-)" value="₹0.00" muted />
            <Row label="Payin (-)" value="₹0.00" muted />
            <Row label="Collateral utilised (+)" value="₹0.00" muted />

            <div className="pt-2" />
            <div className="text-center bg-white">
              <p className="text-[13px] text-[#6b7280] font-normal flex items-center justify-center gap-1">
                Withdrawable balance <InfoIcon />
              </p>
              <p className="mt-1 text-[22px] font-semibold tracking-tight text-[#1c1c1e]">₹92.82</p>
              <button className="mt-2 text-[#0b67ff] text-[14px] font-normal active:scale-95">
                View breakdown →
              </button>
            </div>
          </div>
        </motion.section>

        {/* Mode selector - radio style */}
        <div className="mt-6 bg-white p-3 rounded-md">
          <div className="flex items-center justify-between gap-3 text-[12px] text-[#1c1c1e]">
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="radio"
                name="withdrawMode"
                value="regular"
                checked={mode === "regular"}
                onChange={() => setMode("regular")}
                className="accent-[#0b67ff] w-4 h-4 flex-shrink-0"
              />
              <span className="text-[12px] font-normal whitespace-nowrap">Regular (24-48 hours)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="radio"
                name="withdrawMode"
                value="instant"
                checked={mode === "instant"}
                onChange={() => setMode("instant")}
                className="accent-[#0b67ff] w-4 h-4 flex-shrink-0"
              />
              <span className="text-[12px] font-normal whitespace-nowrap">Instant (Max: ₹200000)</span>
            </label>
          </div>
        </div>

        {/* Amount input */}
        <div className="mt-5 w-full bg-white p-2 rounded-md">
          <label className="sr-only" htmlFor="amt">Amount to withdraw</label>
          <input
            id="amt"
            inputMode="decimal"
            placeholder="Amount to withdraw"
            className="w-full h-12 rounded-md border border-[#d1d5db] px-4 text-[15px] text-[#1c1c1e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0b67ff]/20 focus:border-[#0b67ff]"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Continue button */}
        <div className="bg-white p-2 rounded-md mt-4">
          <button
            className="w-full h-12 rounded-md bg-[#0b67ff] text-white text-[15px] font-medium active:scale-[.99]"
          >
            Continue
          </button>
        </div>

        {/* Meta */}
        <div className="mt-4 space-y-2 text-[12px] text-[#6b7280] bg-white p-2 rounded-md">
          <p className="flex items-center gap-2"><ClockIcon /> Last updated: <span className="tabular-nums">2025-09-30 05:12:44</span></p>
          <p className="flex items-center gap-2"><InfoIcon /> Next quarterly settlement on <span className="tabular-nums">2025-10-03</span>. <a className="text-[#0b67ff]">Learn more</a>.</p>
        </div>

        {/* Recent withdrawals */}
        <details className="mt-6 border-t border-[#e5e7eb] bg-white rounded-md">
          <summary className="list-none h-12 flex items-center cursor-pointer select-none text-[15px] font-normal px-1">
            <span className="flex items-center gap-2 flex-1 text-[#1c1c1e]">
              <ClockIcon />
              Recent withdrawals
            </span>
            <ChevronDown />
          </summary>
          <div className="px-2 pb-4 text-sm text-[#4b5563]">
            <p>No withdrawals yet.</p>
          </div>
        </details>
      </main>
    </div>
  );
}

function Row({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between w-full bg-white">
      <span className={muted ? "text-[#6b7280]" : "text-[#1c1c1e]"}>{label}</span>
      <span className="tabular-nums text-[#1c1c1e]">{value}</span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}

function DonutIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="#0B67FF" />
      <circle cx="24" cy="24" r="11" fill="white" />
      <path d="M44 24A20 20 0 0 0 34 7.7L29.6 16A11 11 0 0 1 35 24z" fill="#4EA3FF" />
      <path d="M24 44a20 20 0 0 0 14.2-5.9l-6.7-6.7A11 11 0 0 1 24 35z" fill="#0A59E6" />
    </svg>
  );
}