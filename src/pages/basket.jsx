import React from "react";
import { ChevronLeft, ShoppingCart, Edit3, Search } from "lucide-react";

// Mobile-only mock of the "Basket" screen
// TailwindCSS required. This component renders at 375px width to match common mobile viewports.

export default function BasketMobile({ setActive }) {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center">
      {/* Mobile frame */}
      <div className="w-[375px] min-h-screen bg-white">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setActive && setActive('watchlist')} className="p-1 -ml-1 active:opacity-70" aria-label="Back">
              <ChevronLeft className="w-6 h-6 text-[#2B2B2B]" strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F3F5F7] flex items-center justify-center">
                <ShoppingCart className="w-[18px] h-[18px] text-[#6B7A90]" />
              </div>
              <h1 className="text-[22px] leading-7 tracking-tight text-[#2B2B2B] font-medium">Basket</h1>
            </div>

            <button className="flex items-center gap-1 text-[#718198] text-[16px] leading-none active:opacity-70">
              <Edit3 className="w-[18px] h-[18px]" />
              Edit
            </button>
          </div>

          <div className="mt-3 text-[14px] text-[#6F7A88]">0 / 20 items</div>
        </div>

        {/* Search bar */}
        <div className="px-4">
          <div className="w-full h-11 rounded-2xl bg-[#F3F5F7] flex items-center px-3">
            <Search className="w-[18px] h-[18px] text-[#6F7A88]" />
            <span className="ml-2 text-[15px] text-[#A0A9B5]">Search</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center text-center mt-16 px-6">
          {/* Illustration (approximate to match screenshot) */}
          <div className="relative w-[320px] h-[160px]">
            {/* Top dashed box */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[240px] h-[58px] rounded-xl border-2 border-dashed border-[#C9CFD8]" />
            {/* Blue shape */}
            <div className="absolute right-[76px] top-[26px] w-6 h-6 bg-[#2E6CF6] rounded-bl-[14px] rounded-tr-[14px] rotate-12" />

            {/* Middle bar */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[280px] h-[56px] rounded-xl bg-[#E9EDF2] shadow-sm flex items-center px-6">
              <div className="w-[120px] h-[10px] rounded-md bg-[#AEB7C3]" />
              <div className="ml-auto w-5 h-5 bg-[#F3C400] rounded-full" />
            </div>

            {/* Bottom dashed box */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[116px] w-[240px] h-[58px] rounded-xl border-2 border-dashed border-[#C9CFD8]" />
            {/* Red triangle */}
            <div className="absolute left-[64px] top-[140px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[12px] border-t-[#FF5A52] border-r-[10px] border-r-transparent rotate-[-10deg]" />
          </div>

          <h2 className="mt-10 text-[28px] leading-8 font-semibold text-[#2B2B2B]">No items in basket</h2>
          <p className="mt-3 text-[16px] leading-6 text-[#8B94A3] max-w-[320px]">
            Use the search bar to add orders to your
            <br />
            basket
          </p>
        </div>
      </div>
    </div>
  );
}
