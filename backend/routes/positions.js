const express = require('express');
const Position = require('../models/Position');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/positions/consolidate
// @desc    Consolidate duplicate positions for same symbols
// @access  Public
router.post('/consolidate', async (req, res) => {
  try {
    console.log('Starting position consolidation...');
    
    // Get all positions grouped by symbol
    const positions = await Position.find().sort({ symbol: 1 });
    
    // Group positions by symbol
    const groupedPositions = {};
    positions.forEach(position => {
      if (!groupedPositions[position.symbol]) {
        groupedPositions[position.symbol] = [];
      }
      groupedPositions[position.symbol].push(position);
    });
    
    const consolidationResults = [];
    
    // Consolidate positions for each symbol
    for (const [symbol, symbolPositions] of Object.entries(groupedPositions)) {
      if (symbolPositions.length > 1) {
        console.log(`Consolidating ${symbolPositions.length} positions for ${symbol}`);
        
        // Calculate consolidated values
        let totalQty = 0;
        let totalInvestment = 0;
        let latestLtp = symbolPositions[0].ltp;
        
        symbolPositions.forEach(pos => {
          const qty = parseInt(pos.qty);
          const avgPrice = parseFloat(pos.avg || pos.price);
          
          totalQty += qty;
          totalInvestment += (qty * avgPrice);
          
          // Use the latest LTP
          if (pos.ltp) {
            latestLtp = pos.ltp;
          }
        });
        
        const consolidatedAvgPrice = totalInvestment / totalQty;
        
        // Keep the first position and update it
        const mainPosition = symbolPositions[0];
        mainPosition.qty = totalQty.toString();
        mainPosition.avg = consolidatedAvgPrice.toFixed(2);
        mainPosition.price = consolidatedAvgPrice.toFixed(2);
        mainPosition.ltp = latestLtp;
        
        // Recalculate P&L
        const currentValue = totalQty * parseFloat(latestLtp);
        const investedValue = totalQty * consolidatedAvgPrice;
        mainPosition.pnl = (currentValue - investedValue).toFixed(2);
        mainPosition.pnlPercentage = (((currentValue - investedValue) / investedValue) * 100).toFixed(2);
        
        await mainPosition.save();
        
        // Delete the other positions
        const deletedIds = [];
        for (let i = 1; i < symbolPositions.length; i++) {
          deletedIds.push(symbolPositions[i]._id);
          await Position.findByIdAndDelete(symbolPositions[i]._id);
        }
        
        consolidationResults.push({
          symbol,
          originalPositions: symbolPositions.length,
          consolidatedQty: totalQty,
          consolidatedAvgPrice: consolidatedAvgPrice.toFixed(2),
          deletedPositions: deletedIds.length
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Position consolidation completed',
      data: {
        consolidatedSymbols: consolidationResults.length,
        results: consolidationResults
      }
    });
    
  } catch (error) {
    console.error('Consolidation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during consolidation'
    });
  }
});

// @route   GET /api/positions
// @desc    Get all positions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Positions retrieved successfully',
      data: positions
    });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching positions'
    });
  }
});

// @route   GET /api/positions/:id
// @desc    Get single position
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Position retrieved successfully',
      data: position
    });
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching position'
    });
  }
});

// @route   POST /api/positions
// @desc    Create new position
// @access  Private (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { symbol, segment, qty, avg, product, pnl, ltp } = req.body;

    const position = new Position({
      symbol,
      segment,
      qty,
      avg,
      product,
      pnl,
      ltp
    });

    await position.save();

    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position
    });
  } catch (error) {
    console.error('Create position error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating position'
    });
  }
});

// @route   PUT /api/positions/:id
// @desc    Update position
// @access  Private (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { symbol, segment, qty, avg, product, pnl, ltp } = req.body;

    const position = await Position.findByIdAndUpdate(
      req.params.id,
      {
        symbol,
        segment,
        qty,
        avg,
        product,
        pnl,
        ltp
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    res.json({
      success: true,
      message: 'Position updated successfully',
      data: position
    });
  } catch (error) {
    console.error('Update position error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating position'
    });
  }
});

// @route   DELETE /api/positions/:id
// @desc    Delete position
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log(`🗑️ DELETE request for position ID: ${req.params.id}`);
    console.log(`🔐 Admin from token:`, req.admin);
    
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      console.log(`❌ Position not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    console.log(`✅ Position deleted successfully: ${position.symbol}`);
    res.json({
      success: true,
      message: 'Position deleted successfully',
      data: position
    });
  } catch (error) {
    console.error('Delete position error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting position'
    });
  }
});

// @route   POST /api/positions/seed
// @desc    Seed initial positions data
// @access  Private (Admin only)
router.post('/seed', authenticateToken, async (req, res) => {
  try {
    // Clear existing positions
    await Position.deleteMany({});

    // Initial positions data
    const initialPositions = [
      { symbol: 'USDINR23JUNFUT', segment: 'CDS', qty: -1, avg: '82.0375', product: 'NRML', pnl: '-200.0000', ltp: '0.00' },
      { symbol: 'USDINR23MAYFUT', segment: 'CDS', qty: 1, avg: '82.1625', product: 'NRML', pnl: '-42.5000', ltp: '0.00' },
      { symbol: 'GOLDPETAL23MAYFUT', segment: 'MCX', qty: 1, avg: '6,134.00', product: 'NRML', pnl: '+4.00', ltp: '0.00' },
      { symbol: 'NIFTY2351118700CE', segment: 'NFO', qty: -50, avg: '1.65', product: 'NRML', pnl: '-50.00', ltp: '0.00' },
      { symbol: 'NIFTY2351118750CE', segment: 'NFO', qty: 50, avg: '1.45', product: 'NRML', pnl: '-12.50', ltp: '0.00' }
    ];

    const positions = await Position.insertMany(initialPositions);

    res.json({
      success: true,
      message: 'Positions seeded successfully',
      data: positions
    });
  } catch (error) {
    console.error('Seed positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding positions'
    });
  }
});

module.exports = router;