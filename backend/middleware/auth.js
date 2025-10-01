const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateToken = async (req, res, next) => {
  try {
    console.log(`🔐 Auth check for: ${req.method} ${req.originalUrl}`);
    const authHeader = req.headers['authorization'];
    console.log('🔑 Auth header:', authHeader ? 'Bearer token present' : 'No auth header');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    console.log('🔍 Token received (first 20 chars):', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      console.log('❌ Invalid token or admin not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid token or admin not found'
      });
    }

    console.log(`✅ Auth successful for admin: ${admin.email}`);
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

module.exports = authenticateToken;