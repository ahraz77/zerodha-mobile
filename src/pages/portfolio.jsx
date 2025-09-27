import React, { useState } from 'react';
import feather from 'feather-icons';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Custom gavel to match the screenshot (Feather has no gavel)
function GavelIcon({ className = '', size = 24, strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16.5l3.5 3.5" />
      <path d="M3 21h7" />
      <rect x="12.2" y="4.2" width="5.2" height="3.2" rx="0.8" transform="rotate(45 14.8 5.8)" />
      <path d="M11 12l3 3" />
    </svg>
  );
}

// ---------- Demo data ----------
// Custom Rupee icon (Feather doesn't include a rupee glyph)
function RupeeIcon({ className = '', size = 24, strokeWidth = 2 }) {
  // Feather-like ₹ : two horizontal bars + angled leg
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top bar */}
      <path d="M7 6h10" />
      {/* Middle bar */}
      <path d="M7 10h10" />
      {/* Angled leg */}
      <path d="M13 14l4 6" />
    </svg>
  );
}

const holdings = [
  { name: 'ALEMBICLTD', qty: 2, avg: '66.65', invested: '133.30', pct: '+5.03%', change: '+6.70', ltp: '70.00', ltpPct: '-0.57%' },
  { name: 'BHEL', qty: 43, avg: '64.92', invested: '2,791.85', pct: '+26.76%', change: '+747.05', ltp: '82.30', ltpPct: '0.91%' },
  { name: 'GAIL', qty: 16, avg: '98.17', invested: '1,570.75', pct: '+12.05%', change: '+189.25', ltp: '110.00', ltpPct: '-1.52%' },
  { name: 'IDEA', qty: 11, avg: '6.98', invested: '76.80', pct: '+1.26%', change: '+0.97', ltp: '7.07', ltpPct: '-3.81%' }
];

const positions = [
  { symbol: 'USDINR23JUNFUT', segment: 'CDS', qty: -1, avg: '82.0375', product: 'NRML', pnl: '-200.0000', ltp: '0.00' },
  { symbol: 'USDINR23MAYFUT', segment: 'CDS', qty: 1, avg: '82.1625', product: 'NRML', pnl: '-42.5000', ltp: '0.00' },
  { symbol: 'GOLDPETAL23MAYFUT', segment: 'MCX', qty: 1, avg: '6,134.00', product: 'NRML', pnl: '+4.00', ltp: '0.00' },
  { symbol: 'NIFTY2351118700CE', segment: 'NFO', qty: -50, avg: '1.65', product: 'NRML', pnl: '-50.00', ltp: '0.00' },
  { symbol: 'NIFTY2351118750CE', segment: 'NFO', qty: 50, avg: '1.45', product: 'NRML', pnl: '-12.50', ltp: '0.00' }
];

// Bids: IPO list (for IPO > Ongoing)
const ipos = [
  { company: 'Nexus Select Trust', symbol: 'NXST', price: '₹95 - ₹100', dates: '9th - 11th May', cta: 'Apply', status: 'ONGOING' },
  { company: 'Innokaiz India Limited', symbol: 'INNOKAIZ', price: '₹76 - ₹78', dates: '28th Apr - 3rd May', status: 'CLOSED', tag: 'SME' },
  { company: 'De Neers Tools Limited', symbol: 'DENEERS', price: '₹95 - ₹101', dates: '28th Apr - 3rd May', status: 'CLOSED', tag: 'SME' },
  { company: 'Mankind Pharma Limited', symbol: 'MANKIND', price: '₹1026 - ₹1080', dates: '25th - 27th Apr', status: 'CLOSED' },
  { company: 'Retina Paints Limited', symbol: 'RETINA', price: '₹30', dates: '19th - 24th Apr', status: 'CLOSED', tag: 'SME' }
];

// Bids: Auctions list
const auctions = [
  { qty: 1, symbol: 'HINDCOPPER', holdPrice: '131.70', pnl: -24.95, ref: '#2531', ltp: '0.00' },
  { qty: 1, symbol: 'HUDCO', holdPrice: '41.35', pnl: 14.69, ref: '#2532', ltp: '0.00' },
  { qty: 5, symbol: 'IOC', holdPrice: '55.04', pnl: 139.30, ref: '#2539', ltp: '0.00' },
  { qty: 1, symbol: 'IRCON', holdPrice: '46.10', pnl: 39.41, ref: '#2540', ltp: '0.00' },
  { qty: 6, symbol: 'JPPOWER', holdPrice: '7.45', pnl: -9.12, ref: '#5003', ltp: '0.00' },
  { qty: 2, symbol: 'L&TFH', holdPrice: '90.92', pnl: 14.25, ref: '#5013', ltp: '0.00' }
];

