const mongoose = require('mongoose');

const donorResponseSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Rejected'],
    required: true,
  },
  respondedAt: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

const bloodRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetDonor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  unitsRequired: {
    type: Number,
    required: [true, 'Number of units is required'],
    min: 1,
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
  },
  hospitalLocation: {
    type: String,
    required: [true, 'Hospital location is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
  requiredDate: {
    type: Date,
    required: [true, 'Required date is required'],
  },
  emergencyLevel: {
    type: String,
    enum: ['Critical', 'Urgent', 'Normal'],
    default: 'Urgent',
  },
  additionalInformation: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Searching', 'Donor Found', 'Fulfilled', 'Cancelled'],
    default: 'Pending',
  },
  responses: [donorResponseSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
