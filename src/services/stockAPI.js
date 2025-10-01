// Real Stock API Service using Yahoo Finance
class StockAPIService {
  constructor() {
    // Yahoo Finance API endpoints (unofficial but free)
    this.yahooBaseURL = 'https://query1.finance.yahoo.com/v8/finance/chart/'
    this.yahooQuoteURL = 'https://query1.finance.yahoo.com/v7/finance/quote'
    this.corsProxy = 'https://api.allorigins.win/raw?url=' // CORS proxy
    
        
    // Indian stock symbols mapping - comprehensive list
    this.indianStocks = {
      // Market Indices
      'SENSEX': { symbol: '^BSESN', name: 'BSE SENSEX' },
      'NIFTY 50': { symbol: '^NSEI', name: 'NIFTY 50' },
      'NIFTY BANK': { symbol: '^CNXBANK', name: 'NIFTY BANK' },
      'BSE_SMALLCAP': { symbol: '^BSESMLCAP', name: 'BSE SmallCap' },
      'BSE_MIDCAP': { symbol: '^BSEMIDCAP', name: 'BSE MidCap' },
      
      // Banking & Financial Services (Top 10)
      'HDFCBANK': { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited' },
      'ICICIBANK': { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited' },
      'SBIN': { symbol: 'SBIN.NS', name: 'State Bank of India' },
      'AXISBANK': { symbol: 'AXISBANK.NS', name: 'Axis Bank Limited' },
      'KOTAKBANK': { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank' },
      'BAJFINANCE': { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Limited' },
      'BAJAJFINSV': { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv Limited' },
      'HDFCLIFE': { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance' },
      'SBILIFE': { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance' },
      
      // Information Technology (Top 7)
      'TCS': { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
      'INFY': { symbol: 'INFY.NS', name: 'Infosys Limited' },
      'HCLTECH': { symbol: 'HCLTECH.NS', name: 'HCL Technologies' },
      'WIPRO': { symbol: 'WIPRO.NS', name: 'Wipro Limited' },
      'TECHM': { symbol: 'TECHM.NS', name: 'Tech Mahindra Limited' },
      'LTI': { symbol: 'LTI.NS', name: 'LTI Mindtree Limited' },
      'MPHASIS': { symbol: 'MPHASIS.NS', name: 'Mphasis Limited' },
      
      // Oil & Gas (Top 5)
      'RELIANCE': { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
      'ONGC': { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corporation' },
      'IOC': { symbol: 'IOC.NS', name: 'Indian Oil Corporation' },
      'BPCL': { symbol: 'BPCL.NS', name: 'Bharat Petroleum Corporation' },
      'HINDPETRO': { symbol: 'HINDPETRO.NS', name: 'Hindustan Petroleum Corporation' },
      
      // FMCG (Top 7)
      'HINDUNILVR': { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever' },
      'NESTLEIND': { symbol: 'NESTLEIND.NS', name: 'Nestle India Limited' },
      'ITC': { symbol: 'ITC.NS', name: 'ITC Limited' },
      'BRITANNIA': { symbol: 'BRITANNIA.NS', name: 'Britannia Industries' },
      'DABUR': { symbol: 'DABUR.NS', name: 'Dabur India Limited' },
      'MARICO': { symbol: 'MARICO.NS', name: 'Marico Limited' },
      'GODREJCP': { symbol: 'GODREJCP.NS', name: 'Godrej Consumer Products' },
      
      // Automobiles (Top 7)
      'MARUTI': { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India' },
      'TATAMOTORS': { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Limited' },
      'MAHINDRA': { symbol: 'MAHINDRA.NS', name: 'Mahindra & Mahindra' },
      'BAJAJAUTO': { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto Limited' },
      'HEROMOTOCO': { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp Limited' },
      'EICHERMOT': { symbol: 'EICHERMOT.NS', name: 'Eicher Motors Limited' },
      'TVSMOTOR': { symbol: 'TVSMOTOR.NS', name: 'TVS Motor Company' },
      
      // Pharmaceuticals (Top 7)
      'SUNPHARMA': { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries' },
      'DRREDDY': { symbol: 'DRREDDY.NS', name: 'Dr. Reddys Laboratories' },
      'CIPLA': { symbol: 'CIPLA.NS', name: 'Cipla Limited' },
      'DIVISLAB': { symbol: 'DIVISLAB.NS', name: 'Divis Laboratories' },
      'BIOCON': { symbol: 'BIOCON.NS', name: 'Biocon Limited' },
      'AUROPHARMA': { symbol: 'AUROPHARMA.NS', name: 'Aurobindo Pharma' },
      'LUPIN': { symbol: 'LUPIN.NS', name: 'Lupin Limited' },
      
      // Telecommunications (Top 3)
      'BHARTIARTL': { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited' },
      'JIO': { symbol: 'JIO.NS', name: 'Reliance Jio Infocomm' },
      'IDEA': { symbol: 'IDEA.NS', name: 'Vodafone Idea Limited' },
      
      // Metals & Mining (Top 6)
      'TATASTEEL': { symbol: 'TATASTEEL.NS', name: 'Tata Steel Limited' },
      'JSWSTEEL': { symbol: 'JSWSTEEL.NS', name: 'JSW Steel Limited' },
      'HINDALCO': { symbol: 'HINDALCO.NS', name: 'Hindalco Industries' },
      'SAIL': { symbol: 'SAIL.NS', name: 'Steel Authority of India' },
      'COALINDIA': { symbol: 'COALINDIA.NS', name: 'Coal India Limited' },
      'VEDL': { symbol: 'VEDL.NS', name: 'Vedanta Limited' },
      
      // Cement (Top 4)
      'ULTRACEMCO': { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement' },
      'SHREECEM': { symbol: 'SHREECEM.NS', name: 'Shree Cement Limited' },
      'ACC': { symbol: 'ACC.NS', name: 'ACC Limited' },
      'AMBUJACEMENT': { symbol: 'AMBUJACEMENT.NS', name: 'Ambuja Cements' },
      
      // Paints & Chemicals (Top 3)
      'ASIANPAINTS': { symbol: 'ASIANPAINTS.NS', name: 'Asian Paints Limited' },
      'BERGER': { symbol: 'BERGER.NS', name: 'Berger Paints India' },
      'PIDILITIND': { symbol: 'PIDILITIND.NS', name: 'Pidilite Industries' },
      
      // Power & Energy (Top 4)
      'NTPC': { symbol: 'NTPC.NS', name: 'NTPC Limited' },
      'POWERGRID': { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation' },
      'TATAPOWER': { symbol: 'TATAPOWER.NS', name: 'Tata Power Company' },
      'ADANIPOWER': { symbol: 'ADANIPOWER.NS', name: 'Adani Power Limited' },
      
      // Retail & Consumer (Top 3)
      'DMART': { symbol: 'DMART.NS', name: 'Avenue Supermarts' },
      'TRENT': { symbol: 'TRENT.NS', name: 'Trent Limited' },
      'SHOPERSTOP': { symbol: 'SHOPERSTOP.NS', name: 'Shoppers Stop' },
      
      // Airlines (Top 2)
      'INDIGO': { symbol: 'INDIGO.NS', name: 'InterGlobe Aviation' },
      'SPICEJET': { symbol: 'SPICEJET.NS', name: 'SpiceJet Limited' }
    };
  }

  // Fetch real stock data from backend API
  async fetchRealStockData(symbols) {
    try {
      const yahooSymbols = symbols.map(symbol => {
        const stockInfo = this.indianStocks[symbol];
        return stockInfo ? stockInfo.symbol : symbol;
      });

      const symbolsString = yahooSymbols.join(',');
      const url = `http://localhost:5001/api/stocks/quote/${symbolsString}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Backend returns data in quoteResponse.result format
      if (!result.quoteResponse || !result.quoteResponse.result) {
        throw new Error('Invalid response from backend API');
      }

      return result.quoteResponse.result.map((quote, index) => {
        const originalSymbol = symbols[index];
        return {
          symbol: originalSymbol,
          price: parseFloat((quote.regularMarketPrice || 0).toFixed(2)),
          change: parseFloat((quote.regularMarketChange || 0).toFixed(2)),
          changePercent: parseFloat((quote.regularMarketChangePercent || 0).toFixed(2)),
          high: parseFloat((quote.regularMarketPrice || 0).toFixed(2)), // Backend doesn't provide high/low separately
          low: parseFloat((quote.regularMarketPrice || 0).toFixed(2)),  
          open: parseFloat((quote.regularMarketPrice || 0).toFixed(2)),
          previousClose: parseFloat((quote.regularMarketPreviousClose || 0).toFixed(2)),
          volume: quote.volume || 0,
          marketCap: quote.marketCap || 0,
          marketState: quote.marketState || 'UNKNOWN',
          marketStatus: quote.marketStatus || 'Unknown',
          lastUpdated: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching real stock data:', error);
      // Fallback to mock data if API fails
      return this.generateFallbackData(symbols);
    }
  }

  // Generate fallback data if API fails - USES STATIC PRICES (respects market timing from backend)
  generateFallbackData(symbols) {
    const baseData = {
      'SENSEX': { basePrice: 82240, change: 1245.50, changePercent: 1.54 },
      'NIFTY 50': { basePrice: 25122, change: 367.80, changePercent: 1.49 },
      'NIFTY BANK': { basePrice: 52875, change: 485.20, changePercent: 0.93 },
      'RELIANCE': { basePrice: 2956, change: 45.75, changePercent: 1.57 },
      'TCS': { basePrice: 4156, change: 62.30, changePercent: 1.52 },
      'HDFC': { basePrice: 1698, change: 25.40, changePercent: 1.52 },
      'INFY': { basePrice: 1892, change: 28.70, changePercent: 1.54 },
      'ICICIBANK': { basePrice: 1289, change: -15.60, changePercent: -1.20 },
      'HINDUNILVR': { basePrice: 2456, change: 38.90, changePercent: 1.61 },
      'SBIN': { basePrice: 845, change: 12.80, changePercent: 1.54 },
      'BHARTIARTL': { basePrice: 1678, change: 26.70, changePercent: 1.62 },
      'ASIANPAINT': { basePrice: 2789, change: 41.20, changePercent: 1.50 },
      'MARUTI': { basePrice: 11234, change: 165.80, changePercent: 1.50 },
      'TATAMOTORS': { basePrice: 789, change: 11.45, changePercent: 1.47 },
      'BAJFINANCE': { basePrice: 6890, change: 95.60, changePercent: 1.41 },
      'HCLTECH': { basePrice: 1567, change: 23.80, changePercent: 1.54 }
    };

    return symbols.map(symbol => {
      const stock = baseData[symbol] || { basePrice: 300, change: 5.50, changePercent: 1.87 };
      
      // NO MORE RANDOM FLUCTUATIONS - use static fallback prices
      // Backend handles market timing, frontend respects it
      return {
        symbol: symbol,
        price: parseFloat(stock.basePrice.toFixed(2)),
        change: parseFloat(stock.change.toFixed(2)),
        changePercent: parseFloat(stock.changePercent.toFixed(2)),
        high: parseFloat((stock.basePrice * 1.015).toFixed(2)),
        low: parseFloat((stock.basePrice * 0.985).toFixed(2)),
        open: parseFloat((stock.basePrice * 0.995).toFixed(2)),
        previousClose: parseFloat((stock.basePrice - stock.change).toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        lastUpdated: new Date().toISOString()
      };
    });
  }



  // Main method to fetch stock data (tries real API first, then fallback)
  async fetchStockData(symbols) {
    try {
      console.log('Fetching real stock data for:', symbols);
      return await this.fetchRealStockData(symbols);
    } catch (error) {
      console.error('Error fetching real stock data, using fallback:', error);
      return this.generateFallbackData(symbols);
    }
  }

  // Fetch single stock quote (tries real API first, then fallback)
  async fetchStockQuote(symbol) {
    try {
      console.log('Fetching real stock quote for:', symbol);
      const data = await this.fetchRealStockData([symbol]);
      const stockData = data[0];
      
      // Add additional details for the modal
      return {
        ...stockData,
        marketCap: '₹' + (Math.random() * 500000 + 50000).toFixed(0) + ' Cr',
        pe: (Math.random() * 30 + 10).toFixed(2),
        dayRange: `${stockData.low} - ${stockData.high}`,
        yearRange: `${(stockData.price * 0.7).toFixed(2)} - ${(stockData.price * 1.4).toFixed(2)}`,
        dividend: (Math.random() * 5).toFixed(2) + '%',
        bidPrice: (stockData.price - 0.5).toFixed(2),
        askPrice: (stockData.price + 0.5).toFixed(2),
        bidQty: Math.floor(Math.random() * 1000) + 100,
        askQty: Math.floor(Math.random() * 1000) + 100
      };
    } catch (error) {
      console.error('Error fetching real stock quote, using fallback:', error);
      const fallbackData = this.generateFallbackData([symbol]);
      const stockData = fallbackData[0];
      
      return {
        ...stockData,
        marketCap: '₹' + (Math.random() * 500000 + 50000).toFixed(0) + ' Cr',
        pe: (Math.random() * 30 + 10).toFixed(2),
        dayRange: `${stockData.low} - ${stockData.high}`,
        yearRange: `${(stockData.price * 0.7).toFixed(2)} - ${(stockData.price * 1.4).toFixed(2)}`,
        dividend: (Math.random() * 5).toFixed(2) + '%',
        bidPrice: (stockData.price - 0.5).toFixed(2),
        askPrice: (stockData.price + 0.5).toFixed(2),
        bidQty: Math.floor(Math.random() * 1000) + 100,
        askQty: Math.floor(Math.random() * 1000) + 100
      };
    }
  }

  // Get orderbook data
  async fetchOrderBook(symbol) {
    const fallbackData = this.generateFallbackData([symbol]);
    const basePrice = fallbackData[0].price;
    
    const generateOrders = (side, count = 5) => {
      return Array.from({ length: count }, (_, i) => {
        const priceOffset = side === 'buy' ? -(i + 1) * 0.25 : (i + 1) * 0.25;
        return {
          price: (basePrice + priceOffset).toFixed(2),
          qty: Math.floor(Math.random() * 500) + 50,
          orders: Math.floor(Math.random() * 20) + 1
        };
      });
    };

    return {
      bids: generateOrders('buy'),
      asks: generateOrders('sell'),
      lastPrice: basePrice.toFixed(2),
      totalBidQty: Math.floor(Math.random() * 10000) + 1000,
      totalAskQty: Math.floor(Math.random() * 10000) + 1000
    };
  }
}

// Singleton instance
const stockAPI = new StockAPIService();
export default stockAPI;