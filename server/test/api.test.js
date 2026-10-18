/**
 * BloodLink Automated API Test Suite
 * Tests health checks, auth, profile, donor search, emergency requests,
 * donations, notifications, and admin functionality.
 */

const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: __dirname + '/../.env' });

const connectDB = require('../config/db');

let server;
let baseUrl;

const runTests = async () => {
  console.log('=============================================================');
  console.log('🧪 Starting BloodLink Backend Automated Test Suite');
  console.log('=============================================================\n');

  // 1. Connect to DB (uses MONGO_URI or local DB; falls back to MongoMemoryServer strictly for testing)
  let conn = await connectDB();
  if (!conn && (!mongoose.connection || mongoose.connection.readyState !== 1)) {
    console.log('[Test Setup] Starting MongoMemoryServer for isolated automated tests...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }
  const seedData = require('../utils/seeder');
  await seedData();

  // 2. Start Express app on a dedicated test port
  const express = require('express');
  const cors = require('cors');
  const errorHandler = require('../middleware/errorHandler');

  const app = express();
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.options('*', cors());

  // Mount routes matching server.js
  app.get('/', (req, res) => {
    const isDbConnected = Boolean(mongoose.connection && mongoose.connection.readyState === 1);
    res.status(200).json({
      status: 'Active',
      database: isDbConnected ? 'Connected' : 'Disconnected',
      system: 'BloodLink Backend API',
    });
  });

  app.get(['/health', '/api/health'], (req, res) => {
    const isDbConnected = Boolean(mongoose.connection && mongoose.connection.readyState === 1);
    res.status(200).json({
      status: 'OK',
      database: isDbConnected ? 'Connected' : 'Disconnected',
    });
  });

  app.get('/api/status', (req, res) => {
    res.status(200).json({
      status: 'Active',
      system: 'BloodLink: Online Blood Donation and Emergency Donor Management System',
    });
  });

  app.use('/api/auth', require('../routes/authRoutes'));
  app.use('/api/users', require('../routes/userRoutes'));
  app.get('/api/donors', require('../controllers/userController').getDonors);
  app.get('/donors', require('../controllers/userController').getDonors);
  app.use('/api/requests', require('../routes/requestRoutes'));
  app.use('/api/donations', require('../routes/donationRoutes'));
  app.use('/api/notifications', require('../routes/notificationRoutes'));
  app.use('/api/admin', require('../routes/adminRoutes'));
  app.use(errorHandler);

  const TEST_PORT = 5002;
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      baseUrl = `http://127.0.0.1:${TEST_PORT}`;
      console.log(`[Test Server] Listening on ${baseUrl}\n`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  };

  const testEmail = `testdonor_${Date.now()}@bloodlink.test`;
  const testPassword = 'Password@123';
  let userToken = '';
  let userId = '';
  let adminToken = '';
  let createdRequestId = '';
  let createdDonationId = '';

  try {
    // -------------------------------------------------------------
    // Group 1: Health & Status Endpoints
    // -------------------------------------------------------------
    console.log('--- 1. Health & Status Checks ---');
    const rootRes = await fetch(`${baseUrl}/`);
    const rootData = await rootRes.json();
    assert(rootRes.status === 200 && rootData.status === 'Active' && rootData.database === 'Connected', 'GET / returns Active and DB Connected');

    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'OK' && healthData.database === 'Connected', 'GET /health returns 200 OK');

    const apiHealthRes = await fetch(`${baseUrl}/api/health`);
    const apiHealthData = await apiHealthRes.json();
    assert(apiHealthRes.status === 200 && apiHealthData.status === 'OK', 'GET /api/health alias returns 200 OK');

    const statusRes = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusRes.json();
    assert(statusRes.status === 200 && statusData.status === 'Active', 'GET /api/status returns Active');

    // -------------------------------------------------------------
    // Group 2: Registration & Authentication
    // -------------------------------------------------------------
    console.log('\n--- 2. Registration & Authentication ---');
    // Password mismatch test
    const mismatchRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mismatch User',
        email: 'mismatch@bloodlink.test',
        password: 'Password1',
        confirmPassword: 'Password2',
      }),
    });
    assert(mismatchRes.status === 400, 'POST /api/auth/register rejects password mismatch with 400');

    // Valid user registration
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Donor',
        email: testEmail,
        phone: '+1-555-9988',
        password: testPassword,
        confirmPassword: testPassword,
        age: 26,
        gender: 'Male',
        bloodGroup: 'O+',
        city: 'Metropolis',
        area: 'Uptown District',
        address: '100 Test Avenue',
        availability: 'Available',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success && !!regData.token, 'POST /api/auth/register succeeds with 201 and JWT');
    userToken = regData.token;
    userId = regData.user?.id || regData.user?._id;

    // Duplicate registration check
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testEmail,
        phone: '+1-555-9988',
        password: testPassword,
        confirmPassword: testPassword,
        age: 26,
        gender: 'Male',
        bloodGroup: 'O+',
        city: 'Metropolis',
        area: 'Uptown',
        address: '100 Test Ave',
      }),
    });
    assert(dupRes.status === 400, 'POST /api/auth/register prevents duplicate email registration (400)');

    // Login with invalid password
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword!' }),
    });
    assert(badLoginRes.status === 401, 'POST /api/auth/login rejects wrong password (401)');

    // Login with registered credentials
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success && !!loginData.token, 'POST /api/auth/login succeeds with 200 and token');

    // Login with seeded Admin credentials
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bloodlink.org', password: 'Admin@123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.user?.role === 'admin', 'POST /api/auth/login logs in seeded Admin');
    adminToken = adminLoginData.token;

    // -------------------------------------------------------------
    // Group 3: User Profiles & Security
    // -------------------------------------------------------------
    console.log('\n--- 3. User Profile & Security ---');
    // Unauthorized profile fetch
    const unauthProfRes = await fetch(`${baseUrl}/api/users/profile`);
    assert(unauthProfRes.status === 401, 'GET /api/users/profile rejects request without token (401)');

    // Authenticated profile fetch
    const profRes = await fetch(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const profData = await profRes.json();
    assert(profRes.status === 200 && profData.data?.email === testEmail.toLowerCase(), 'GET /api/users/profile returns authenticated user profile');

    // Update profile
    const updateProfRes = await fetch(`${baseUrl}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        area: 'Uptown Tech Center',
        availability: 'Available',
      }),
    });
    const updateProfData = await updateProfRes.json();
    assert(updateProfRes.status === 200 && updateProfData.data?.area === 'Uptown Tech Center', 'PUT /api/users/profile successfully updates profile');

    // -------------------------------------------------------------
    // Group 4: Donor Search
    // -------------------------------------------------------------
    console.log('\n--- 4. Donor Search API ---');
    const donorsRes = await fetch(`${baseUrl}/api/donors`);
    const donorsData = await donorsRes.json();
    assert(donorsRes.status === 200 && Array.isArray(donorsData.data) && donorsData.count > 0, 'GET /api/donors returns donor list');

    const usersDonorsRes = await fetch(`${baseUrl}/api/users/donors`);
    const usersDonorsData = await usersDonorsRes.json();
    assert(usersDonorsRes.status === 200 && Array.isArray(usersDonorsData.data), 'GET /api/users/donors alias returns donor list');

    const filterDonorRes = await fetch(`${baseUrl}/api/donors?bloodGroup=O%2B&city=Metropolis`);
    const filterDonorData = await filterDonorRes.json();
    assert(filterDonorRes.status === 200 && filterDonorData.data.every((d) => d.bloodGroup === 'O+'), 'GET /api/donors?bloodGroup=O+ filters accurately');

    // -------------------------------------------------------------
    // Group 5: Emergency Blood Requests
    // -------------------------------------------------------------
    console.log('\n--- 5. Emergency Blood Requests ---');
    const createReqRes = await fetch(`${baseUrl}/api/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        patientName: 'Jane Smith',
        bloodGroup: 'A-',
        unitsRequired: 2,
        hospitalName: 'Metropolis Care Hospital',
        hospitalLocation: 'ICU Wing 2, Bed 14',
        city: 'Metropolis',
        contactNumber: '+1-555-0142',
        requiredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        emergencyLevel: 'Critical',
        additionalInformation: 'Urgent need for surgery backup.',
      }),
    });
    const createReqData = await createReqRes.json();
    assert(createReqRes.status === 201 && createReqData.success && !!createReqData.data?._id, 'POST /api/requests creates emergency request with 201');
    createdRequestId = createReqData.data?._id;

    // Get all requests
    const getReqsRes = await fetch(`${baseUrl}/api/requests`);
    const getReqsData = await getReqsRes.json();
    assert(getReqsRes.status === 200 && getReqsData.data.length > 0, 'GET /api/requests retrieves blood requests');

    // Compatible requests for logged-in donor (user has O+ blood group, so can donate to O+, A+, B+, AB+)
    const compatRes = await fetch(`${baseUrl}/api/requests/compatible`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const compatData = await compatRes.json();
    assert(compatRes.status === 200 && Array.isArray(compatData.data), 'GET /api/requests/compatible returns compatible requests');

    // Donor response: "Accepted" (I Can Donate)
    const seedDonorRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah@example.com', password: 'User@123' }),
    });
    const seedDonorData = await seedDonorRes.json();
    const donor2Token = seedDonorData.token;

    const respondRes = await fetch(`${baseUrl}/api/requests/${createdRequestId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${donor2Token}`,
      },
      body: JSON.stringify({
        status: 'Accepted',
        notes: 'I can donate tomorrow morning.',
      }),
    });
    const respondData = await respondRes.json();
    assert(respondRes.status === 200 && respondData.success && respondData.data?.status === 'Donor Found', 'POST /api/requests/:id/respond records response and sets Donor Found');

    // Update request status
    const updateReqRes = await fetch(`${baseUrl}/api/requests/${createdRequestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ status: 'Fulfilled' }),
    });
    const updateReqData = await updateReqRes.json();
    assert(updateReqRes.status === 200 && updateReqData.data?.status === 'Fulfilled', 'PUT /api/requests/:id updates request status to Fulfilled');

    // -------------------------------------------------------------
    // Group 6: Donations & History
    // -------------------------------------------------------------
    console.log('\n--- 6. Donations ---');
    const donRes = await fetch(`${baseUrl}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        bloodGroup: 'O+',
        donationDate: new Date().toISOString(),
        location: 'Metropolis Blood Center',
        units: 1,
      }),
    });
    const donData = await donRes.json();
    assert(donRes.status === 201 && donData.success && !!donData.data?._id, 'POST /api/donations logs donation record with 201');
    createdDonationId = donData.data?._id;

    const getDonsRes = await fetch(`${baseUrl}/api/donations`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const getDonsData = await getDonsRes.json();
    assert(getDonsRes.status === 200 && getDonsData.data.some((d) => d._id === createdDonationId), 'GET /api/donations returns user donation history');

    // -------------------------------------------------------------
    // Group 7: Notifications
    // -------------------------------------------------------------
    console.log('\n--- 7. Notifications ---');
    const notifsRes = await fetch(`${baseUrl}/api/notifications`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const notifsData = await notifsRes.json();
    assert(notifsRes.status === 200 && Array.isArray(notifsData.data), 'GET /api/notifications returns user notifications');

    const readAllRes = await fetch(`${baseUrl}/api/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(readAllRes.status === 200, 'PUT /api/notifications/read-all marks notifications as read');

    // -------------------------------------------------------------
    // Group 8: Admin Management & Role Protection
    // -------------------------------------------------------------
    console.log('\n--- 8. Admin Management & Access Control ---');
    // Non-admin forbidden
    const nonAdminStatsRes = await fetch(`${baseUrl}/api/admin/statistics`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(nonAdminStatsRes.status === 403, 'GET /api/admin/statistics denies non-admin with 403 Forbidden');

    // Admin allowed
    const adminStatsRes = await fetch(`${baseUrl}/api/admin/statistics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminStatsData = await adminStatsRes.json();
    assert(adminStatsRes.status === 200 && adminStatsData.data?.totalUsers > 0, 'GET /api/admin/statistics returns stats for Admin');

    const adminUsersRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminUsersData = await adminUsersRes.json();
    assert(adminUsersRes.status === 200 && Array.isArray(adminUsersData.data), 'GET /api/admin/users returns users list');

    const adminReqsRes = await fetch(`${baseUrl}/api/admin/requests`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminReqsData = await adminReqsRes.json();
    assert(adminReqsRes.status === 200 && Array.isArray(adminReqsData.data), 'GET /api/admin/requests returns requests list');

    // Clean up created request
    const delReqRes = await fetch(`${baseUrl}/api/requests/${createdRequestId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(delReqRes.status === 200, 'DELETE /api/requests/:id removes test request cleanly');

  } catch (error) {
    console.error('Unexpected test error occurred:', error);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
  }

  console.log('\n=============================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
