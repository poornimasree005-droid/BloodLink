const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getCompatibleRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  respondToRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createRequest)
  .get(getRequests);

// Compatible Blood Requests for authenticated donor
router.get('/compatible', protect, getCompatibleRequests);

router.route('/:id')
  .get(getRequestById)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

router.post('/:id/respond', protect, respondToRequest);

module.exports = router;
