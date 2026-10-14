const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'user' });
    const activeBloodRequests = await BloodRequest.countDocuments({
      status: { $in: ['Pending', 'Searching', 'Donor Found'] },
    });
    const emergencyRequests = await BloodRequest.countDocuments({
      emergencyLevel: 'Critical',
    });
    const completedDonations = await Donation.countDocuments({
      status: 'Completed',
    });
    const pendingRequests = await BloodRequest.countDocuments({
      status: 'Pending',
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        activeBloodRequests,
        emergencyRequests,
        completedDonations,
        pendingRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donors info
// @route   GET /api/admin/donors
// @access  Private (Admin)
exports.getDonors = async (req, res, next) => {
  try {
    const donors = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Deactive)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify donor profile
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verified = !user.verified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Donor verification status updated to ${user.verified}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blood requests for admin
// @route   GET /api/admin/requests
// @access  Private (Admin)
exports.getAdminRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requester', 'name email phone city')
      .populate('responses.donor', 'name phone bloodGroup')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request status from Admin
// @route   PUT /api/admin/requests/:id
// @access  Private (Admin)
exports.updateAdminRequestStatus = async (req, res, next) => {
  try {
    const { status, emergencyLevel } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    if (status) request.status = status;
    if (emergencyLevel) request.emergencyLevel = emergencyLevel;

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request updated by admin',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user by admin
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
