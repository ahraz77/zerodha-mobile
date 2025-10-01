const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');
const auth = require('../middleware/auth');

// Get all funds data
router.get('/', auth, async (req, res) => {
  try {
    const funds = await Fund.find();
    res.json({ success: true, data: funds });
  } catch (error) {
    console.error('Get funds error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single fund by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id);
    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }
    res.json({ success: true, data: fund });
  } catch (error) {
    console.error('Get fund error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create new fund
router.post('/', auth, async (req, res) => {
  try {
    const fund = new Fund(req.body);
    const savedFund = await fund.save();
    res.status(201).json({ success: true, data: savedFund });
  } catch (error) {
    console.error('Create fund error:', error);
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Update fund
router.put('/:id', auth, async (req, res) => {
  try {
    const fund = await Fund.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }
    
    res.json({ success: true, data: fund });
  } catch (error) {
    console.error('Update fund error:', error);
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// Delete fund
router.delete('/:id', auth, async (req, res) => {
  try {
    const fund = await Fund.findByIdAndDelete(req.params.id);
    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }
    res.json({ success: true, message: 'Fund deleted successfully' });
  } catch (error) {
    console.error('Delete fund error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Seed initial funds data
router.post('/seed', auth, async (req, res) => {
  try {
    // Check if funds already exist
    const existingFunds = await Fund.find();
    if (existingFunds.length > 0) {
      return res.json({ success: true, message: 'Funds data already exists', data: existingFunds });
    }

    // Create initial fund data
    const initialFund = new Fund({
      availableMargin: '1,00,000.00',
      availableCash: '1,00,000.00',
      usedMargin: '0.00',
      openingBalance: '1,00,000.00',
      payin: '0.00',
      payout: '0.00',
      span: '0.00',
      deliveryMargin: '0.00',
      exposure: '0.00',
      optionPremium: '0.00',
      collateralLiquid: '0.00',
      collateralEquity: '0.00',
      totalCollateral: '0.00'
    });

    const savedFund = await initialFund.save();
    res.status(201).json({ success: true, message: 'Initial funds data created', data: [savedFund] });
  } catch (error) {
    console.error('Seed funds error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;