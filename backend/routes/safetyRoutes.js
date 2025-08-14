const express = require('express');
const {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getGearLogs,
  getGearLogById,
  createGearLog,
  updateGearLog,
  deleteGearLog,
} = require('../controllers/safetyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

//  Gear Logs routes 
router.get('/gear-logs', protect, getGearLogs);
router.get('/gear-logs/:id', protect, getGearLogById);
router.post('/gear-logs', protect, createGearLog);
router.put('/gear-logs/:id', protect, updateGearLog);
router.delete('/gear-logs/:id', protect, deleteGearLog);

// Safety Incidents routes 
router.get('/', protect, getIncidents);
router.get('/:id', protect, getIncidentById);
router.post('/', protect, createIncident);
router.put('/:id', protect, updateIncident);
router.delete('/:id', protect, deleteIncident);

module.exports = router;
