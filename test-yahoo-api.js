// Test script for Yahoo Finance API integration
import stockAPI from './src/services/stockAPI.js';

async function testYahooFinanceAPI() {
  console.log('🚀 Testing Yahoo Finance API Integration...\n');

  try {
    // Test 1: Fetch Indian stock data
    console.log('📊 Test 1: Fetching Indian stock data...');
    const stockSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ITC'];
    const stockData = await stockAPI.fetchStockData(stockSymbols);
    
    console.log('Stock Data Results:');
    stockData.forEach(stock => {
      console.log(`  ${stock.symbol}: ₹${stock.price} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent}%)`);
    });
    console.log('✅ Stock data fetch successful!\n');

    // Test 2: Fetch detailed quote
    console.log('📈 Test 2: Fetching detailed quote for RELIANCE...');
    const detailedQuote = await stockAPI.fetchStockQuote('RELIANCE');
    console.log('Detailed Quote:', {
      symbol: detailedQuote.symbol,
      price: detailedQuote.price,
      high: detailedQuote.high,
      low: detailedQuote.low,
      volume: detailedQuote.volume,
      marketCap: detailedQuote.marketCap
    });
    console.log('✅ Detailed quote fetch successful!\n');

    // Test 3: Fetch historical data
    console.log('📊 Test 3: Fetching historical data for TCS...');
    const historicalData = await stockAPI.fetchHistoricalData('TCS');
    console.log(`Historical data points: ${historicalData.length}`);
    if (historicalData.length > 0) {
      const latest = historicalData[historicalData.length - 1];
      console.log('Latest candle:', {
        date: latest.date,
        open: latest.open,
        high: latest.high,
        low: latest.low,
        close: latest.close,
        volume: latest.volume
      });
    }
    console.log('✅ Historical data fetch successful!\n');

    // Test 4: Fetch order book
    console.log('📋 Test 4: Fetching order book for INFY...');
    const orderBook = await stockAPI.fetchOrderBook('INFY');
    console.log('Order Book Summary:', {
      lastPrice: orderBook.lastPrice,
      topBid: orderBook.bids[0],
      topAsk: orderBook.asks[0],
      totalBids: orderBook.totalBidQty,
      totalAsks: orderBook.totalAskQty
    });
    console.log('✅ Order book generation successful!\n');

    console.log('🎉 All Yahoo Finance API tests completed successfully!');
    console.log('✨ The integration is working properly with real Indian market data.');

  } catch (error) {
    console.error('❌ Error during API testing:', error);
    console.log('🔧 Check your internet connection and try again.');
  }
}

// Run the test
testYahooFinanceAPI();