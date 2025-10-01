import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigation } from '../context/NavigationContext.jsx';

export function WithdrawPage() {
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
        <div className="mt-6 flex flex-wrap items-center gap-6 text-[15px] text-[#1c1c1e] bg-white p-2 rounded-md">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="withdrawMode"
              value="regular"
              checked={mode === "regular"}
              onChange={() => setMode("regular")}
              className="accent-[#0b67ff] w-4 h-4"
            />
            <span>Regular (24-48 hours)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="withdrawMode"
              value="instant"
              checked={mode === "instant"}
              onChange={() => setMode("instant")}
              className="accent-[#0b67ff] w-4 h-4"
            />
            <span>Instant (Max: ₹200000)</span>
          </label>
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
// =====================
// Add Funds screen
// =====================
export default function AddFundsPage() {
  const { goBack, navigateToPage } = useNavigation();
  const [amount, setAmount] = useState("");
  const handleAmountChange = (e) => setAmount(e.target.value);

  const handleBackToFunds = () => {
    // Since users typically come from portfolio's funds component, go back to portfolio with funds tab
    navigateToPage('/portfolio?tab=funds');
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#1c1c1e]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#ececec]">
        <div className="h-6" />
        <div className="px-4 h-12 flex items-center justify-between">
          <button onClick={handleBackToFunds} aria-label="Back" className="p-2 -ml-2 rounded-full active:scale-95">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-[18px] font-semibold">Add funds</h1>
          <span className="w-6" />
        </div>
      </header>

      <main className="px-4 pb-24">
        {/* Balance */}
        <div className="text-[14px] text-[#6b7280] mt-3">Balance <span className="font-semibold text-[#1c1c1e]">₹30,000.00</span></div>
        <div className="mt-3 border-b border-[#eeeeee]" />

        {/* Amount */}
        <section className="mt-5">
          <div className="text-[14px] text-[#6b7280] mb-2">Amount</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[16px]">₹</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Enter amount"
              className="h-12 w-full border border-[#e5e7eb] rounded-md pl-7 pr-3 text-[16px] text-[#1c1c1e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0b67ff]/20 focus:border-[#0b67ff]"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
        </section>

        {/* Bank account */}
        <section className="mt-8">
          <div className="text-[14px] text-[#6b7280] mb-3">Select bank account</div>
          <div className="w-full border border-[#e5e7eb] rounded-md px-4 py-4 flex items-center justify-between">
            <div className="text-[16px] tracking-wide">STATE BANK OF INDIA <span className="tracking-tight">*8989</span></div>
            <BlueRadio />
          </div>
          <button className="mt-3 text-[#0b67ff] text-[14px]">Manage bank accounts</button>
        </section>

        {/* Pay with */}
        <section className="mt-8">
          <div className="text-[14px] text-[#6b7280] mb-3">Pay with</div>
          <MenuItem icon={<UPIIcon />} label="UPI" />
          <MenuItem icon={<BHIMIcon />} label="BHIM" />
          <MenuItem icon={<GPayIcon />} label="Google Pay" />
          <MenuItem icon={<NetBankIcon />} label="Net Banking" />
          <MenuItem icon={<BankIcon />} label="Others" />
        </section>
      </main>
    </div>
  );
}

function MenuItem({ icon, label }) {
  return (
    <button className="w-full h-14 flex items-center justify-between border-b border-[#f0f0f0]">
      <span className="flex items-center gap-3 text-[16px]">
        <span className="min-w-[56px] w-[56px] flex items-center justify-start">{icon}</span>
        {label}
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2f6fe5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  );
}

function BlueRadio() {
  return (
    <span className="inline-block w-5 h-5 rounded-full border-2 border-[#2f6fe5] relative">
      <span className="absolute inset-1 rounded-full bg-[#2f6fe5]" />
    </span>
  );
}

// --- Brand-like icons (lightweight SVG approximations) ---
function UPIIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
      alt="UPI"
      className="h-5 w-auto"
      draggable={false}
    />
  );
}

function BHIMIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/en/6/65/BHIM_SVG_Logo.svg"
      alt="BHIM"
      className="h-5 w-auto"
      draggable={false}
    />
  );
}

function GPayIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg"
      alt="Google Pay"
      className="h-5 w-auto"
      draggable={false}
    />
  );
}

function NetBankIcon() {
  return (
    <img
      src="https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/net-banking-icon.svg"
      alt="Net Banking"
      className="h-6 w-auto"
      draggable={false}
    />
  );
}

function BankIcon() {
  // Larger blue bank/temple icon (~30% bigger)
  return (
    <svg
      className="h-8 w-auto text-[#2f6fe5]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9h18" />
      <path d="M3 9l9-5 9 5" />
      <path d="M7 9v8" />
      <path d="M12 9v8" />
      <path d="M17 9v8" />
      <path d="M4 17.5h16" />
    </svg>
  );
}
