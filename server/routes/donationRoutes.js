const express = require('express');
const router = express.Router();
const { createDonation, getDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createDonation)
  .get(protect, getDonations);

module.exports = router;
