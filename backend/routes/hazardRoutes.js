const express = require('express');
const { protect } = require('../middleware/authMiddleware');


const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');

const router = express.Router();
// Hazard Reports routes
router.get('/reports', protect, getReports);
router.get('/reports/:id', protect, getReportById);
router.post('/reports', protect, createReport);
router.put('/reports/:id', protect, updateReport);
router.delete('/reports/:id', protect, deleteReport);

module.exports = router;