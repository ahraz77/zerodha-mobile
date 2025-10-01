const mongoose = require('mongoose');

// Define Position schema directly in this script
const positionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  segment: { type: String, default: 'NSE' },
  qty: { type: String, required: true },
  avg: { type: String, required: true },
  price: { type: String },
  product: { type: String, default: 'CNC' },
  pnl: { type: String, default: '0.00' },
  pnlPercentage: { type: String, default: '0.00' },
  ltp: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Position = mongoose.model('Position', positionSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zerodha-mobile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function consolidatePositions() {
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
    
    // Consolidate positions for each symbol
    for (const [symbol, symbolPositions] of Object.entries(groupedPositions)) {
      if (symbolPositions.length > 1) {
        console.log(`\nConsolidating ${symbolPositions.length} positions for ${symbol}:`);
        
        // Calculate consolidated values
        let totalQty = 0;
        let totalInvestment = 0;
        let latestLtp = symbolPositions[0].ltp;
        
        symbolPositions.forEach(pos => {
          const qty = parseInt(pos.qty);
          const avgPrice = parseFloat(pos.avg || pos.price);
          
          console.log(`  - Qty: ${qty}, Avg: ${avgPrice}`);
          
          totalQty += qty;
          totalInvestment += (qty * avgPrice);
          
          // Use the latest LTP
          if (pos.ltp) {
            latestLtp = pos.ltp;
          }
        });
        
        const consolidatedAvgPrice = totalInvestment / totalQty;
        
        console.log(`  Consolidated: Qty: ${totalQty}, Avg: ${consolidatedAvgPrice.toFixed(2)}`);
        
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
        for (let i = 1; i < symbolPositions.length; i++) {
          await Position.findByIdAndDelete(symbolPositions[i]._id);
          console.log(`  Deleted duplicate position: ${symbolPositions[i]._id}`);
        }
        
        console.log(`  Updated main position: ${mainPosition._id}`);
      }
    }
    
    console.log('\nPosition consolidation completed!');
    
    // Show final positions
    const finalPositions = await Position.find().sort({ symbol: 1 });
    console.log('\nFinal positions:');
    finalPositions.forEach(pos => {
      console.log(`${pos.symbol}: Qty=${pos.qty}, Avg=${pos.avg}, P&L=${pos.pnl}`);
    });
    
  } catch (error) {
    console.error('Error consolidating positions:', error);
  } finally {
    mongoose.connection.close();
  }
}

consolidatePositions();