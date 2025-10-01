const express = require('express');
const Order = require('../models/Order');
const Position = require('../models/Position');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Function to update positions when order is completed
async function updatePositionFromOrder(order) {
  try {
    console.log(`🔍 Looking for existing position for symbol: ${order.symbol}`);
    // Find existing position for this symbol
    const existingPosition = await Position.findOne({ symbol: order.symbol });
    
    if (existingPosition) {
      console.log(`📊 Found existing position:`, existingPosition);
      // Calculate new quantity and average price
      const currentQty = parseInt(existingPosition.qty);
      const currentPrice = parseFloat(existingPosition.price);
      const orderQty = parseInt(order.qty);
      const orderPrice = parseFloat(order.price);
      
      if (order.type === 'BUY') {
        // For BUY orders, add to quantity and calculate weighted average price
        const newQty = currentQty + orderQty;
        const newAvgPrice = ((currentQty * currentPrice) + (orderQty * orderPrice)) / newQty;
        
        // Update position
        existingPosition.qty = newQty;
        existingPosition.avg = newAvgPrice.toFixed(2);
        existingPosition.ltp = order.ltp || order.price; // Update LTP
        
        // Recalculate P&L based on current LTP
        const currentLtp = parseFloat(existingPosition.ltp);
        const currentValue = newQty * currentLtp;
        const investedValue = newQty * newAvgPrice;
        existingPosition.pnl = (currentValue - investedValue).toFixed(2);
        
        // Calculate percentage only if investedValue > 0
        if (investedValue > 0) {
          existingPosition.pnlPercentage = (((currentValue - investedValue) / investedValue) * 100).toFixed(2);
        } else {
          existingPosition.pnlPercentage = '0.00';
        }
        
        await existingPosition.save();
      } else if (order.type === 'SELL') {
        // For SELL orders, reduce quantity
        const newQty = currentQty - orderQty;
        
        if (newQty <= 0) {
          // If all shares sold, remove position
          await Position.findByIdAndDelete(existingPosition._id);
        } else {
          // Update quantity but keep same average price
          existingPosition.qty = newQty;
          existingPosition.ltp = order.ltp || order.price; // Update LTP
          
          // Recalculate P&L
          const currentLtp = parseFloat(existingPosition.ltp);
          const currentValue = newQty * currentLtp;
          const investedValue = newQty * currentPrice;
          existingPosition.pnl = (currentValue - investedValue).toFixed(2);
          
          if (investedValue > 0) {
            existingPosition.pnlPercentage = (((currentValue - investedValue) / investedValue) * 100).toFixed(2);
          } else {
            existingPosition.pnlPercentage = '0.00';
          }
          
          await existingPosition.save();
          console.log(`✅ Updated existing position for ${order.symbol}`);
        }
      }
    } else if (order.type === 'BUY') {
      console.log(`➕ Creating new position for ${order.symbol}`);
      // Create new position for BUY orders
      const newPosition = new Position({
        symbol: order.symbol,
        segment: 'NSE', // Default segment
        qty: parseInt(order.qty),
        avg: order.price,
        product: order.product || 'CNC',
        ltp: order.ltp || order.price,
        pnl: '0.00',
        pnlPercentage: '0.00'
      });
      
      await newPosition.save();
      console.log(`✅ Created new position for ${order.symbol}`);
    }
  } catch (error) {
    console.error('❌ Error updating position from order:', error);
  }
}

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Public (for testing consolidation)
router.post('/', async (req, res) => {
  try {
    const { type, symbol, qty, status, price, trigger, exchange, product, orderType, time, ltp } = req.body;

    const order = new Order({
      type,
      symbol,
      qty,
      status: status || 'COMPLETE', // Default to COMPLETE for demo
      price,
      trigger,
      exchange,
      product,
      orderType,
      time: time || new Date().toLocaleTimeString('en-US', { hour12: true }),
      ltp: ltp || price
    });

    await order.save();
    console.log('🚀 Order saved:', order);

    // If order is completed, update positions
    if (order.status === 'COMPLETE') {
      console.log('📈 Order is COMPLETE, updating positions...');
      await updatePositionFromOrder(order);
      console.log('✅ Position update completed');
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { type, symbol, qty, status, price, trigger, exchange, product, orderType, time, ltp } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        type,
        symbol,
        qty,
        status,
        price,
        trigger,
        exchange,
        product,
        orderType,
        time,
        ltp
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating order'
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      data: order
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order'
    });
  }
});

// @route   POST /api/orders/seed
// @desc    Seed initial orders data
// @access  Private (Admin only)
router.post('/seed', authenticateToken, async (req, res) => {
  try {
    // Clear existing orders
    await Order.deleteMany({});

    // Initial orders data
    const initialOrders = [
      { type: 'SELL', symbol: 'PNB', qty: 1, status: 'REJECTED', price: '0.00', trigger: '48.50', exchange: 'NSE', product: 'CO', orderType: 'SL-M', time: '13:39:11', ltp: '0.00' },
      { type: 'BUY', symbol: 'INFY', qty: 1, status: 'OPEN', price: '49.50', trigger: '48.50', exchange: 'NSE', product: 'CO', orderType: 'LIMIT', time: '13:39:12', ltp: '0.00' },
      { type: 'BUY', symbol: 'USDINR23MAYFUT', qty: 1, status: 'OPEN', price: '81.0000', trigger: '', exchange: 'CDS', product: 'NRML', orderType: 'LIMIT', time: '13:39:13', ltp: '0.00' },
      { type: 'BUY', symbol: 'USDINR23MAYFUT', qty: 1, status: 'OPEN', price: '0.00', trigger: '', exchange: 'CDS', product: 'MIS', orderType: 'LIMIT', time: '13:39:14', ltp: '0.00' },
      { type: 'BUY', symbol: 'SBIN', qty: 1, status: 'COMPLETE', price: '0.00', trigger: '48.50', exchange: 'NSE', product: 'CNC', orderType: 'MARKET', time: '13:39:15', ltp: '0.00' }
    ];

    const orders = await Order.insertMany(initialOrders);

    res.json({
      success: true,
      message: 'Orders seeded successfully',
      data: orders
    });
  } catch (error) {
    console.error('Seed orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding orders'
    });
  }
});

module.exports = router;