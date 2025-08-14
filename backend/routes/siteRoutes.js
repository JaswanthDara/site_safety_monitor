const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getSites,
    getSiteById

} = require('../controllers/siteController');


// Get all sites
router.get('/', protect, getSites);
router.get('/:id', protect, getSiteById);

module.exports = router;
