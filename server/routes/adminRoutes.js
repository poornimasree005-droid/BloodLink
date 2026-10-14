const express = require('express');
const router = express.Router();
const {
  getStatistics,
  getUsers,
  getDonors,
  toggleUserStatus,
  verifyUser,
  getAdminRequests,
  updateAdminRequestStatus,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

// All routes are protected & admin-only
router.use(protect, adminOnly);

router.get('/statistics', getStatistics);
router.get('/users', getUsers);
router.get('/donors', getDonors);
router.get('/requests', getAdminRequests);
router.put('/requests/:id', updateAdminRequestStatus);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
