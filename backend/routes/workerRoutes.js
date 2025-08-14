const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getWorkers,
    getWorkerById

} = require('../controllers/workerController');


// Get all workers
router.get('/', protect, getWorkers);
router.get('/:id', protect, getWorkerById);

module.exports = router;
