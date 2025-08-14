const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getCompliances, getComplianceById, createCompliance, updateCompliance, deleteCompliance, } = require('../controllers/complianceController');

const router = express.Router();

router.get('/', protect, getCompliances);
router.get('/:id', protect, getComplianceById);
router.post('/', protect, createCompliance);
router.put('/:id', protect, updateCompliance);
router.delete('/:id', protect, deleteCompliance);

module.exports = router;
