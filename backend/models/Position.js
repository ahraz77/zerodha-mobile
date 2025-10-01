const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    trim: true
  },
  segment: {
    type: String,
    required: [true, 'Segment is required'],
    enum: ['NSE', 'BSE', 'CDS', 'MCX', 'NFO'],
    trim: true
  },
  qty: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  avg: {
    type: String,
    required: [true, 'Average price is required']
  },
  product: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['NRML', 'MIS', 'CNC', 'CO', 'BO'],
    trim: true
  },
  pnl: {
    type: String,
    required: [true, 'P&L is required']
  },
  ltp: {
    type: String,
    required: [true, 'Last traded price is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
positionSchema.index({ symbol: 1, segment: 1 });

module.exports = mongoose.model('Position', positionSchema);