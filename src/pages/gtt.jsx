import { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function CreateGTTScreen({ stock, onBack, onClose }) {
  const [side, setSide] = useState("BUY");
  const [ttype, setTtype] = useState("SINGLE");
  const [order, setOrder] = useState("LIMIT");
  const [product, setProduct] = useState("CNC");
  const [qty, setQty] = useState(1);
  const [trigger, setTrigger] = useState(100.64);
  const [price, setPrice] = useState(100.64);

  // slide button
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  const isDragging = useRef(false);

  const resetKnob = () => {
    const knob = knobRef.current;
    if (!knob) return;
    knob.style.transition = "transform 0.25s ease";
    knob.style.transform = `translateX(0px)`;
    setTimeout(() => (knob.style.transition = ""), 250);
  };

  const handleMove = (clientX) => {
    const slider = sliderRef.current;
    const knob = knobRef.current;
    if (!slider || !knob) return;
    const rect = slider.getBoundingClientRect();
    const moveX = Math.min(Math.max(clientX - rect.left - 28, 0), rect.width - 56);
    knob.style.transform = `translateX(${moveX}px)`;
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900">
      

      {/* Header */}
      <div className="px-4 pt-6 pb-3 bg-[#f1f3f5] border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 -ml-1" onClick={onBack}><ChevronLeft className="w-6 h-6 text-slate-700"/></button>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[17px] font-semibold tracking-tight">{stock?.name || 'GOLDBEES'}</div>
              </div>
              <div className="mt-0.5 text-[12px] text-slate-500">
                {stock?.exch || 'NSE'} <span className="text-[#e74c3c]">{stock?.price?.toFixed(2) || '95.85'}</span> &nbsp;&nbsp;{stock?.change?.toFixed(2) || '-0.05'} &nbsp;&nbsp;{stock?.pct?.toFixed(2) || '-0.05'}%
              </div>
            </div>
          </div>
          <div className="px-4 py-3 rounded-md bg-[#e9f1ff] flex items-center justify-center">
            <img src="/images/gtt.png" alt="GTT" className="w-10 h-10" />
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Type */}
        <FormRowRight label="Type">
          <Chip active={side==="BUY"} onClick={()=>setSide("BUY")}>
            Buy
          </Chip>
          <Chip active={side==="SELL"} onClick={()=>setSide("SELL")}>
            Sell
          </Chip>
        </FormRowRight>

        {/* Trigger type */}
        <FormRowRight label="Trigger type">
          <Chip active={ttype==="SINGLE"} onClick={()=>setTtype("SINGLE")}>
            Single
          </Chip>
          <Chip disabled>
            OCO
          </Chip>
        </FormRowRight>
        

        {/* Trigger price */}
        <BlockLabel>Trigger price</BlockLabel>
        <div className="mt-2 w-full rounded-xl border border-slate-200 bg-white flex items-center justify-between px-4 h-12">
          <input value={trigger} onChange={e=>setTrigger(Number(e.target.value))} className="outline-none flex-1 text-[16px] text-slate-700"/>
          <a href="#" className="text-[#3a7af3] text-[13px]">5.00% of LTP</a>
        </div>

        {/* Order/Product */}
        <div className="mt-5 grid grid-cols-2 gap-6">
          <div>
            <BlockLabel>Order</BlockLabel>
            <div className="mt-2 flex gap-3">
              <Chip active={order==="LIMIT"} onClick={()=>setOrder("LIMIT")}>LIMIT</Chip>
            </div>
          </div>
          <div>
            <BlockLabel>Product</BlockLabel>
            <div className="mt-2 flex gap-3">
              <Chip active={product==="CNC"} onClick={()=>setProduct("CNC")}>CNC</Chip>
            </div>
          </div>
        </div>

        {/* Quantity / Price */}
        <div className="mt-5 grid grid-cols-2 gap-6">
          <div>
            <BlockLabel>Quantity</BlockLabel>
            <div className="mt-2 h-12 rounded-xl border border-slate-200 bg-white px-4 flex items-center">
              <input value={qty} onChange={e=>setQty(Number(e.target.value))} className="outline-none text-[16px]"/>
            </div>
          </div>
          <div>
            <BlockLabel>Price</BlockLabel>
            <div className="mt-2 h-12 rounded-xl border border-slate-200 bg-white px-4 flex items-center">
              <input value={price} onChange={e=>setPrice(Number(e.target.value))} className="outline-none text-[16px]"/>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-[13px] text-slate-500">
          I agree to the <a className="text-[#3a7af3]" href="#">terms</a> and accept that trigger executions are not guaranteed. &nbsp;
          <a className="text-[#3a7af3]" href="#">Learn more about GTT.</a>
        </div>
      </div>

      {/* Bottom slide button */}
      <div className="h-24"/>
      <div className="fixed left-0 right-0 bottom-0 bg-white px-4 py-3 border-t border-slate-200">
        <div
          ref={sliderRef}
          className="relative w-[90%] mx-auto h-14 rounded-full bg-[#3a7af3] overflow-hidden flex items-center shadow-lg"
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => { isDragging.current = false; resetKnob(); }}
          onMouseMove={(e)=> isDragging.current && handleMove(e.clientX)}
          onTouchStart={() => (isDragging.current = true)}
          onTouchEnd={() => { isDragging.current = false; resetKnob(); }}
          onTouchMove={(e)=> isDragging.current && handleMove(e.touches[0].clientX)}
        >
          <div ref={knobRef} className="absolute left-0 top-0 w-14 h-14 rounded-full bg-white flex items-center justify-center border-[3px] border-[#3a7af3] shadow-sm transition-transform">
            <span className="text-[#3a7af3] text-lg">›</span>
          </div>
          <div className="w-full flex justify-center items-center">
            <span className="text-white tracking-widest text-sm font-medium">CREATE GTT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormRow({label, children}){
  return (
    <div className="mt-4 grid grid-cols-[110px_1fr] items-center gap-x-6">
      <div className="text-[14px] text-slate-600">{label}</div>
      <div className="flex gap-3">{children}</div>
    </div>
  );
}

function FormRowRight({label, children}){
  return (
    <div className="mt-4 grid grid-cols-[110px_1fr] items-center gap-x-6">
      <div className="text-[14px] text-slate-600">{label}</div>
      <div className="ml-auto flex gap-3 justify-end pr-1">{children}</div>
    </div>
  );
}

function BlockLabel({children}){
  return <div className="text-[14px] text-slate-600 mt-4">{children}</div>;
}

function Chip({children, active=false, onClick, disabled=false}){
  const base = "h-11 px-6 rounded-xl border text-[15px] font-semibold flex items-center justify-center min-w-[88px] transition-colors select-none";
  // Active chip = blue; Inactive = grey, Disabled = hatched
  const styles = disabled
    ? "border-slate-200 text-slate-300 bg-[repeating-linear-gradient(45deg,_#f7f7f7,_#f7f7f7_6px,_#f0f0f0_6px,_#f0f0f0_12px)] cursor-not-allowed"
    : active
      ? "border-[#3a7af3] text-[#3a7af3] bg-white cursor-pointer"
      : "border-slate-200 text-slate-600 bg-white cursor-pointer";
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e)=>{ if(!disabled && (e.key==='Enter'||e.key===' ')) { e.preventDefault(); onClick && onClick(); } }}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}
