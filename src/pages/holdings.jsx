import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import { useData } from '../context/DataContext.jsx';
import HoldingsStockModal from '../components/HoldingsStockModal.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Market timing aware price function - no fluctuations when market is closed
const fluctuatePrice = (basePrice, volatility = 0.002) => {
  // Check if market is open (9:15 AM - 3:15 PM IST, Monday-Friday)
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTimeMinutes = hours * 60 + minutes;
  
  const marketOpenTime = 9 * 60 + 15; // 9:15 AM
  const marketCloseTime = 15 * 60 + 15; // 3:15 PM
  
  const isWeekend = day === 0 || day === 6;
  const isMarketHours = currentTimeMinutes >= marketOpenTime && currentTimeMinutes <= marketCloseTime;
  const isMarketOpen = !isWeekend && isMarketHours;
  
  if (!isMarketOpen) {
    // Market is closed - return static price (no fluctuations)
    return basePrice;
  }
  
  // Market is open - allow small fluctuations
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
};

// ---------- Holdings Component ----------
function Holdings({ onViewChart }) {
  const { holdings } = useData();
  const [fluctuatingHoldings, setFluctuatingHoldings] = useState(holdings);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  useEffect(() => {
    // Initialize fluctuating data
    setFluctuatingHoldings(holdings.map(holding => ({
      ...holding,
      baseLtp: parseFloat(holding.ltp) || 70.0,
      currentLtp: parseFloat(holding.ltp) || 70.0
    })));
  }, [holdings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFluctuatingHoldings(prevHoldings => 
        prevHoldings.map(holding => {
          const newLtp = fluctuatePrice(holding.baseLtp);
          const ltpChange = ((newLtp - holding.baseLtp) / holding.baseLtp) * 100;
          
          // Calculate new P&L based on fluctuating LTP
          const invested = parseFloat(holding.invested.replace(/,/g, '')) || 0;
          const currentValue = holding.qty * newLtp;
          const pnlAmount = currentValue - invested;
          const pnlPercentage = invested > 0 ? (pnlAmount / invested) * 100 : 0;
          
          return {
            ...holding,
            currentLtp: newLtp,
            ltp: newLtp.toFixed(2),
            ltpPct: `${ltpChange >= 0 ? '+' : ''}${ltpChange.toFixed(2)}%`,
            change: `${pnlAmount >= 0 ? '+' : ''}${pnlAmount.toFixed(2)}`,
            pct: `${pnlPercentage >= 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%`
          };
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic totals
  const totalInvested = fluctuatingHoldings.reduce((sum, h) => sum + parseFloat(h.invested.replace(/,/g, '')), 0);
  const totalCurrent = fluctuatingHoldings.reduce((sum, h) => sum + (h.qty * h.currentLtp), 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  const handleStockClick = (holding) => {
    // Transform holding data to match stock modal format
    const stockData = {
      name: holding.name,
      symbol: holding.name,
      price: holding.currentLtp,
      change: (holding.currentLtp - holding.baseLtp),
      pct: ((holding.currentLtp - holding.baseLtp) / holding.baseLtp) * 100,
      exch: 'NSE',
      qty: holding.qty,
      avgPrice: parseFloat(holding.avg),
      invested: parseFloat(holding.invested.replace(/,/g, '')),
      current: holding.qty * holding.currentLtp,
      pnl: (holding.qty * holding.currentLtp) - parseFloat(holding.invested.replace(/,/g, ''))
    };
    setSelectedStock(stockData);
    setShowStockModal(true);
  };

  const handleModalClose = () => {
    setShowStockModal(false);
    setSelectedStock(null);
  };

  return (
    <>
      {/* Summary card */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-[8px] shadow-sm px-4 py-4">
          <div className="flex items-center justify-between text-[13px] text-[#6b7280]"><span>Invested</span><span>Current</span></div>
          <div className="mt-2 flex items-center justify-between text-[22px] text-[#111827]">
            <span>{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>{totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="mt-3 h-[1px] bg-[#eef1f5]" />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[14px] text-[#6b7280]">P&L</span>
            <div className="flex items-center gap-2 text-[17px] text-[#34C759]">
              <span>{totalPnl >= 0 ? '+' : ''}{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-[999px] text-[13px] bg-[#EAF7EE] text-[#34C759]">
                {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters row */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="search" className="w-4 h-4 text-[#2563eb]" />
            <Icon name="sliders" className="w-4 h-4 text-[#2563eb]" />
            <button className="inline-flex items-center gap-1 rounded-md bg-[#EEF2F7] px-2 py-0.5"><span className="text-[13px] text-[#2563eb]">Equity</span><Icon name="chevron-down" className="w-3 h-3 text-[#2563eb]" /></button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#2563eb]"><Icon name="users" className="w-4 h-4 text-[#2563eb]" /><span className="text-[13px]">Family</span></div>
            <div className="flex items-center gap-1 text-[#2563eb]"><img src="/images/console.svg" className="w-4 h-4" style={{ mixBlendMode: 'multiply' }} alt="Analytics" /><span className="text-[13px]">Analytics</span></div>
          </div>
        </div>
      </div>

      {/* Holdings list */}
      <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
        {fluctuatingHoldings.map((h, i) => (
          <div 
            key={h._id || h.id || h.name + i} 
            className="px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleStockClick(h)}
          >
            <div className="flex items-center justify-between text-[15px] text-[#6b7280]"><span>Qty. {h.qty} • Avg. {h.avg}</span><span className={`${h.pct.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'}`}>{h.pct}</span></div>
            <div className="mt-0.5 flex items-center justify-between"><span className="text-[18px] text-[#0f172a]">{h.name}</span><span className={`${h.change.startsWith('+') ? 'text-[#34C759]' : 'text-[#dc2626]'} text-[16px]`}>{h.change}</span></div>
            <div className="mt-1 flex items-center justify-between text-[14px] text-[#6b7280]"><span>Invested {h.invested}</span><span className="text-[#6b7280]">LTP {h.ltp} <span className={`${h.ltpPct && h.ltpPct.startsWith('-') ? 'text-[#dc2626]' : 'text-[#34C759]'}`}>({h.ltpPct || '+0.00%'})</span></span></div>
          </div>
        ))}
      </div>

      {/* Fixed Day's P&L bar */}
      <div className="fixed inset-x-0 [bottom:calc(64px+env(safe-area-inset-bottom))] h-[44px] bg-white border-t border-[#eef1f5] flex items-center justify-between px-4">
        <span className="text-[16px] text-[#6b7280]">Day's P&L</span>
        <span className="text-[16px] text-[#34C759] tracking-wide">
          +{(totalPnl * 0.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
          <span className="ml-2 text-[14px]">+{(totalPnlPct * 0.4).toFixed(2)} %</span>
        </span>
      </div>

      {/* Holdings Stock Modal */}
      <HoldingsStockModal
        isOpen={showStockModal}
        onClose={handleModalClose}
        stock={selectedStock}
        onViewChart={onViewChart}
      />
    </>
  );
}

export default Holdings;