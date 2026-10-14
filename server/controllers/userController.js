const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'age',
      'gender',
      'bloodGroup',
      'city',
      'area',
      'address',
      'lastDonationDate',
      'availability',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available donor list with filtering
// @route   GET /api/donors
// @access  Public / Private
exports.getDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, area, availability, search } = req.query;

    const query = {
      isActive: true,
      role: 'user',
    };

    // By default, only show donors who are "Available" unless explicitly requested otherwise
    if (availability && availability !== 'All') {
      query.availability = availability;
    } else if (!availability) {
      query.availability = 'Available';
    }

    if (bloodGroup && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }

    if (city && city.trim() !== '') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (area && area.trim() !== '') {
      query.area = { $regex: area.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { area: searchRegex },
      ];
    }

    const donors = await User.find(query)
      .select('name bloodGroup city area availability lastDonationDate age gender phone verified createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    next(error);
  }
};