// Watchlist demo data
const wlFavorites = [
  { name: 'SENSEX', exch: 'INDICES', price: 61560.64, change: -371.83, pct: -0.60 },
  { name: 'NIFTY 50', exch: 'INDICES', price: 18181.75, change: -104.75, pct: -0.57 },
  { name: 'ASTRON', exch: 'NSE', price: 26.05, change: -0.35, pct: -1.32 },
  { name: 'ASIANPAINT', exch: 'NSE', price: 3092.45, change: -45.65, pct: -1.45 },
  { name: 'RITES', exch: 'NSE', price: 396.50, change: 8.15, pct: 2.09 },
  { name: 'BHEL', exch: 'BSE', price: 82.30, change: 0.74, pct: 0.90, copies: 43 },
  { name: 'RELIANCE', exch: 'NSE', price: 2439.30, change: -14.50, pct: -0.59 },
  { name: 'NIFTYBEES', exch: 'BSE', price: 199.79, change: -0.76, pct: -0.37 }
];
const wlMyList = [
  { name: 'LUPIN', exch: 'BSE', price: 0, change: 0, pct: 0 },
  { name: 'RELIANCE', exch: 'NSE', price: 2439.30, change: -14.50, pct: -0.59 },
  { name: 'SBIN', exch: 'NSE', price: 0, change: 0, pct: 0, copies: 4 },
  { name: 'TATAMOTORS', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'MARUTI', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'NIFTY 50', exch: 'INDICES', price: 18181.75, change: -104.75, pct: -0.57 },
  { name: 'IRCTC', exch: 'NSE', price: 0, change: 0, pct: 0 },
  { name: 'YESBANK', exch: 'NSE', price: 0, change: 0, pct: 0 }
];

