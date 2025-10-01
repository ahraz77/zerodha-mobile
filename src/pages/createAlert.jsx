import { useState, useRef } from "react";
import { ChevronLeft, Info, ChevronUp } from "lucide-react";

export default function CreateAlertScreen({ stock, onBack, onClose }) {
  const [ato, setAto] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    const slider = sliderRef.current;
    const knob = knobRef.current;
    if (!slider || !knob) return;

    const rect = slider.getBoundingClientRect();
    const moveX = Math.min(Math.max(clientX - rect.left - 28, 0), rect.width - 56);
    knob.style.transform = `translateX(${moveX}px)`;

    if (moveX >= rect.width - 56) {
      setIsConfirmed(true);
      setTimeout(() => {
        knob.style.transition = "transform 0.3s ease";
        knob.style.transform = `translateX(0px)`;
        setTimeout(() => {
          knob.style.transition = "";
        }, 300);
      }, 300);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const resetKnob = () => {
    const knob = knobRef.current;
    if (knob) {
      knob.style.transition = "transform 0.3s ease";
      knob.style.transform = `translateX(0px)`;
      setTimeout(() => {
        knob.style.transition = "";
      }, 300);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-slate-900 select-none">
      {/* Status bar spacer */}
      <div className="h-10" />

      {/* Header */}
      <div className="px-4 py-3 bg-[#f5f6f7] flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button className="p-1 -ml-1" onClick={onBack}>
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-[17px] font-semibold tracking-tight">{stock?.name || 'GOLDBEES'}</h1>
          <span className="text-[#1976d2] text-lg">✎</span>
        </div>
        <Info className="w-5 h-5 text-[#1976d2]" />
      </div>

      {/* Card */}
      <div className="px-4 pt-5">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="px-4 pt-4 pb-3 text-[15px] font-semibold text-slate-800">Create alert</div>

          {/* If - Last price (segmented) */}
          <div className="px-4 pb-3">
            <SegRow label="If" value="Last price" />
            <div className="mt-2 ml-[84px] text-[13px] text-slate-400">Last price ₹95.85</div>
          </div>

          {/* of - GOLDBEES (NSE) */}
          <div className="px-4 pb-3">
            <SegRow label="of" value="GOLDBEES (NSE)" />
          </div>

          {/* is - Greater than ... (narrow segmented) */}
          <div className="px-4 pb-3">
            <IsRow />
          </div>

          {/* than - 95.85 */}
          <div className="px-4 pb-3">
            <SegRow label="than" value={<span className="text-slate-900 font-medium">95.85</span>} />
          </div>

          {/* 0.0 % of Last price */}
          <div className="px-4 pb-5">
            <div className="w-24 h-12 rounded-md border border-slate-300 bg-[#fcfcfc] grid place-items-center text-[15px] font-medium text-slate-800 shadow-inner">0.0</div>
            <div className="mt-1 text-[13px] text-slate-400">% of Last price</div>
          </div>

          {/* Pull handle */}
          <div className="-mb-5 w-full grid place-items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow grid place-items-center">
              <ChevronUp className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ATO toggle */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-800">Alert Triggers Order (ATO)</div>
              <div className="text-[13px] text-slate-500 mt-1">Place orders when the alert is triggered.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" checked={ato} onChange={(e) => setAto(e.target.checked)} />
              <div className="w-12 h-7 bg-slate-200 rounded-full peer peer-checked:bg-[#1976d2] transition-colors shadow-inner" />
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom CTA bar with slide */}
      <div className="h-24" />
      <div className="fixed left-0 right-0 bottom-0 bg-white px-4 py-3 border-t border-slate-200">
        <div
          ref={sliderRef}
          className="relative w-[90%] mx-auto h-14 rounded-full bg-[#2f7df6] overflow-hidden flex items-center shadow-md"
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => {
            isDragging.current = false;
            resetKnob();
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => (isDragging.current = true)}
          onTouchEnd={() => {
            isDragging.current = false;
            resetKnob();
          }}
          onTouchMove={handleTouchMove}
        >
          <div
            ref={knobRef}
            className="absolute left-0 top-0 w-14 h-14 rounded-full bg-white flex items-center justify-center border-[3px] border-[#2f7df6] shadow-sm transition-transform"
          >
            <span className="text-[#2f7df6] text-lg">›</span>
          </div>
          <div className="w-full flex justify-center items-center">
            <span className="text-white tracking-widest text-sm font-medium">{isConfirmed ? "CONFIRMED" : "CREATE"}</span>
          </div>
        </div>
        <div className="mt-2 mx-auto w-28 h-[4px] bg-black/80 rounded-full" />
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <div className="w-20 h-12 rounded-l-xl bg-[#f1f3f5] text-slate-700 grid place-items-center text-[15px] font-semibold border-r border-slate-200">
      {children}
    </div>
  );
}

function InputBox({ children, className = "" }) {
  return (
    <div className={`h-12 rounded-r-xl bg-white flex items-center text-[15px] text-slate-700 px-4 ${className}`}>
      {children}
    </div>
  );
}

function SegRow({ label, value }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="flex items-center">
        <Pill>{label}</Pill>
        <InputBox className="flex-1">{value}</InputBox>
      </div>
    </div>
  );
}

function PillSmall({ children }) {
  return (
    <div className="w-16 h-12 rounded-l-xl bg-[#f1f3f5] text-slate-700 grid place-items-center text-[15px] font-semibold border-r border-slate-200">
      {children}
    </div>
  );
}

function InputBoxSmall({ children, className = "" }) {
  return (
    <div className={`h-12 rounded-r-xl bg-white flex items-center text-[15px] text-slate-700 px-4 ${className}`}>
      {children}
    </div>
  );
}

function SegRowNarrow({ label, value }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-start">
        <PillSmall>{label}</PillSmall>
        <InputBoxSmall className="flex-1">{value}</InputBoxSmall>
      </div>
    </div>
  );
}


function IsRow() {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <Pill>is</Pill>
        <div className="w-[78%]">
          <div className="h-12 rounded-xl border border-slate-200 bg-white shadow-sm px-4 grid place-items-center text-[15px] text-slate-600">
            Greater than or equal to (&gt;=)
          </div>
        </div>
      </div>
    </div>
  );
}

