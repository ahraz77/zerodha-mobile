import React, { useState } from 'react';

const holdings = [
  {
    name: 'ALEMBICLTD',
    qty: 2,
    avg: '66.65',
    invested: '133.30',
    pct: '+5.03%',
    change: '+6.70',
    ltp: '70.00',
    ltpPct: '-0.57%'
  },
  {
    name: 'BHEL',
    qty: 43,
    avg: '64.92',
    invested: '2,791.85',
    pct: '+26.76%',
    change: '+747.05',
    ltp: '82.30',
    ltpPct: '0.91%'
  },
  {
    name: 'GAIL',
    qty: 16,
    avg: '98.17',
    invested: '1,570.75',
    pct: '+12.05%',
    change: '+189.25',
    ltp: '110.00',
    ltpPct: '-1.52%'
  },
  {
    name: 'IDEA',
    qty: 11,
    avg: '6.98',
    invested: '76.80',
    pct: '+1.26%',
    change: '+0.97',
    ltp: '7.07',
    ltpPct: '-3.81%'
  }
];

// Positions data (for Positions tab)
const positions = [
  { symbol: 'USDINR23JUNFUT', segment: 'CDS', qty: -1, avg: '82.0375', product: 'NRML', pnl: '-200.0000', ltp: '0.00' },
  { symbol: 'USDINR23MAYFUT', segment: 'CDS', qty: 1, avg: '82.1625', product: 'NRML', pnl: '-42.5000', ltp: '0.00' },
  { symbol: 'GOLDPETAL23MAYFUT', segment: 'MCX', qty: 1, avg: '6,134.00', product: 'NRML', pnl: '+4.00', ltp: '0.00' },
  { symbol: 'NIFTY2351118700CE', segment: 'NFO', qty: -50, avg: '1.65', product: 'NRML', pnl: '-50.00', ltp: '0.00' },
  { symbol: 'NIFTY2351118750CE', segment: 'NFO', qty: 50, avg: '1.45', product: 'NRML', pnl: '-12.50', ltp: '0.00' }
];

