const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stock name is required'],
    trim: true
  },
  qty: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  avg: {
    type: String,
    required: [true, 'Average price is required']
  },
  invested: {
    type: String,
    required: [true, 'Invested amount is required']
  },
  pct: {
    type: String,
    required: [true, 'Percentage change is required']
  },
  change: {
    type: String,
    required: [true, 'Change amount is required']
  },
  ltp: {
    type: String,
    required: [true, 'Last traded price is required']
  },
  ltpPct: {
    type: String,
    required: [true, 'LTP percentage is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
holdingSchema.index({ name: 1 });

module.exports = mongoose.model('Holding', holdingSchema);