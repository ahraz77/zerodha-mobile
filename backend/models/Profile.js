const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    maxlength: 2,
    uppercase: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    trim: true
  },
  demat: {
    type: String,
    required: true,
    trim: true
  },
  bankAccount: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    }
  },
  segments: {
    type: String,
    required: true,
    trim: true
  },
  dematerialization: {
    type: String,
    enum: ['eDIS', 'Physical', 'TPIN'],
    default: 'eDIS'
  },
  privacyMode: {
    type: Boolean,
    default: false
  },
  supportCode: {
    type: String,
    default: 'View'
  },
  accountClosureWarning: {
    type: String,
    default: 'Account closure is permanent and irreversible. Please read this before proceeding.'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted phone
profileSchema.virtual('formattedPhone').get(function() {
  if (this.phone && !this.phone.startsWith('*')) {
    return '*' + this.phone.slice(-4);
  }
  return this.phone;
});

// Virtual for formatted PAN
profileSchema.virtual('formattedPAN').get(function() {
  if (this.pan && !this.pan.startsWith('*')) {
    return '*' + this.pan.slice(-4);
  }
  return this.pan;
});

// Virtual for formatted bank account
profileSchema.virtual('formattedBankAccount').get(function() {
  if (this.bankAccount?.number && !this.bankAccount.number.startsWith('*')) {
    return '*' + this.bankAccount.number.slice(-4);
  }
  return this.bankAccount?.number;
});

module.exports = mongoose.model('Profile', profileSchema);