const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: [true, 'Donation location/hospital is required'],
  },
  units: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Completed', 'Scheduled', 'Cancelled'],
    default: 'Completed',
  },
  bloodRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);
