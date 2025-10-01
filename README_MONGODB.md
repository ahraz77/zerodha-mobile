# MongoDB Integration Setup Guide

## Overview
This guide will help you set up the Zerodha Mobile Trading App with MongoDB backend integration.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Git

## Quick Setup

### 1. Install Dependencies
```bash
# Install frontend and backend dependencies
npm run setup
```

### 2. Environment Configuration

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Zerodha Mobile
VITE_APP_VERSION=1.0.0
```

**Backend (backend/.env):**
```env
NODE_ENV=development
PORT=5000

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://mahammadsayad433:saad@zerodha-mobile.zek8ryo.mongodb.net/?retryWrites=true&w=majority&appName=Zerodha-Mobile
DB_NAME=zerodha-mobile

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Servers

**Option 1: Start both frontend and backend together**
```bash
npm run dev:full
```

**Option 2: Start separately**
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

## Features

### Authentication
- JWT-based admin authentication
- Secure token storage and verification
- Auto-logout on token expiration

### Data Management
- MongoDB database with Mongoose ODM
- RESTful API endpoints
- Real-time data synchronization
- CRUD operations for Holdings, Positions, Orders

### Admin Dashboard
- Protected admin interface
- Real-time data editing
- User-friendly forms with validation
- Bulk operations support

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Admin logout
- `PUT /api/auth/change-password` - Change admin password

### Holdings
- `GET /api/holdings` - Get all holdings
- `POST /api/holdings` - Create holding (Admin only)
- `PUT /api/holdings/:id` - Update holding (Admin only)
- `DELETE /api/holdings/:id` - Delete holding (Admin only)
- `POST /api/holdings/seed` - Seed initial data (Admin only)

### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create position (Admin only)
- `PUT /api/positions/:id` - Update position (Admin only)
- `DELETE /api/positions/:id` - Delete position (Admin only)
- `POST /api/positions/seed` - Seed initial data (Admin only)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order (Admin only)
- `PUT /api/orders/:id` - Update order (Admin only)
- `DELETE /api/orders/:id` - Delete order (Admin only)
- `POST /api/orders/seed` - Seed initial data (Admin only)

## Database Schema

### Holdings
```javascript
{
  name: String (required),
  qty: Number (required, min: 0),
  avg: String (required),
  invested: String (required),
  pct: String (required),
  change: String (required),
  ltp: String (required),
  ltpPct: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Positions
```javascript
{
  symbol: String (required),
  segment: String (required, enum: ['NSE', 'BSE', 'CDS', 'MCX', 'NFO']),
  qty: Number (required),
  avg: String (required),
  product: String (required, enum: ['NRML', 'MIS', 'CNC', 'CO', 'BO']),
  pnl: String (required),
  ltp: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```javascript
{
  type: String (required, enum: ['BUY', 'SELL']),
  symbol: String (required),
  qty: Number (required, min: 1),
  status: String (required, enum: ['OPEN', 'COMPLETE', 'REJECTED', 'CANCELLED']),
  price: String (required),
  trigger: String (default: ''),
  exchange: String (required, enum: ['NSE', 'BSE', 'CDS', 'MCX', 'NFO']),
  product: String (required, enum: ['NRML', 'MIS', 'CNC', 'CO', 'BO']),
  orderType: String (required, enum: ['MARKET', 'LIMIT', 'SL-M', 'SL']),
  time: String (required),
  ltp: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Bcrypt for password security
3. **CORS Protection**: Configured for specific origins
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **Input Validation**: Mongoose schema validation
6. **Error Handling**: Comprehensive error handling

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-url
JWT_SECRET=your-strong-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Build Commands
```bash
# Build frontend
npm run build

# Start production backend
npm run backend:start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure network access is configured in MongoDB Atlas
   - Verify credentials

2. **CORS Errors**
   - Update `FRONTEND_URL` in backend .env
   - Check frontend `VITE_API_URL` configuration

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret configuration
   - Verify admin credentials

4. **API Errors**
   - Check backend logs
   - Ensure backend server is running
   - Verify API endpoint URLs

### Health Check
Visit `http://localhost:5000/api/health` to check if the backend is running properly.

## Admin Access
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `admin123`

Change these credentials in production!