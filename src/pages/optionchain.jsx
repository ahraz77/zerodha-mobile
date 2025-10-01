import React, { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart, BarChart3, MoreVertical, Search } from "lucide-react";

export default function OIGreeksMobile({ stock, onBack, onClose }) {
  const [selectedExpiry, setSelectedExpiry] = useState("28 Oct (4 Weeks)");
  const [fluctuatingData, setFluctuatingData] = useState({});

  // Initialize fluctuating data
  useEffect(() => {
    const initialData = {
      basePrice: stock?.price || 239.50,
      strikes: {
        '232.5': { callLtp: 13.2, putLtp: 5.15 },
        '235': { callLtp: 8.85, putLtp: 2.9 },
        '237.5': { callLtp: 10.3, putLtp: 7.2 },
        '240': { callLtp: 5.85, putLtp: 4.95 },
        '242.5': { callLtp: 7.85, putLtp: 9.7 },
        '245': { callLtp: 3.7, putLtp: 7.8 },
        '247.5': { callLtp: 5.85, putLtp: 12.7 },
        '250': { callLtp: 2.35, putLtp: 11.35 },
        '252.5': { callLtp: 4.25, putLtp: 16.05 }
      }
    };
    setFluctuatingData(initialData);
  }, [stock]);

  // Fluctuate prices every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFluctuatingData(prev => {
        const newData = { ...prev };
        
        // Fluctuate base price
        const baseFluctuation = (Math.random() - 0.5) * 30; // ±15 fluctuation
        newData.basePrice = Math.max(200, Math.min(300, (prev.basePrice || 239.50) + baseFluctuation));
        
        // Fluctuate strike prices
        Object.keys(prev.strikes || {}).forEach(strike => {
          const callFluctuation = (Math.random() - 0.5) * 4; // ±2 fluctuation
          const putFluctuation = (Math.random() - 0.5) * 4; // ±2 fluctuation
          
          newData.strikes[strike] = {
            callLtp: Math.max(0.1, (prev.strikes[strike]?.callLtp || 1) + callFluctuation),
            putLtp: Math.max(0.1, (prev.strikes[strike]?.putLtp || 1) + putFluctuation)
          };
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleExpiryClick = (expiry) => {
    setSelectedExpiry(expiry);
  };

  const handleStrikeClick = (strike, type) => {
    console.log(`Clicked ${type} for strike ${strike}`);
    // You can add more functionality here like showing order modal
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center">
      {/* Mobile frame */}
      <div className="w-[375px] min-h-screen bg-white">
        {/* App Bar */}
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <button className="p-1 -ml-1" onClick={onBack}><ChevronLeft className="w-6 h-6 text-[#2B2B2B]" strokeWidth={2.5}/></button>
            <div className="flex items-center gap-3">
              <div className="text-[16px] font-semibold text-[#2B2B2B] relative cursor-pointer">
                <span className="text-[#2F6BFF]">OI</span>
                <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#2F6BFF] rounded-full"/>
              </div>
              <div className="text-[16px] text-[#6F7A88] cursor-pointer hover:text-[#2F6BFF] transition-colors" onClick={() => console.log('Greeks clicked')}>Greeks</div>
            </div>
            <div className="flex items-center gap-4 text-[#6F7A88]">
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-[#2F6BFF] transition-colors" onClick={() => console.log('Cart clicked')} />
              <BarChart3 className="w-5 h-5 cursor-pointer hover:text-[#2F6BFF] transition-colors" onClick={() => console.log('Chart clicked')} />
              <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#2F6BFF] transition-colors" onClick={() => console.log('More options clicked')} />
            </div>
          </div>
        </div>

        {/* Search card */}
        <div className="px-3">
          <div className="rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-[#EEF1F5] p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 w-[210px]">
              <Search className="w-5 h-5 text-[#8B94A3]"/>
              <span className="text-[16px] text-[#2B2B2B]">{stock?.name || 'RELIANCE'}</span>
            </div>
            <div className="text-[14px] text-[#6F7A88]">
              {formatPrice(fluctuatingData.basePrice)}  {stock?.change?.toFixed(2) || '49.01'} ({stock?.pct?.toFixed(2) || '2.01'}%)
            </div>
          </div>
        </div>

        {/* Expiry chips */}
        <div className="px-3 mt-3 flex gap-3 overflow-x-auto no-scrollbar">
          <Chip 
            active={selectedExpiry === "28 Oct (4 Weeks)"} 
            onClick={() => handleExpiryClick("28 Oct (4 Weeks)")}
          >
            28 Oct (4 Weeks)
          </Chip>
          <Chip 
            active={selectedExpiry === "25 Nov (2 Months)"} 
            onClick={() => handleExpiryClick("25 Nov (2 Months)")}
          >
            25 Nov (2 Months)
          </Chip>
          <Chip 
            active={selectedExpiry === "30 Dec (3 Months)"} 
            onClick={() => handleExpiryClick("30 Dec (3 Months)")}
          >
            30 Dec (3 Months)
          </Chip>
        </div>

        {/* Header row */}
        <div className="mt-3">
          <ColumnsHeader/>
          <div className="h-[1px] bg-[#E9EDF2]"/>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-[#EFF2F6]">
          <Row 
            leftOI="0.00" leftPct="-100.00%" leftPctRed 
            callLtp={formatPrice(fluctuatingData.strikes?.['232.5']?.callLtp)} callPct="26,300.00%" callPctGreen 
            strike="232.5" 
            putLtp={formatPrice(fluctuatingData.strikes?.['232.5']?.putLtp)} putPct="-92.66%" putPctRed 
            rightOI="0.00" rightPct="0.00%"
            onStrikeClick={handleStrikeClick}
          />
          <Separator red />
          <Row 
            leftOI="10.64" leftPct="0.00%" 
            callLtp={formatPrice(fluctuatingData.strikes?.['235']?.callLtp)} callPct="0.00%" 
            strike="235" 
            putLtp={formatPrice(fluctuatingData.strikes?.['235']?.putLtp)} putPct="0.00%" 
            rightOI="13.59" rightPct="0.00%"
            onStrikeClick={handleStrikeClick}
          />
          <Separator green />
          <Row 
            leftOI="0.00" leftPct="-100.00%" leftPctRed 
            callLtp={formatPrice(fluctuatingData.strikes?.['237.5']?.callLtp)} callPct="3,333.33%" callPctGreen 
            strike="237.5" 
            putLtp={formatPrice(fluctuatingData.strikes?.['237.5']?.putLtp)} putPct="-82.37%" putPctRed 
            rightOI="0.00" rightPct="-100.00%" rightPctRed
            onStrikeClick={handleStrikeClick}
          />
          <Separator red />
          <Row 
            highlight strikeTag="240" 
            leftOI="47.76" leftPct="0.00%" 
            callLtp={formatPrice(fluctuatingData.strikes?.['240']?.callLtp)} callPct="0.00%" 
            strike="240" 
            putLtp={formatPrice(fluctuatingData.strikes?.['240']?.putLtp)} putPct="0.00%" 
            rightOI="45.47" rightPct="0.00%"
            onStrikeClick={handleStrikeClick}
          />
          <Separator green />
          <Row 
            leftOI="0.00" leftPct="-100.00%" leftPctRed 
            callLtp={formatPrice(fluctuatingData.strikes?.['242.5']?.callLtp)} callPct="15,600.00%" callPctGreen 
            strike="242.5" 
            putLtp={formatPrice(fluctuatingData.strikes?.['242.5']?.putLtp)} putPct="-64.07%" putPctRed 
            rightOI="0.00" rightPct="-100.00%" rightPctRed
            onStrikeClick={handleStrikeClick}
          />
          <Separator red />
          <Row 
            leftOI="27.90" leftPct="0.00%" 
            callLtp={formatPrice(fluctuatingData.strikes?.['245']?.callLtp)} callPct="0.00%" 
            strike="245" 
            putLtp={formatPrice(fluctuatingData.strikes?.['245']?.putLtp)} putPct="0.00%" 
            rightOI="11.63" rightPct="0.00%"
            onStrikeClick={handleStrikeClick}
          />
          <Separator green />
          <Row 
            leftOI="0.00" leftPct="-100.00%" leftPctRed 
            callLtp={formatPrice(fluctuatingData.strikes?.['247.5']?.callLtp)} callPct="11,600.00%" callPctGreen 
            strike="247.5" 
            putLtp={formatPrice(fluctuatingData.strikes?.['247.5']?.putLtp)} putPct="746.66%" putPctGreen 
            rightOI="0.00" rightPct="-100.00%" rightPctRed
            onStrikeClick={handleStrikeClick}
          />
          <Separator red />
          <Row 
            leftOI="41.01" leftPct="0.00%" 
            callLtp={formatPrice(fluctuatingData.strikes?.['250']?.callLtp)} callPct="0.00%" 
            strike="250" 
            putLtp={formatPrice(fluctuatingData.strikes?.['250']?.putLtp)} putPct="0.00%" 
            rightOI="8.64" rightPct="0.00%"
            onStrikeClick={handleStrikeClick}
          />
          <Separator red />
          <Row 
            leftOI="0.00" leftPct="-100.00%" leftPctRed 
            callLtp={formatPrice(fluctuatingData.strikes?.['252.5']?.callLtp)} callPct="304.76%" callPctGreen 
            strike="252.5" 
            putLtp={formatPrice(fluctuatingData.strikes?.['252.5']?.putLtp)} putPct="32,000.00%" putPctGreen 
            rightOI="0.00" rightPct="-100.00%" rightPctRed
            onStrikeClick={handleStrikeClick}
          />
        </div>

        {/* Bottom stats bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#E9EDF2] px-3 py-3 grid grid-cols-4 text-center">
          <Stat label="PCR" value="0.79" onClick={() => console.log('PCR clicked')}/>
          <Stat label="Max Pain" value="240" onClick={() => console.log('Max Pain clicked')}/>
          <Stat label="ATM IV" value="20.00" onClick={() => console.log('ATM IV clicked')}/>
          <Stat label="IV Percentile" valueRight value="24.00 - Low" onClick={() => console.log('IV Percentile clicked')}/>
        </div>
      </div>
    </div>
  );
}

function Chip({children, active, onClick}){
  return (
    <div 
      className={`px-3 py-2 rounded-full text-[14px] whitespace-nowrap border cursor-pointer hover:bg-blue-50 transition-colors ${active?"bg-[#E8F0FF] border-[#D7E4FF] text-[#2F6BFF]":"bg-white border-[#E9EDF2] text-[#6F7A88]"}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function ColumnsHeader(){
  return (
    <div className="grid grid-cols-5 text-[12px] text-[#6F7A88] px-3 py-2">
      <div className="text-left">OI (in lakhs)</div>
      <div className="text-left">Call LTP</div>
      <div className="text-center">Strike <span className="inline-block -translate-y-[2px]">^</span></div>
      <div className="text-right">Put LTP</div>
      <div className="text-right">OI (in lakhs)</div>
    </div>
  );
}

function Row(props){
  const pill = (
    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-[#3C3C43] text-white text-[12px]">{props.strikeTag}</span>
  );
  return (
    <div className="grid grid-cols-5 items-center px-3 py-3 text-[14px] hover:bg-gray-50 transition-colors">
      {/* Left OI */}
      <div className="text-left cursor-pointer" onClick={() => props.onStrikeClick && props.onStrikeClick(props.strike, 'call-oi')}>
        <div className="text-[#2B2B2B]">{props.leftOI}</div>
        <div className={`text-[12px] ${props.leftPctRed?"text-[#E25D5D]":"text-[#6F7A88]"}`}>{props.leftPct}</div>
      </div>
      {/* Call LTP */}
      <div className="text-left cursor-pointer hover:bg-blue-100 rounded p-1 transition-colors" onClick={() => props.onStrikeClick && props.onStrikeClick(props.strike, 'call')}>
        <div className="text-[#2B2B2B] font-medium">{props.callLtp}</div>
        <div className={`text-[12px] ${props.callPctGreen?"text-[#2BA24C]":"text-[#6F7A88]"}`}>{props.callPct}</div>
      </div>
      {/* Strike */}
      <div className={`text-center font-semibold cursor-pointer hover:bg-yellow-100 rounded p-1 transition-colors ${props.highlight?"text-[#2B2B2B]":"text-[#2B2B2B]"}`} onClick={() => props.onStrikeClick && props.onStrikeClick(props.strike, 'strike')}>
        {props.strike}
        {props.strikeTag && pill}
      </div>
      {/* Put LTP */}
      <div className="text-right cursor-pointer hover:bg-red-100 rounded p-1 transition-colors" onClick={() => props.onStrikeClick && props.onStrikeClick(props.strike, 'put')}>
        <div className="text-[#2B2B2B] font-medium">{props.putLtp}</div>
        <div className={`text-[12px] ${props.putPctRed?"text-[#E25D5D]": props.putPctGreen?"text-[#2BA24C]":"text-[#6F7A88]"}`}>{props.putPct}</div>
      </div>
      {/* Right OI */}
      <div className="text-right cursor-pointer" onClick={() => props.onStrikeClick && props.onStrikeClick(props.strike, 'put-oi')}>
        <div className="text-[#2B2B2B]">{props.rightOI}</div>
        <div className={`text-[12px] ${props.rightPctRed?"text-[#E25D5D]":"text-[#6F7A88]"}`}>{props.rightPct}</div>
      </div>
    </div>
  );
}

function Separator({red}){
  return (
    <div className="px-3">
      <div className={`h-[2px] rounded-full ${red?"bg-[#DF5A61]":"bg-[#3BAE61]"}`}/>
    </div>
  );
}

function Stat({label, value, valueRight, onClick}){
  return (
    <div className={`cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors ${valueRight?"text-right":"text-left"}`} onClick={onClick}>
      <div className="text-[12px] text-[#6F7A88]">{label}</div>
      <div className="text-[16px] font-semibold text-[#2B2B2B]">{value}</div>
    </div>
  );
}
