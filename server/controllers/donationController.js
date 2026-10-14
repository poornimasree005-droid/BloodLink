const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Record a new donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res, next) => {
  try {
    const { bloodGroup, donationDate, location, units, status, bloodRequest } = req.body;

    const donation = await Donation.create({
      donor: req.user._id,
      bloodGroup: bloodGroup || req.user.bloodGroup,
      donationDate: donationDate || Date.now(),
      location,
      units: units || 1,
      status: status || 'Completed',
      bloodRequest: bloodRequest || null,
    });

    // Update user's lastDonationDate and availability
    await User.findByIdAndUpdate(req.user._id, {
      lastDonationDate: donationDate || Date.now(),
      availability: 'Donated Recently',
    });

    res.status(201).json({
      success: true,
      message: 'Donation record added successfully!',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation history
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res, next) => {
  try {
    let query = {};

    // If user role is regular user, only get their own donations
    if (req.user.role !== 'admin') {
      query.donor = req.user._id;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone bloodGroup city')
      .populate('bloodRequest', 'requestId patientName hospitalName')
      .sort({ donationDate: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};