export default function PortfolioPage() {
  const [tab, setTab] = useState<'holdings' | 'positions'>('positions');

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-16 select-none">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] leading-8 font-semibold text-[#0f172a]">Portfolio</h1>
          <div className="flex items-center gap-5">
            {/* cart */}
            <svg className="w-7 h-7 text-[#374151]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {/* chevron */}
            <svg className="w-7 h-7 text-[#374151]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        </header>

      {/* Tabs */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-center gap-6 text-[20px] font-medium text-[#334155]">
          <button onClick={()=>setTab('holdings')} className={`relative pb-2 transition-colors ${tab==='holdings' ? 'text-[#3D73F1]' : ''}`}>
            <span className="align-middle">Holdings</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[14px] ${tab==='holdings' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>17</span>
            {tab==='holdings' && (<span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />)}
          </button>
          <button onClick={()=>setTab('positions')} className={`relative pb-2 transition-colors ${tab==='positions' ? 'text-[#3D73F1]' : ''}`}>
            <span>Positions</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[14px] ${tab==='positions' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>8</span>
            {tab==='positions' && (<span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />)}
          </button>
        </div>
      </div>

      {/* Summary card (changes per tab) */}
      <section className="px-4 mt-4">
        {tab === 'holdings' ? (
          <div className="bg-white rounded-[16px] shadow-sm px-5 py-5">
            <div className="flex items-center justify-between text-[16px] text-[#6b7280]">
              <span>Invested</span>
              <span>Current</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[28px] font-medium text-[#111827]">
              <span>13,228.55</span>
              <span>15,758.71</span>
            </div>
            <div className="mt-3 h-[1px] bg-[#eef1f5]" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[18px] text-[#6b7280]">P&L</span>
              <div className="flex items-center gap-3 text-[22px] font-medium text-[#34C759]">
                <span>+2,530.16</span>
                <span className="inline-flex items-center px-3 py-1 rounded-[999px] text-[16px] bg-[#EAF7EE] text-[#34C759]">+19.13%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] shadow-md px-6 py-6 text-center">
            <div className="text-[18px] leading-6 text-[#9aa3af]">Total P&L</div>
            <div className="mt-2 text-[34px] leading-8 font-semibold text-[#D04C4C]">-273.75</div>
          </div>
        )}
      </section>

      {/* Filters row */}
      <div className="px-4 mt-3">
        {tab === 'holdings' ? (
          <div className="flex items-center justify-between">
            {/* Left: search, tune, equity pill */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <svg className="w-6 h-6 text-[#3D73F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.9-3.9"/></svg>
              {/* Tune/Sliders */}
              <svg className="w-6 h-6 text-[#3D73F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><circle cx="4" cy="12" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/></svg>
              {/* Equity pill */}
              <button className="inline-flex items-center gap-2 rounded-md bg-[#EEF2F7] px-3 py-1.5">
                <span className="text-[16px] font-medium text-[#3D73F1]">Equity</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D73F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>

            {/* Right: Family & Analytics */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#3D73F1]">
                {/* Family icon (2 users) */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[16px]">Family</span>
              </div>
              <div className="flex items-center gap-2 text-[#3D73F1]">
                {/* Analytics donut */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" stroke="#3D73F1" strokeWidth="3" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="#3D73F1"/>
                </svg>
                <span className="text-[16px]">Analytics</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search */}
              <svg className="w-6 h-6 text-[#3D73F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.9-3.9"/></svg>
              {/* Tune/Sliders */}
              <svg className="w-6 h-6 text-[#3D73F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><circle cx="4" cy="12" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/></svg>
            </div>
            <div className="flex items-center gap-6">
              {/* Analyze */}
              <button className="inline-flex items-center gap-2 text-[#1f2937]">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#f97316] shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 15c4-6 14-6 18 0"/>
                    <path d="M6 12l-3 3 3 3"/>
                  </svg>
                </span>
                <span className="text-[16px]">Analyze</span>
              </button>
              {/* Analytics */}
              <div className="flex items-center gap-2 text-[#3D73F1]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8.5" stroke="#3D73F1" strokeWidth="3" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
                <span className="text-[16px]">Analytics</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content lists: holdings or positions */}
      {tab === 'holdings' ? (
        <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
          {holdings.map((h, i) => (
            <div key={h.name + i} className="px-4 py-4">
              <div className="flex items-center justify-between text-[15px] text-[#6b7280]">
                <span>Qty. {h.qty} • Avg. {h.avg}</span>
                <span className={`${h.pct.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'} font-medium`}>{h.pct}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-[18px] font-medium text-[#0f172a]">{h.name}</span>
                <span className={`${h.change.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'} text-[16px] font-medium`}>{h.change}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[14px] text-[#6b7280]">
                <span>Invested {h.invested}</span>
                <span className="text-[#6b7280]">LTP {h.ltp} <span className={`${h.ltpPct.startsWith('-') ? 'text-[#dc2626]' : 'text-[#34C759]'}`}>({h.ltpPct})</span></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
          {positions.map((p, i) => (
            <div key={p.symbol + i} className="px-4 py-5">
              {/* Qty & Avg row */}
              <div className="flex items-center justify-between text-[14px] text-[#64748b]">
                <span>
                  Qty. <span className={`${p.qty < 0 ? 'text-[#e11d48]' : 'text-[#3D73F1]'} font-medium`}>{p.qty}</span>
                  <span className="mx-2">•</span>
                  Avg. {p.avg}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#EFEAFF] text-[#5b5f97] border border-[#e3defa] tracking-wide">{p.product}</span>
              </div>

              {/* Symbol & PnL row */}
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <div className="text-[18px] font-medium text-[#0f172a] tracking-wide">{p.symbol}</div>
                  <div className="text-[13px] text-[#9aa3af] mt-1">{p.segment}</div>
                </div>
                <div className={`text-[17px] font-medium ${p.pnl.startsWith('-') ? 'text-[#e11d48]' : 'text-[#34C759]'}`}>{p.pnl}</div>
              </div>

              {/* LTP row */}
              <div className="mt-1 flex items-center justify-end text-[13px] text-[#9aa3af]">
                <span className="text-[#9aa3af]">LTP {p.ltp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Day's P&L bar (only on holdings) */}
      {tab === 'holdings' && (
        <div className="fixed inset-x-0 bottom-[64px] h-[44px] bg-white border-t border-[#eef1f5] flex items-center justify-between px-4">
          <span className="text-[16px] text-[#6b7280]">Day's P&L</span>
          <span className="text-[18px] font-medium text-[#34C759] tracking-wide">+35.70 <span className="ml-2">+0.23 %</span></span>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 h-[64px] bg-white border-t border-[#e5e7eb] grid grid-cols-5">
        {/* Watchlist */}
        <div className="flex flex-col items-center justify-center text-[12px] text-[#6b7280]">
          {/* SF-like bookmark */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2f3542" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 3h9a1.5 1.5 0 0 1 1.5 1.5V21l-6-3-6 3V4.5A1.5 1.5 0 0 1 7.5 3z"/>
          </svg>
          <span className="mt-1">Watchlist</span>
        </div>
        {/* Orders */}
        <div className="flex flex-col items-center justify-center text-[12px] text-[#6b7280]">
          {/* SF-like book icon */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2f3542" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h9A2.5 2.5 0 0 1 20 4.5V20a0 0 0 0 1 0 0H8.5A2.5 2.5 0 0 1 6 17.5V4.5z"/>
            <path d="M6 16.5h12"/>
          </svg>
          <span className="mt-1">Orders</span>
        </div>
        {/* Portfolio (active) */}
        <div className="flex flex-col items-center justify-center text-[12px] text-[#3D73F1]">
          {/* Suitcase icon to match screenshot */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#3D73F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.25" y="7.25" width="15.5" height="10.5" rx="2.25"/>
            <path d="M9 7.25V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.25"/>
          </svg>
          <span className="mt-1 text-[#3D73F1]">Portfolio</span>
        </div>
        {/* Bids */}
        <div className="flex flex-col items-center justify-center text-[12px] text-[#6b7280]">
          {/* Gavel icon (tilted) */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2f3542" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* handle */}
            <path d="M8 16.5l3.5 3.5"/>
            <path d="M3 21h7"/>
            {/* head */}
            <rect x="12.2" y="4.2" width="5.2" height="3.2" rx="0.8" transform="rotate(45 14.8 5.8)"/>
            {/* neck */}
            <path d="M11 12l3 3"/>
          </svg>
          <span className="mt-1">Bids</span>
        </div>
        {/* DEMOUSER */}
        <div className="flex flex-col items-center justify-center text-[12px] text-[#6b7280]">
          {/* SF-like person */}
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2f3542" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7.5" r="3.25"/>
            <path d="M5 20a7 7 0 0 1 14 0"/>
          </svg>
          <span className="mt-1">DEMOUSER</span>
        </div>
      </nav>
    </div>
  );
}
