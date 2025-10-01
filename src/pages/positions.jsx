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
const fluctuatePrice = (basePrice, volatility = 0.003) => {
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

// ---------- Positions Component ----------
function Positions({ onViewChart }) {
  const { positions } = useData();
  const [fluctuatingPositions, setFluctuatingPositions] = useState(positions);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  useEffect(() => {
    // Initialize fluctuating data
    setFluctuatingPositions(positions.map(position => ({
      ...position,
      baseLtp: parseFloat(position.ltp) || 100.0,
      currentLtp: parseFloat(position.ltp) || 100.0,
      baseAvg: parseFloat(position.avg) || 95.0
    })));
  }, [positions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFluctuatingPositions(prevPositions => 
        prevPositions.map(position => {
          const newLtp = fluctuatePrice(position.baseLtp);
          
          // Calculate new P&L based on fluctuating LTP
          const qty = position.qty;
          const avgPrice = position.baseAvg;
          const pnlAmount = qty * (newLtp - avgPrice);
          
          return {
            ...position,
            currentLtp: newLtp,
            ltp: newLtp.toFixed(2),
            pnl: `${pnlAmount >= 0 ? '+' : ''}${pnlAmount.toFixed(2)}`
          };
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic total P&L
  const totalPnl = fluctuatingPositions.reduce((sum, p) => {
    const pnlValue = parseFloat(p.pnl.replace(/[+,-]/g, ''));
    return sum + (p.pnl.startsWith('-') ? -pnlValue : pnlValue);
  }, 0);

  const handleStockClick = (position) => {
    // Transform position data to match stock modal format
    const stockData = {
      name: position.symbol,
      symbol: position.symbol,
      price: position.currentLtp,
      change: position.currentLtp - position.baseAvg,
      pct: ((position.currentLtp - position.baseAvg) / position.baseAvg) * 100,
      exch: 'NSE',
      qty: position.qty,
      avgPrice: position.baseAvg,
      invested: Math.abs(position.qty) * position.baseAvg,
      current: Math.abs(position.qty) * position.currentLtp,
      pnl: parseFloat(position.pnl.replace(/[+,-]/g, '')) * (position.pnl.startsWith('-') ? -1 : 1)
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
        <div className="bg-white rounded-[8px] shadow-md px-4 sm:px-6 py-5 sm:py-6 text-center">
          <div className="text-[18px] leading-6 text-[#9aa3af]">Total P&L</div>
          <div className={`mt-2 text-[28px] leading-8 ${totalPnl >= 0 ? 'text-[#34C759]' : 'text-[#D04C4C]'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
          </div>
        </div>
      </section>

      {/* Filters row */}
      <div className="px-4 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name="search" className="w-5 h-5 text-[#2563eb]" />
            <Icon name="sliders" className="w-5 h-5 text-[#2563eb]" />
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1 text-[#2563eb]"><img src="/images/analyze.png" className="w-[18px] h-[18px]" style={{ mixBlendMode: 'multiply' }} alt="Analyze" /><span className="text-[13px]">Analyze</span></button>
            <div className="flex items-center gap-1 text-[#2563eb]"><img src="/images/console.svg" className="w-5 h-5" style={{ mixBlendMode: 'multiply' }} alt="Analytics" /><span className="text-[13px]">Analytics</span></div>
          </div>
        </div>
      </div>

      {/* Positions list */}
      <div className="mt-2 divide-y divide-[#eef1f5] bg-white">
        {fluctuatingPositions.map((p, i) => (
          <div 
            key={p._id || p.id || p.symbol + i} 
            className="px-4 py-5 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleStockClick(p)}
          >
            <div className="grid grid-cols-[1fr_auto] gap-y-1 items-center">
              <div className="text-[14px] text-[#64748b]">Qty. <span className={`${p.qty < 0 ? 'text-[#e11d48]' : 'text-[#2563eb]'}`}>{p.qty}</span> <span className="text-[#94a3b8]">Avg.</span> <span className="tracking-wide">{p.avg}</span></div>
              <div className="justify-self-end"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] bg-[#F2EEFF] text-[#5b5f97] border border-[#E6E0FF]">{p.product}</span></div>
              <div className="mt-1 text-[18px] text-[#0f172a] tracking-wide">{p.symbol}</div>
              <div className={`mt-1 text-[17px] justify-self-end ${p.pnl.startsWith('-') ? 'text-[#e11d48]' : 'text-[#34C759]'}`}>{p.pnl}</div>
              <div className="text-[13px] text-[#9aa3af] mt-1">{p.segment}</div>
              <div className="text-[13px] text-[#9aa3af] mt-1 justify-self-end">LTP {p.ltp}</div>
            </div>
          </div>
        ))}
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

export default Positions;