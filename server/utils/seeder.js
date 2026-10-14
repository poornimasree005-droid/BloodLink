const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('[Seeder] Database already populated with Admin user.');
      return;
    }

    console.log('[Seeder] Seeding initial sample data into BloodLink...');

    // 1. Create Admin user
    const admin = await User.create({
      name: 'BloodLink System Admin',
      email: 'admin@bloodlink.org',
      phone: '+1-800-555-0199',
      password: 'Admin@123',
      age: 35,
      gender: 'Other',
      bloodGroup: 'O+',
      city: 'Metropolis',
      area: 'Central Plaza',
      address: '100 Medical Center Way, Suite 400',
      lastDonationDate: new Date('2025-11-10'),
      availability: 'Available',
      role: 'admin',
      verified: true,
      isActive: true,
    });

    // 2. Create Sample Donors
    const donor1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0142',
      password: 'User@123',
      age: 28,
      gender: 'Male',
      bloodGroup: 'O+',
      city: 'Metropolis',
      area: 'Downtown',
      address: '42 Main St, Metropolis',
      lastDonationDate: new Date('2025-12-01'),
      availability: 'Available',
      role: 'user',
      verified: true,
      isActive: true,
    });

    const donor2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      phone: '+1-555-0188',
      password: 'User@123',
      age: 31,
      gender: 'Female',
      bloodGroup: 'A-',
      city: 'Metropolis',
      area: 'West End',
      address: '78 Oak Avenue, Metropolis',
      lastDonationDate: new Date('2026-01-15'),
      availability: 'Available',
      role: 'user',
      verified: true,
      isActive: true,
    });

    const donor3 = await User.create({
      name: 'Michael Chang',
      email: 'michael@example.com',
      phone: '+1-555-0192',
      password: 'User@123',
      age: 24,
      gender: 'Male',
      bloodGroup: 'B+',
      city: 'Springfield',
      area: 'North Park',
      address: '12 Elm Street, Springfield',
      lastDonationDate: new Date('2025-08-20'),
      availability: 'Available',
      role: 'user',
      verified: true,
      isActive: true,
    });

    const donor4 = await User.create({
      name: 'Emily Watson',
      email: 'emily@example.com',
      phone: '+1-555-0233',
      password: 'User@123',
      age: 29,
      gender: 'Female',
      bloodGroup: 'AB+',
      city: 'Springfield',
      area: 'South Hills',
      address: '55 Pine Ridge Rd, Springfield',
      lastDonationDate: new Date('2026-02-10'),
      availability: 'Donated Recently',
      role: 'user',
      verified: true,
      isActive: true,
    });

    // 3. Create Sample Emergency Blood Requests
    const req1 = await BloodRequest.create({
      requestId: 'REQ-918234',
      requester: donor1._id,
      patientName: 'Robert Vance',
      bloodGroup: 'A-',
      unitsRequired: 2,
      hospitalName: 'Metropolis General Hospital',
      hospitalLocation: 'Building B, ICU Ward 3',
      city: 'Metropolis',
      contactNumber: '+1-555-0142',
      requiredDate: new Date(Date.now() + 86400000 * 2), // in 2 days
      emergencyLevel: 'Critical',
      additionalInformation: 'Patient scheduled for urgent cardiac bypass surgery. Compatible donors urgently needed.',
      status: 'Searching',
      responses: [
        {
          donor: donor2._id,
          status: 'Accepted',
          notes: 'Available to donate on Thursday morning at 9 AM.',
          respondedAt: new Date(),
        },
      ],
    });

    const req2 = await BloodRequest.create({
      requestId: 'REQ-482910',
      requester: donor3._id,
      patientName: 'Clara Oswald',
      bloodGroup: 'O+',
      unitsRequired: 1,
      hospitalName: 'Springfield St. Jude Memorial',
      hospitalLocation: 'Room 402, Trauma Center',
      city: 'Springfield',
      contactNumber: '+1-555-0192',
      requiredDate: new Date(Date.now() + 86400000 * 4),
      emergencyLevel: 'Urgent',
      additionalInformation: 'Post-accident recovery requirement.',
      status: 'Pending',
    });

    const req3 = await BloodRequest.create({
      requestId: 'REQ-103942',
      requester: donor2._id,
      patientName: 'David Miller',
      bloodGroup: 'B+',
      unitsRequired: 3,
      hospitalName: 'City Trauma Care Center',
      hospitalLocation: 'Block 2, Emergency Room',
      city: 'Metropolis',
      contactNumber: '+1-555-0188',
      requiredDate: new Date(Date.now() - 86400000 * 5),
      emergencyLevel: 'Normal',
      additionalInformation: 'Routine surgery backup.',
      status: 'Fulfilled',
    });

    // 4. Create Sample Donations
    await Donation.create({
      donor: donor1._id,
      bloodGroup: 'O+',
      donationDate: new Date('2025-12-01'),
      location: 'Red Cross Mobile Blood Drive, Metropolis',
      units: 1,
      status: 'Completed',
    });

    await Donation.create({
      donor: donor2._id,
      bloodGroup: 'A-',
      donationDate: new Date('2026-01-15'),
      location: 'Metropolis General Blood Bank',
      units: 1,
      status: 'Completed',
    });

    await Donation.create({
      donor: donor3._id,
      bloodGroup: 'B+',
      donationDate: new Date('2025-08-20'),
      location: 'Springfield Regional Hospital',
      units: 1,
      status: 'Completed',
    });

    // 5. Create Sample Notifications
    await Notification.create({
      user: donor1._id,
      title: 'Welcome to BloodLink!',
      message: 'Thank you for registering as a blood donor. Your contribution saves lives!',
      type: 'System',
      read: true,
    });

    await Notification.create({
      user: donor2._id,
      title: 'URGENT: A- Blood Required!',
      message: 'Emergency request REQ-918234 for Robert Vance at Metropolis General Hospital.',
      type: 'Emergency',
      read: false,
    });

    await Notification.create({
      user: donor1._id,
      title: 'Donor Responded: ACCEPTED!',
      message: 'Donor Sarah Connor (A-) has accepted your blood request REQ-918234.',
      type: 'DonorResponse',
      read: false,
    });

    console.log('[Seeder] Initial sample data seeded successfully!');
    console.log('[Seeder] Admin Credentials: admin@bloodlink.org / Admin@123');
    console.log('[Seeder] Donor Credentials: john@example.com / User@123');
  } catch (error) {
    console.error('[Seeder] Error seeding sample data:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}
