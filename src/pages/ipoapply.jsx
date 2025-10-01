import React, { useState } from 'react';
import feather from 'feather-icons';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function IPOApply({ onBack, ipoData }) {
  const [quantity, setQuantity] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [category, setCategory] = useState('individual');

  // Default IPO data if not passed
  const defaultIPO = {
    company: 'Nexus Select Trust',
    symbol: 'NXST',
    price: '₹95 - ₹100',
    dates: '9th - 11th May',
    minQty: 150,
    lotSize: 150
  };

  const ipo = ipoData || defaultIPO;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle IPO application submission
    alert('IPO Application Submitted!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-[calc(64px+env(safe-area-inset-bottom))] select-none">
      {/* Header */}
      <header className="px-4 pt-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Icon name="arrow-left" className="w-6 h-6 text-[#374151]" />
          </button>
          <h1 className="text-xl text-[#0f172a]">Apply IPO</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* IPO Details */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="text-lg text-[#0f172a] mb-1">{ipo.symbol}</div>
        <div className="text-sm text-[#6b7280] mb-2">{ipo.company}</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6b7280]">Price Band</span>
          <span className="text-[#0f172a]">{ipo.price}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[#6b7280]">Lot Size</span>
          <span className="text-[#0f172a]">{ipo.lotSize} shares</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[#6b7280]">Application Dates</span>
          <span className="text-[#0f172a]">{ipo.dates}</span>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm text-[#374151] mb-3">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {['individual', 'hni'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  category === cat
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                {cat === 'individual' ? 'Individual' : 'HNI (₹2L+)'}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-sm text-[#374151] mb-2">
            Quantity <span className="text-gray-500">(Min: {ipo.minQty})</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`${ipo.minQty}`}
            min={ipo.minQty}
            step={ipo.lotSize}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            Quantity should be in multiples of {ipo.lotSize}
          </div>
        </div>

        {/* Bid Price */}
        <div className="mb-6">
          <label className="block text-sm text-[#374151] mb-2">
            Bid Price <span className="text-gray-500">(₹95 - ₹100)</span>
          </label>
          <input
            type="number"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            placeholder="100"
            min="95"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* UPI ID */}
        <div className="mb-6">
          <label className="block text-sm text-[#374151] mb-2">UPI ID</label>
          <input
            type="text"
            placeholder="yourname@upi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Amount Calculation */}
        {quantity && bidPrice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Total Amount</span>
              <span className="text-lg text-blue-900">
                ₹{(parseInt(quantity) * parseFloat(bidPrice)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="mb-6">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" required />
            <span className="text-sm text-gray-600">
              I agree to the terms and conditions and authorize the debit from my UPI account
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Apply for IPO
        </button>
      </form>
    </div>
  );
}
