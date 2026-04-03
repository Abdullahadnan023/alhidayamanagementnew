const express = require('express');
const router = express.Router();
const { 
  applyForJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getJobApplications,
  withdrawApplication
} = require('../controllers/ApplicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route - apply for job
router.post('/apply', upload.any(), applyForJob);

// Public count route
router.get('/count', async (req, res) => {
  try {
    const Application = require('../models/Application');
    const count = await Application.countDocuments();
    res.json({ success: true, count });
  } catch(e) { res.status(500).json({ success: false }); }
});

// Protected routes
router.use(protect);

// Admin/Manager only
router.get('/', authorize('admin', 'manager'), getApplications);
router.get('/job/:jobId', authorize('admin', 'manager'), getJobApplications);
router.put('/:id/status', authorize('admin', 'manager'), updateApplicationStatus);

// User routes
router.get('/:id', getApplicationById);
router.delete('/:id', withdrawApplication);

module.exports = router;