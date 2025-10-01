const express = require('express');
const Holding = require('../models/Holding');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/holdings
// @desc    Get all holdings
// @access  Public (for app users) / Private (for admin operations)
router.get('/', async (req, res) => {
  try {
    const holdings = await Holding.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Holdings retrieved successfully',
      data: holdings
    });
  } catch (error) {
    console.error('Get holdings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching holdings'
    });
  }
});

// @route   GET /api/holdings/:id
// @desc    Get single holding
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const holding = await Holding.findById(req.params.id);
    
    if (!holding) {
      return res.status(404).json({
        success: false,
        message: 'Holding not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Holding retrieved successfully',
      data: holding
    });
  } catch (error) {
    console.error('Get holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching holding'
    });
  }
});

// @route   POST /api/holdings
// @desc    Create new holding
// @access  Private (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, qty, avg, invested, pct, change, ltp, ltpPct } = req.body;

    const holding = new Holding({
      name,
      qty,
      avg,
      invested,
      pct,
      change,
      ltp,
      ltpPct
    });

    await holding.save();

    res.status(201).json({
      success: true,
      message: 'Holding created successfully',
      data: holding
    });
  } catch (error) {
    console.error('Create holding error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating holding'
    });
  }
});

// @route   PUT /api/holdings/:id
// @desc    Update holding
// @access  Private (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, qty, avg, invested, pct, change, ltp, ltpPct } = req.body;

    const holding = await Holding.findByIdAndUpdate(
      req.params.id,
      {
        name,
        qty,
        avg,
        invested,
        pct,
        change,
        ltp,
        ltpPct
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: 'Holding not found'
      });
    }

    res.json({
      success: true,
      message: 'Holding updated successfully',
      data: holding
    });
  } catch (error) {
    console.error('Update holding error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating holding'
    });
  }
});

// @route   DELETE /api/holdings/:id
// @desc    Delete holding
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const holding = await Holding.findByIdAndDelete(req.params.id);

    if (!holding) {
      return res.status(404).json({
        success: false,
        message: 'Holding not found'
      });
    }

    res.json({
      success: true,
      message: 'Holding deleted successfully',
      data: holding
    });
  } catch (error) {
    console.error('Delete holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting holding'
    });
  }
});

// @route   POST /api/holdings/seed
// @desc    Seed initial holdings data
// @access  Private (Admin only)
router.post('/seed', authenticateToken, async (req, res) => {
  try {
    // Clear existing holdings
    await Holding.deleteMany({});

    // Initial holdings data
    const initialHoldings = [
      { name: 'ALEMBICLTD', qty: 2, avg: '66.65', invested: '133.30', pct: '+5.03%', change: '+6.70', ltp: '70.00', ltpPct: '-0.57%' },
      { name: 'BHEL', qty: 43, avg: '64.92', invested: '2,791.85', pct: '+26.76%', change: '+747.05', ltp: '82.30', ltpPct: '0.91%' },
      { name: 'GAIL', qty: 16, avg: '98.17', invested: '1,570.75', pct: '+12.05%', change: '+189.25', ltp: '110.00', ltpPct: '-1.52%' },
      { name: 'IDEA', qty: 11, avg: '6.98', invested: '76.80', pct: '+1.26%', change: '+0.97', ltp: '7.07', ltpPct: '-3.81%' }
    ];

    const holdings = await Holding.insertMany(initialHoldings);

    res.json({
      success: true,
      message: 'Holdings seeded successfully',
      data: holdings
    });
  } catch (error) {
    console.error('Seed holdings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding holdings'
    });
  }
});

module.exports = router;