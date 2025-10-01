const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  availableMargin: {
    type: String,
    required: [true, 'Available margin is required'],
    default: '1,00,000.00'
  },
  availableCash: {
    type: String,
    required: [true, 'Available cash is required'],
    default: '1,00,000.00'
  },
  usedMargin: {
    type: String,
    required: [true, 'Used margin is required'],
    default: '0.00'
  },
  openingBalance: {
    type: String,
    required: [true, 'Opening balance is required'],
    default: '1,00,000.00'
  },
  payin: {
    type: String,
    default: '0.00'
  },
  payout: {
    type: String,
    default: '0.00'
  },
  span: {
    type: String,
    default: '0.00'
  },
  deliveryMargin: {
    type: String,
    default: '0.00'
  },
  exposure: {
    type: String,
    default: '0.00'
  },
  optionPremium: {
    type: String,
    default: '0.00'
  },
  collateralLiquid: {
    type: String,
    default: '0.00'
  },
  collateralEquity: {
    type: String,
    default: '0.00'
  },
  totalCollateral: {
    type: String,
    default: '0.00'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Fund', fundSchema);