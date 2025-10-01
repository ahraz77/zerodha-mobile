const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Order type is required'],
    enum: ['BUY', 'SELL'],
    trim: true
  },
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    trim: true
  },
  qty: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['OPEN', 'COMPLETE', 'REJECTED', 'CANCELLED'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  trigger: {
    type: String,
    default: ''
  },
  exchange: {
    type: String,
    required: [true, 'Exchange is required'],
    enum: ['NSE', 'BSE', 'CDS', 'MCX', 'NFO'],
    trim: true
  },
  product: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['NRML', 'MIS', 'CNC', 'CO', 'BO'],
    trim: true
  },
  orderType: {
    type: String,
    required: [true, 'Order type is required'],
    enum: ['MARKET', 'LIMIT', 'SL-M', 'SL'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Time is required']
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
orderSchema.index({ symbol: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);