const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to generate unique request ID
const generateRequestId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `REQ-${randomDigits}`;
};

// Helper: Get recipient blood groups that a donor with donorBloodGroup can fulfill
const getCompatibleRecipientGroups = (donorBloodGroup) => {
  switch (donorBloodGroup) {
    case 'O-':
      return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    case 'O+':
      return ['O+', 'A+', 'B+', 'AB+'];
    case 'A-':
      return ['A-', 'A+', 'AB-', 'AB+'];
    case 'A+':
      return ['A+', 'AB+'];
    case 'B-':
      return ['B-', 'B+', 'AB-', 'AB+'];
    case 'B+':
      return ['B+', 'AB+'];
    case 'AB-':
      return ['AB-', 'AB+'];
    case 'AB+':
      return ['AB+'];
    default:
      return [donorBloodGroup];
  }
};

// @desc    Get active blood requests compatible with logged-in donor
// @route   GET /api/requests/compatible
// @access  Private (Donor)
exports.getCompatibleRequests = async (req, res, next) => {
  try {
    const donorBloodGroup = req.user.bloodGroup;

    if (!donorBloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Authenticated donor profile has no blood group set.',
      });
    }

    const compatibleRecipientGroups = getCompatibleRecipientGroups(donorBloodGroup);

    // Only show active requests (Pending, Searching) matching compatible blood groups
    const requests = await BloodRequest.find({
      bloodGroup: { $in: compatibleRecipientGroups },
      status: { $in: ['Pending', 'Searching'] },
      requester: { $ne: req.user._id },
    })
      .populate('requester', 'name email phone city')
      .populate('responses.donor', 'name phone bloodGroup city area')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      donorBloodGroup,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create emergency blood request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      city,
      contactNumber,
      requiredDate,
      emergencyLevel,
      additionalInformation,
      targetDonor,
    } = req.body;

    const requestId = generateRequestId();

    const bloodRequest = await BloodRequest.create({
      requestId,
      requester: req.user._id,
      targetDonor: targetDonor || null,
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      city,
      contactNumber,
      requiredDate,
      emergencyLevel: emergencyLevel || 'Urgent',
      additionalInformation: additionalInformation || '',
      status: 'Pending',
    });

    if (targetDonor) {
      // Notify the specific target donor requested directly from Find Donors page
      await Notification.create({
        user: targetDonor,
        title: `DIRECT BLOOD REQUEST: ${bloodGroup} Needed`,
        message: `You have received a direct request (${requestId}) for ${patientName} at ${hospitalName}, ${city}. Please respond.`,
        type: 'Emergency',
      });
    } else {
      // Notify matching available donors in the same city or matching blood group
      const matchingDonors = await User.find({
        _id: { $ne: req.user._id },
        bloodGroup: bloodGroup,
        isActive: true,
        availability: 'Available',
      });

      const notificationPromises = matchingDonors.map((donor) => {
        return Notification.create({
          user: donor._id,
          title: `URGENT: ${bloodGroup} Blood Required!`,
          message: `Emergency request (${requestId}) for ${patientName} at ${hospitalName}, ${city}. Level: ${emergencyLevel || 'Urgent'}. Can you donate?`,
          type: 'Emergency',
        });
      });

      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      success: true,
      message: 'Blood Request submitted successfully!',
      data: bloodRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blood requests with optional filters
// @route   GET /api/requests
// @access  Public / Private
exports.getRequests = async (req, res, next) => {
  try {
    const { bloodGroup, city, emergencyLevel, status, requester } = req.query;

    const query = {};

    if (bloodGroup && bloodGroup !== 'All') {
      query.bloodGroup = bloodGroup;
    }

    if (city && city.trim() !== '') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (emergencyLevel && emergencyLevel !== 'All') {
      query.emergencyLevel = emergencyLevel;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (requester) {
      query.requester = requester;
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name email phone city')
      .populate('responses.donor', 'name phone bloodGroup city area')
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

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Public / Private
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name email phone city')
      .populate('responses.donor', 'name phone bloodGroup city area');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res, next) => {
  try {
    let request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Check ownership or admin
    if (
      request.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blood request',
      });
    }

    request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blood request
// @route   DELETE /api/requests/:id
// @access  Private
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    if (
      request.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blood request',
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blood request removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor respond to emergency blood request ("I Can Donate" -> Accepted / "Not Available" -> Rejected)
// @route   POST /api/requests/:id/respond
// @access  Private (Donor)
exports.respondToRequest = async (req, res, next) => {
  try {
    const { status, notes } = req.body; // status: 'Accepted' | 'Rejected'

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response status. Must be Accepted or Rejected.',
      });
    }

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Check if donor has already responded
    const existingIndex = request.responses.findIndex(
      (r) => r.donor.toString() === req.user._id.toString()
    );

    if (existingIndex > -1) {
      request.responses[existingIndex].status = status;
      request.responses[existingIndex].notes = notes || '';
      request.responses[existingIndex].respondedAt = Date.now();
    } else {
      request.responses.push({
        donor: req.user._id,
        status,
        notes: notes || '',
        respondedAt: Date.now(),
      });
    }

    // Update overall request status to 'Donor Found' when accepted
    if (status === 'Accepted' && (request.status === 'Pending' || request.status === 'Searching')) {
      request.status = 'Donor Found';
    }

    await request.save();

    // Create notification for the requester
    await Notification.create({
      user: request.requester,
      title: status === 'Accepted' ? 'Donor Responded: I CAN DONATE!' : 'Donor Response: Not Available',
      message: `Donor ${req.user.name} (${req.user.bloodGroup}) has responded: "${status === 'Accepted' ? 'I Can Donate' : 'Not Available'}" for blood request ${request.requestId}. Contact: ${req.user.phone}`,
      type: 'DonorResponse',
    });

    res.status(200).json({
      success: true,
      message: `Response saved as ${status}. Thank you!`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