// ---------- Portfolio Page ----------
function PortfolioPage() {
  const [tab, setTab] = useState('holdings');

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl leading-8 font-semibold text-[#0f172a]">Portfolio</h1>
          <div className="flex items-center gap-5">
            <Icon name="shopping-cart" className="w-7 h-7 text-[#374151]" />
            <Icon name="chevron-down" className="w-7 h-7 text-[#374151]" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-center gap-6 text-[20px] font-medium text-[#334155]">
          <button onClick={() => setTab('holdings')} className={`relative pb-2 transition-colors ${tab === 'holdings' ? 'text-[#3D73F1]' : ''}`}>
            <span className="align-middle">Holdings</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[14px] ${tab === 'holdings' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>17</span>
            {tab === 'holdings' && <span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />}
          </button>
          <button onClick={() => setTab('positions')} className={`relative pb-2 transition-colors ${tab === 'positions' ? 'text-[#3D73F1]' : ''}`}>
            <span>Positions</span>
            <span className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-[14px] ${tab === 'positions' ? 'bg-[#dbeafe] text-[#3D73F1]' : 'bg-[#e5e7eb] text-[#475569]'}`}>8</span>
            {tab === 'positions' && <span className="absolute -bottom-[3px] left-0 w-10 h-[3px] bg-[#3D73F1] rounded-full" />}
          </button>
        </div>
      </div>

      {/* Summary card (changes per tab) */}
      <section className="px-4 mt-4">
        {tab === 'holdings' ? (
          <div className="bg-white rounded-[16px] shadow-sm px-4 sm:px-5 py-4 sm:py-5">
            <div className="flex items-center justify-between text-[16px] text-[#6b7280]"><span>Invested</span><span>Current</span></div>
            <div className="mt-2 flex items-center justify-between text-[28px] font-medium text-[#111827]"><span>13,228.55</span><span>15,758.71</span></div>
            <div className="mt-3 h-[1px] bg-[#eef1f5]" />
            <div className="mt-3 flex items-center justify-between"><span className="text-[18px] text-[#6b7280]">P&L</span><div className="flex items-center gap-3 text-[22px] font-medium text-[#34C759]"><span>+2,530.16</span><span className="inline-flex items-center px-3 py-1 rounded-[999px] text-[16px] bg-[#EAF7EE] text-[#34C759]">+19.13%</span></div></div>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] shadow-md px-4 sm:px-6 py-5 sm:py-6 text-center"><div className="text-[18px] leading-6 text-[#9aa3af]">Total P&L</div><div className="mt-2 text-[34px] leading-8 font-semibold text-[#D04C4C]">-273.75</div></div>
        )}
      </section>

      {/* Filters row */}
      <div className="px-4 mt-3">
        {tab === 'holdings' ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon name="search" className="w-6 h-6 text-[#2563eb]" />
              <Icon name="sliders" className="w-6 h-6 text-[#2563eb]" />
              <button className="inline-flex items-center gap-2 rounded-md bg-[#EEF2F7] px-3 py-1.5"><span className="text-[16px] font-medium text-[#2563eb]">Equity</span><Icon name="chevron-down" className="w-4 h-4 text-[#2563eb]" /></button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#2563eb]"><Icon name="users" className="w-6 h-6 text-[#2563eb]" /><span className="text-[16px]">Family</span></div>
              <div className="flex items-center gap-2 text-[#2563eb]"><Icon name="pie-chart" className="w-6 h-6 text-[#2563eb]" /><span className="text-[16px]">Analytics</span></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><Icon name="search" className="w-6 h-6 text-[#2563eb]" /><Icon name="sliders" className="w-6 h-6 text-[#2563eb]" /></div>
            <div className="flex items-center gap-6">
              <button className="inline-flex items-center gap-2 text-[#1f2937]"><span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#f97316] shadow-sm"><Icon name="activity" className="w-[18px] h-[18px] text-white" /></span><span className="text-[16px]">Analyze</span></button>
              <div className="flex items-center gap-2 text-[#2563eb]"><Icon name="pie-chart" className="w-7 h-7 text-[#2563eb]" /><span className="text-[16px]">Analytics</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Content lists */}
      {tab === 'holdings' ? (
        <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
          {holdings.map((h, i) => (
            <div key={h.name + i} className="px-4 py-4">
              <div className="flex items-center justify-between text-[15px] text-[#6b7280]"><span>Qty. {h.qty} • Avg. {h.avg}</span><span className={`${h.pct.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'} font-medium`}>{h.pct}</span></div>
              <div className="mt-0.5 flex items-center justify-between"><span className="text-[18px] font-medium text-[#0f172a]">{h.name}</span><span className={`${h.change.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'} text-[16px] font-medium`}>{h.change}</span></div>
              <div className="mt-1 flex items-center justify-between text-[14px] text-[#6b7280]"><span>Invested {h.invested}</span><span className="text-[#6b7280]">LTP {h.ltp} <span className={`${h.ltpPct.startsWith('-') ? 'text-[#dc2626]' : 'text-[#34C759]'}`}>({h.ltpPct})</span></span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
          {positions.map((p, i) => (
            <div key={p.symbol + i} className="px-4 py-5">
              <div className="grid grid-cols-[1fr_auto] gap-y-1 items-center">
                <div className="text-[14px] text-[#64748b]">Qty. <span className={`${p.qty < 0 ? 'text-[#e11d48]' : 'text-[#2563eb]'} font-medium`}>{p.qty}</span> <span className="text-[#94a3b8]">Avg.</span> <span className="tracking-wide">{p.avg}</span></div>
                <div className="justify-self-end"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#F2EEFF] text-[#5b5f97] border border-[#E6E0FF]">{p.product}</span></div>
                <div className="mt-1 text-[18px] font-medium text-[#0f172a] tracking-wide">{p.symbol}</div>
                <div className={`mt-1 text-[17px] font-medium justify-self-end ${p.pnl.startsWith('-') ? 'text-[#e11d48]' : 'text-[#34C759]'}`}>{p.pnl}</div>
                <div className="text-[13px] text-[#9aa3af] mt-1">{p.segment}</div>
                <div className="text-[13px] text-[#9aa3af] mt-1 justify-self-end">LTP {p.ltp}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Day's P&L bar (only on holdings) */}
      {tab === 'holdings' && (
        <div className="fixed inset-x-0 [bottom:calc(64px+env(safe-area-inset-bottom))] h-[44px] bg-white border-t border-[#eef1f5] flex items-center justify-between px-4"><span className="text-[16px] text-[#6b7280]">Day's P&L</span><span className="text-[18px] font-medium text-[#34C759] tracking-wide">+35.70 <span className="ml-2">+0.23 %</span></span></div>
      )}
    </div>
  );
}

// ---------- Watchlist Page ----------
function WatchlistRow({ item }) {
  const pos = item.change > 0;
  const zero = item.price === 0;
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-[1fr_auto] items-center">
        <div>
          <div className="text-[15px] tracking-wide text-[#0f172a]">{item.name}</div>
          <div className="mt-1 text-[12px] text-[#9aa3af] flex items-center gap-2">
            <span>{item.exch}</span>
            {item.copies && (
              <span className="inline-flex items-center gap-1 text-[#94a3b8]"><Icon name="copy" className="w-3.5 h-3.5" /> {item.copies}</span>
            )}
          </div>
        </div>
        <div className={`text-[15px] font-medium ${zero ? 'text-[#6b7280]' : pos ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {zero ? '0.00' : item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
        <div />
        <div className={`justify-self-end ${zero ? '' : pos ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {zero ? '0.00 (0.00%)' : `${pos ? '+' : ''}${item.change.toFixed(2)} (${pos ? '+' : ''}${item.pct.toFixed(2)}%)`}
        </div>
      </div>
    </div>
  );
}

function WatchlistPage() {
  const [tab, setTab] = useState('favorites');
  const items = tab==='favorites' ? wlFavorites : wlMyList;
  const count = tab==='favorites' ? '20/100' : '25/100';

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl leading-8 font-semibold text-[#0f172a]">Watchlist</h1>
          <div className="flex items-center gap-5">
            <Icon name="shopping-cart" className="w-7 h-7 text-[#374151]" />
            <Icon name="chevron-down" className="w-7 h-7 text-[#374151]" />
          </div>
        </div>
      </header>

      {/* Top tabs */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-6 text-[16px] font-medium text-[#374151]">
          {([
            {key:'favorites', label:'Favorites'}, {key:'my', label:'My list'}
          ]).map(({key,label}) => (
            <button key={key} onClick={()=>setTab(key)} className={`relative pb-2 ${tab===key?'text-[#2563eb]':''}`}>
              {label}
              {tab===key && <span className="absolute -bottom-[3px] left-0 w-8 h-[3px] bg-[#2563eb] rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-[12px] px-3 py-3 flex items-center justify-between shadow-[0_1px_0_0_#eef1f5]">
          <div className="flex items-center gap-3 text-[#9aa3af]">
            <Icon name="search" className="w-5 h-5 text-[#9aa3af]" />
            <span className="text-[15px]">Search & add</span>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
            <span>{count}</span>
            <Icon name="sliders" className="w-5 h-5 text-[#6b7280]" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-2 bg-white divide-y divide-[#eef1f5]">
        {items.map((it, idx) => <WatchlistRow key={idx} item={it} />)}
      </div>
    </div>
  );
}

// ---------- Orders Page ----------
function StatusChip({ children, tone='gray' }) {
  const tones = {
    gray: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]',
    green: 'bg-[#EAF7EE] text-[#10B981] border-[#c7f0d9]',
    red: 'bg-[#FEE2E2] text-[#EF4444] border-[#fecaca]',
    blue: 'bg-[#EEF2FF] text-[#2563eb] border-[#e0e7ff]'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] border ${tones[tone]}`}>{children}</span>;
}

function OrdersPage() {
  const [tab, setTab] = useState('open');

  const Header = (
    <header className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl leading-8 font-semibold text-[#0f172a]">Orders</h1>
        <div className="flex items-center gap-5">
          <Icon name="shopping-cart" className="w-7 h-7 text-[#374151]" />
          <Icon name="chevron-down" className="w-7 h-7 text-[#374151]" />
        </div>
      </div>
    </header>
  );

  const TopTabs = (
    <div className="px-4 mt-3">
      <div
        className="flex items-center gap-6 text-[18px] font-medium text-[#374151] overflow-x-auto whitespace-nowrap -mx-4 px-4"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {([
          { k: 'open', l: 'Open', n: 6 },
          { k: 'executed', l: 'Executed', n: 5 },
          { k: 'gtt', l: 'GTT', n: 5 },
          { k: 'baskets', l: 'Baskets', n: 5 },
          { k: 'sips', l: 'SIPs', n: 2 },
          { k: 'alerts', l: 'Alerts', n: 3 }
        ]).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`relative pb-2 shrink-0 ${tab === t.k ? 'text-[#2563eb]' : ''}`}
          >
            {t.l}
            <span
              className={`ml-2 inline-flex items-center justify-center rounded-full min-w-[22px] h-[22px] text-[12px] ${
                tab === t.k ? 'bg-[#c7d2fe] text-[#2563eb]' : 'bg-[#e5e7eb] text-[#6b7280]'
              }`}
            >
              {t.n}
            </span>
            {tab === t.k && (
              <span className="absolute -bottom-[3px] left-0 w-8 h-[3px] bg-[#2563eb] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchRow = (
    <div className="px-4 mt-3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center bg-white rounded-t-[16px] px-3 py-2">
        <div className="flex items-center gap-4"><Icon name="search" className="w-6 h-6 text-[#2563eb]" /><Icon name="sliders" className="w-6 h-6 text-[#2563eb]" /></div>
        {(tab==='open'||tab==='gtt'||tab==='executed') && <div />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {Header}
      {TopTabs}
      {SearchRow}

      {/* Content sections */}
      {tab==='open' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[1,2,3,4,5].map((i)=> (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                <div className="flex items-center gap-3"><StatusChip tone={i===1?'red':'blue'}>{i===1?'SELL':'BUY'}</StatusChip> <span>0/1</span></div>
                <div className="justify-self-end inline-flex items-center gap-2"><Icon name="clock" className="w-4 h-4 text-[#94a3b8]" /> 13:39:{10+i}<StatusChip>OPEN</StatusChip></div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] font-medium tracking-wide text-[#0f172a]">{i===1?'PNB':i===2?'INFY':i===3?'USDINR23MAYFUT':i===4?'USDINR23MAYFUT':'SBIN'}</div>
                <div className="text-[15px] text-[#0f172a]">{i===2?'49.50 / 48.50 trg.':i>=3?'81.0000':'0.00 / 48.50 trg.'}</div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                <div>{i===1?'NSE  CO  SL-M':i===2?'NSE  CO  LIMIT':i===3?'CDS  NRML  LIMIT  1/2':i===4?'CDS  MIS  LIMIT':''}</div>
                <div className="justify-self-end">LTP 0.00</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='executed' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[1,2,3,4].map((i)=> (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                <div className="flex items-center gap-3"><StatusChip tone={i===3?'red':'blue'}>{i===3?'SELL':'BUY'}</StatusChip> <span>{i===1?'0/50':i===2?'0/50':i===3?'0/1':'1/1'}</span></div>
                <div className="justify-self-end inline-flex items-center gap-2"><Icon name="clock" className="w-4 h-4 text-[#94a3b8]" /> 13:4{5-i}:0{9-i} <StatusChip tone={i===1||i===2?'red':'green'}>{i===1||i===2?'REJECTED':i===3?'CANCELLED':'COMPLETE'}</StatusChip></div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] font-medium tracking-wide text-[#0f172a]">{i<=2?'NIFTY2351118300CE':i===3?'PNB':'INFY'}</div>
                <div className="text-[15px] text-[#0f172a]">{i<=2?'0.00':i===3?'51.20':'Avg. 50.75'}</div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                <div>{i<=2?'NFO  NRML  MARKET':i===3?'NSE  CNC  LIMIT':'NSE  CNC  MARKET'}</div>
                <div />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='gtt' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[1,2,3,4,5].map((i)=> (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]">
                <div className="flex items-center gap-3"><StatusChip tone="gray">{i===1||i===4? 'OCO' : 'SINGLE'}</StatusChip> <StatusChip tone={i===2||i===3?'red':'blue'}>{(i===2||i===3)?'SELL':'BUY'}</StatusChip></div>
                <StatusChip tone="green">{i<=3?'ACTIVE':'TRIGGERED'}</StatusChip>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] font-medium tracking-wide text-[#0f172a]">{i===1?'PNB':i===2?'IDEA':i===3?'ONGC':'NIFTY2351118300CE'}</div>
                <div className="text-[15px] text-[#0f172a]">{i===1?'47.80 / 52.85':i===2?'6.65':i===3?'136.20': i===4?'50.40 / 51.45':'51.05 / 50.00'}</div>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[12px] text-[#9aa3af]">
                <div>Qty {i===1? '1/1' : i===4 || i===5 ? '50/50' : '1'}</div>
                <div className="justify-self-end">LTP 0.00</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='baskets' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {['Bull call spread','Calender spread','Butterfly Spread','IT stocks','ETFs'].map((n,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="text-[16px] text-[#0f172a]">{n}</div>
                  <div className="text-[12px] text-[#9aa3af] mt-1">Created on 8th May 2023</div>
                </div>
                <div className="text-[14px] text-[#6b7280]">{[2,2,3,4,4][idx]} items</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='sips' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[{n:'Weekly SIPs', s:'ACTIVE', sub:'Executes today'},{n:'Monthly SIPs', s:'PAUSED', sub:'Created on 15th February 2023'}].map((r,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="text-[16px] text-[#0f172a]">{r.n}</div>
                  <div className="text-[12px] text-[#9aa3af] mt-1">{r.sub}</div>
                </div>
                <StatusChip tone={r.s==='ACTIVE'?'green':'red'}>{r.s}</StatusChip>
              </div>
              <div className="text-[12px] text-[#6b7280] mt-1">1 basket</div>
            </div>
          ))}
        </div>
      )}

      {tab==='alerts' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {[{t:'Nifty 10% down from all time high', s:'ENABLED', sub:'Last price of NIFTY 50(INDICES) < 17,300.00'}, {t:'SBIN up- buy 100 qty', s:'DISABLED', sub:'Last price of SBIN(NSE) >= 573.35'}, {t:'Buy at 50rs', s:'ENABLED', sub:'Last price of NIFTY23MAY18300CE(NFO) < 50.00'}].map((a,idx)=> (
            <div key={idx} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div className="text-[16px] text-[#0f172a]">{a.t}</div>
                <StatusChip tone={a.s==='ENABLED'?'green':'red'}>{a.s}</StatusChip>
              </div>
              <div className="text-[12px] text-[#9aa3af] mt-1">{a.sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Bids Page ----------
function BidsPage() {
  const [tab, setTab] = useState('ipo');
  const [ipoSub, setIpoSub] = useState('ongoing');

  const Header = (
    <header className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl leading-8 font-semibold text-[#0f172a]">Bids</h1>
        <div className="flex items-center gap-5">
          <Icon name="shopping-cart" className="w-7 h-7 text-[#374151]" />
          <Icon name="chevron-down" className="w-7 h-7 text-[#374151]" />
        </div>
      </div>
    </header>
  );

  const TabPills = (
    <div className="px-4 mt-3">
      <div className="flex justify-center items-center gap-6 sm:gap-12 text-[18px] font-medium text-[#374151]">
        {(['ipo','govt','auctions']).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative pb-2 flex flex-col items-center ${tab===t?'text-[#2563eb]':''}`}>
            <span className="flex items-center">
              <span className="capitalize">{t === 'ipo' ? 'IPO' : t === 'govt' ? 'Govt. securities' : 'Auctions'}</span>
              {t==='ipo' && (<span className={`ml-2 inline-flex items-center justify-center rounded-full min-w-[22px] h-[22px] text-[12px] ${tab==='ipo'?'bg-[#c7d2fe] text-[#2563eb]':'bg-[#e5e7eb] text-[#6b7280]'}`}>1</span>)}
              {t==='auctions' && (<span className={`ml-2 inline-flex items-center justify-center rounded-full min-w-[22px] h-[22px] text-[12px] ${tab==='auctions'?'bg-[#c7d2fe] text-[#2563eb]':'bg-[#e5e7eb] text-[#6b7280]'}`}>18</span>)}
            </span>
            {tab===t && <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#2563eb] rounded-full"/>}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchRow = (
    <div className="px-4 mt-3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center bg-white rounded-t-[16px] px-3 py-2">
        <div className="flex items-center gap-4"><Icon name="search" className="w-6 h-6 text-[#2563eb]" /><Icon name="sliders" className="w-6 h-6 text-[#2563eb]" /></div>
        {tab==='ipo' ? (
          <div className="justify-self-center flex gap-2 text-[15px]">
            {(['ongoing','applied','upcoming']).map(s => (
              <button key={s} onClick={()=>setIpoSub(s)} className={`px-4 h-8 inline-flex items-center rounded-[10px] border ${ipoSub===s?'bg-[#e5edff] text-[#2563eb] border-[#c7d2fe] shadow-inner':'text-[#6b7280] border-transparent hover:bg-[#f3f4f6]'} transition`}>{s[0].toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        ) : <div />}
        <div />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {Header}
      {TabPills}
      {SearchRow}

      {tab==='ipo' && ipoSub==='ongoing' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {ipos.map((it, idx) => (
            <div key={idx} className="px-4 py-5">
              <div className="text-[13px] text-[#9aa3af]">{it.company}</div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center">
                <div className="text-[18px] font-medium tracking-wide text-[#0f172a] flex items-center gap-2">{it.symbol}{it.tag && <span className="text-[12px] text-[#2563eb] font-medium">{it.tag}</span>}</div>
                {it.cta ? (
                  <button className="justify-self-end h-8 px-3.5 rounded-[8px] bg-[#3B82F6] text-white text-[14px] font-medium shadow-sm hover:bg-[#2563eb] active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#bfdbfe]">{it.cta}</button>
                ) : (
                  <span className="justify-self-end h-8 inline-flex items-center px-3.5 rounded-[8px] bg-[#f3f4f6] text-[#6b7280] text-[13px] border border-[#e5e7eb]">{it.status}</span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto] text-[14px] text-[#6b7280]"><div>{it.price}</div><div className="justify-self-end">{it.dates}</div></div>
            </div>
          ))}
          <div className="px-4 py-5"><button className="text-[#2563eb] text-[16px] font-medium inline-flex items-center gap-2 hover:underline active:translate-y-[0.5px] transition">View upcoming IPOs <Icon name="arrow-right" className="w-5 h-5 text-[#2563eb]" /></button></div>
        </div>
      )}

      {tab==='govt' && (
        <div className="bg-white flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="w-44 h-36 border-2 border-dashed border-[#d1d5db] rounded-[12px] flex items-center justify-center mb-6"><div className="w-24 h-16 bg-[#f3f4f6] rounded" /></div>
          <div className="text-[18px] font-medium text-[#374151]">No securities available for bidding</div>
          <button className="mt-4 text-[#2563eb] text-[16px] font-medium">Read more</button>
        </div>
      )}

      {tab==='auctions' && (
        <div className="bg-white divide-y divide-[#eef1f5]">
          {auctions.map((a, i) => (
            <div key={i} className="px-4 py-4">
              <div className="grid grid-cols-[1fr_auto] items-center text-[13px] text-[#9aa3af]"><div>Eligible qty <span className="text-[#0f172a]">{a.qty}</span></div><div className="justify-self-end">Holding P&L <span className={`${a.pnl>=0?'text-[#10B981]':'text-[#EF4444]'} font-medium`}>{a.pnl>=0?`+${a.pnl.toFixed(2)}`:a.pnl.toFixed(2)}</span></div></div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center"><div className="text-[18px] font-medium text-[#0f172a] tracking-wide">{a.symbol}</div><div className="text-[14px] text-[#6b7280]">{a.ref}</div></div>
              <div className="mt-1 grid grid-cols-[1fr_auto] text-[13px] text-[#9aa3af]"><div>Holding price <span className="text-[#0f172a]">{a.holdPrice}</span></div><div className="justify-self-end">LTP {a.ltp}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Profile Page ----------
function RowItem({ left, right, icon }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between border-b border-[#eef1f5]">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[15px] text-[#0f172a]">{left}</span>
      </div>
      {right || <Icon name="chevron-right" className="w-5 h-5 text-[#9aa3af]" />}
    </div>
  );
}

function ChipLink({ children }) {
  return (
    <button className="text-[#2563eb] text-[15px] px-2 py-1 rounded-md hover:underline active:translate-y-[0.5px]">{children}</button>
  );
}

function ProfilePage() {
  const [privacy, setPrivacy] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4 bg-[#eff1f5]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[20px] text-[#0f172a] font-medium">Mahammad Sayad</div>
          </div>
          <div className="flex items-center gap-5">
            <Icon name="shopping-cart" className="w-6 h-6 text-[#374151]" />
            <Icon name="chevron-down" className="w-6 h-6 text-[#374151]" />
          </div>
        </div>
      </header>

      {/* Account Card */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-[12px] shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[16px] font-medium text-[#0f172a]">FJP018</div>
              <div className="text-[13px] text-[#9aa3af]">sahadsaad186@gmail.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center text-[14px] text-[#334155]">MS</div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[14px] text-[#6b7280]">Privacy mode</div>
            <button onClick={()=>setPrivacy(!privacy)} className={`w-12 h-6 rounded-full transition-colors ${privacy?'bg-[#2563eb]':'bg-[#d1d5db]' } relative`}>
              <span className={`absolute top-0.5 ${privacy?'right-1':'left-1'} w-5 h-5 rounded-full bg-white shadow`}></span>
            </button>
          </div>
        </div>
      </section>

      {/* Account section */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Account</div>
        <RowItem left="Funds" right={<RupeeIcon className="w-5 h-5 text-[#6b7280]" size={20} strokeWidth={2} />} />
        <RowItem left="App Code" right={<Icon name="lock" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Profile" right={<Icon name="user" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Settings" right={<Icon name="settings" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Connected apps" right={<Icon name="box" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Logout" right={<Icon name="log-out" className="w-5 h-5 text-[#6b7280]" />} />
      </section>

      {/* Console quick links */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Console</div>
        <div className="px-4 pb-4 flex flex-wrap gap-x-6 gap-y-3 text-[#2563eb]">
          <ChipLink>Portfolio</ChipLink>
          <ChipLink>Tradebook</ChipLink>
          <ChipLink>P&amp;L</ChipLink>
          <ChipLink>Tax P&amp;L</ChipLink>
          <ChipLink>Gift stocks</ChipLink>
          <ChipLink>Family</ChipLink>
          <ChipLink>Downloads</ChipLink>
        </div>
      </section>

      {/* Support */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Support</div>
        <RowItem left="Support portal" right={<Icon name="life-buoy" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="User manual" right={<Icon name="help-circle" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Contact" right={<Icon name="phone" className="w-5 h-5 text-[#6b7280]" />} />
      </section>

      {/* Others */}
      <section className="mt-4 bg-white">
        <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">Others</div>
        <RowItem left="Invite friends" right={<Icon name="user-plus" className="w-5 h-5 text-[#6b7280]" />} />
        <RowItem left="Licenses" right={<Icon name="file-text" className="w-5 h-5 text-[#6b7280]" />} />
        <div className="px-4 py-4 text-[12px] text-[#9aa3af]">Kite v3 b234</div>
      </section>

      {/* Footer */}
      <div className="py-8 flex items-center justify-center text-[#c4c7ce]">
        <div className="tracking-widest text-[12px]">ZERODHA</div>
      </div>
    </div>
  );
}

// ---------- Shell with bottom nav ----------
export default function App() {
  const [active, setActive] = useState('watchlist');

  return (
    <div className="relative min-h-screen bg-[#f7f8fa]">
      <div className="pb-[calc(64px+env(safe-area-inset-bottom))]">
        {active === 'watchlist' && <WatchlistPage />}
        {active === 'orders' && <OrdersPage />}
        {active === 'portfolio' && <PortfolioPage />}
        {active === 'bids' && <BidsPage />}
        {active === 'user' && <ProfilePage />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#e5e7eb] grid grid-cols-5" style={{height:'calc(64px + env(safe-area-inset-bottom))', paddingBottom:'env(safe-area-inset-bottom)'}}>
        {/* Watchlist */}
        <button onClick={()=>setActive('watchlist')} className={`flex flex-col items-center justify-center text-[12px] ${active==='watchlist'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="bookmark" className={`w-7 h-7 ${active==='watchlist'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Watchlist</span>
        </button>
        {/* Orders (placeholder) */}
        <button onClick={()=>setActive('orders')} className={`flex flex-col items-center justify-center text-[12px] ${active==='orders'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="book" className={`w-7 h-7 ${active==='orders'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Orders</span>
        </button>
        {/* Portfolio */}
        <button onClick={()=>setActive('portfolio')} className={`flex flex-col items-center justify-center text-[12px] ${active==='portfolio'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="briefcase" className={`w-7 h-7 ${active==='portfolio'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Portfolio</span>
        </button>
        {/* Bids */}
        <button onClick={()=>setActive('bids')} className={`flex flex-col items-center justify-center text-[12px] ${active==='bids'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <GavelIcon className={`w-7 h-7 ${active==='bids'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">Bids</span>
        </button>
        {/* User */}
        <button onClick={()=>setActive('user')} className={`flex flex-col items-center justify-center text-[12px] ${active==='user'?'text-[#2563eb]':'text-[#6b7280]'}`}>
          <Icon name="user" className={`w-7 h-7 ${active==='user'?'text-[#2563eb]':'text-[#2f3542]'}`} />
          <span className="mt-1">FJP018</span>
        </button>
      </nav>
    </div>
  );
}
