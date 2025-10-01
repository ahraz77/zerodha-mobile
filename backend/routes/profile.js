const express = require('express');
const Profile = require('../models/Profile');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/profile
// @desc    Get profile data
// @access  Public
router.get('/', async (req, res) => {
  try {
    // For demo purposes, we'll get the first profile or create a default one
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      profile = new Profile({
        name: 'Ahraz',
        userId: 'FJP018',
        initials: 'AZ',
        email: 'ahraz@gmail.com',
        phone: '*6950',
        pan: '*182M',
        demat: '1208160149854261',
        bankAccount: {
          name: 'DCB BANK LTD',
          number: '*2877'
        },
        segments: 'NSE, BSE, MF',
        dematerialization: 'eDIS',
        privacyMode: false,
        supportCode: 'View',
        accountClosureWarning: 'Account closure is permanent and irreversible. Please read this before proceeding.'
      });
      
      await profile.save();
    }
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update profile data
// @access  Public (for testing, should be authenticated in production)
router.put('/', async (req, res) => {
  try {
    const {
      name,
      userId,
      initials,
      email,
      phone,
      pan,
      demat,
      bankAccount,
      segments,
      dematerialization,
      privacyMode,
      supportCode,
      accountClosureWarning
    } = req.body;

    // Find existing profile or create new one
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = new Profile();
    }

    // Update fields
    if (name !== undefined) profile.name = name;
    if (userId !== undefined) profile.userId = userId;
    if (initials !== undefined) profile.initials = initials.toUpperCase();
    if (email !== undefined) profile.email = email;
    if (phone !== undefined) profile.phone = phone;
    if (pan !== undefined) profile.pan = pan;
    if (demat !== undefined) profile.demat = demat;
    if (bankAccount !== undefined) profile.bankAccount = bankAccount;
    if (segments !== undefined) profile.segments = segments;
    if (dematerialization !== undefined) profile.dematerialization = dematerialization;
    if (privacyMode !== undefined) profile.privacyMode = privacyMode;
    if (supportCode !== undefined) profile.supportCode = supportCode;
    if (accountClosureWarning !== undefined) profile.accountClosureWarning = accountClosureWarning;

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/profile/reset
// @desc    Reset profile to default values
// @access  Public (for testing)
router.post('/reset', async (req, res) => {
  try {
    // Delete existing profile
    await Profile.deleteMany({});
    
    // Create default profile
    const defaultProfile = new Profile({
      name: 'Ahraz',
      userId: 'FJP018',
      initials: 'AZ',
      email: 'ahraz@gmail.com',
      phone: '*6950',
      pan: '*182M',
      demat: '1208160149854261',
      bankAccount: {
        name: 'DCB BANK LTD',
        number: '*2877'
      },
      segments: 'NSE, BSE, MF',
      dematerialization: 'eDIS',
      privacyMode: false,
      supportCode: 'View',
      accountClosureWarning: 'Account closure is permanent and irreversible. Please read this before proceeding.'
    });
    
    await defaultProfile.save();
    
    res.json({
      success: true,
      message: 'Profile reset to default values',
      data: defaultProfile
    });
  } catch (error) {
    console.error('Reset profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting profile'
    });
  }
});

// @route   POST /api/profile/generate-initials
// @desc    Generate initials from name
// @access  Public
router.post('/generate-initials', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    res.json({
      success: true,
      message: 'Initials generated successfully',
      data: { initials }
    });
  } catch (error) {
    console.error('Generate initials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating initials'
    });
  }
});

module.exports = router;