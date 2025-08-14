const Incident = require('../models/Incident');
const GearLog = require('../models/GearLog');

// GET all incidents
const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET incident by ID
const getIncidentById = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createIncident = async (req, res) => {
  const {
    title,
    description,
    incident_type,
    severity_level,
    date,
    resolved,
    site_id
  } = req.body;

  // Basic validation
  if (!title || !description || !incident_type || !severity_level || !date || !site_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newIncident = await Incident.create({
      user: req.user.id,
      title,
      description,
      incident_type,
      severity_level,
      date,
      resolved: resolved || false,
      site_id
    });

    res.status(201).json(newIncident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// update incident
const updateIncident = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    incident_type,
    severity_level,
    date,
    resolved,
    site_id
  } = req.body;

  // Validate required fields
  if (!title || !description || !incident_type || !severity_level || !date || !site_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check user 
    if (incident.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this incident' });
    }

    // Update incident fields
    incident.title = title;
    incident.description = description;
    incident.incident_type = incident_type;
    incident.severity_level = severity_level;
    incident.date = date;
    incident.resolved = resolved || false;
    incident.site_id = site_id;

    const updatedIncident = await incident.save();

    res.json(updatedIncident);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE incident
const deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    if (incident.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await incident.remove();
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


//
const getGearLogs = async (req, res) => {
  try {
    const logs = await GearLog.find()
      .populate('worker', 'workerName')
      .populate('site', 'name');

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching gear logs:', error);
    res.status(500).json({ message: 'Server error fetching gear logs' });
  }
};

//Get GearLog by id 
const getGearLogById = async (req, res) => {
  const { id } = req.params;

  try {
    const log = await GearLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Gear log not found' });
    }
    res.status(200).json(log);
  } catch (error) {
    console.error('Error fetching gear log:', error);
    res.status(500).json({ message: 'Server error fetching gear log' });
  }
};

// Create new Gear Log
const createGearLog = async (req, res) => {
  const {
    worker,
    site,
    gearType,
    gearCondition,
    dateChecked,
    status,
    remarks,
  } = req.body;

  if (
    !worker ||
    !site ||
    !gearType ||
    !gearCondition ||
    !dateChecked ||
    !status
  ) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newLog = new GearLog({
      worker,
      site,
      gearType,
      gearCondition,
      dateChecked,
      status,
      remarks,
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error creating gear log:', error);
    res.status(500).json({ message: 'Server error creating gear log' });
  }
};

// Update Gear Log
const updateGearLog = async (req, res) => {
  const { id } = req.params;
  const {
    worker,
    site,
    gearType,
    gearCondition,
    dateChecked,
    status,
    remarks,
  } = req.body;

  try {
    const log = await GearLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Gear log not found' });
    }

    log.worker = worker || log.worker;
    log.site = site || log.site;
    log.gearType = gearType || log.gearType;
    log.gearCondition = gearCondition || log.gearCondition;
    log.dateChecked = dateChecked || log.dateChecked;
    log.status = status || log.status;
    log.remarks = remarks !== undefined ? remarks : log.remarks;

    const updatedLog = await log.save();
    res.status(200).json(updatedLog);
  } catch (error) {
    console.error('Error updating gear log:', error);
    res.status(500).json({ message: 'Server error updating gear log' });
  }
};

module.exports = {
  createGearLog,
  updateGearLog,
};


//Delete Gear Log
const deleteGearLog = async (req, res) => {
  const { id } = req.params;

  try {
    const log = await GearLog.findById(id);
    if (!log) {
      return res.status(404).json({ message: 'Gear log not found' });
    }

    await log.remove();
    res.status(200).json({ message: 'Gear log deleted successfully' });
  } catch (error) {
    console.error('Error deleting gear log:', error);
    res.status(500).json({ message: 'Server error deleting gear log' });
  }
};

module.exports = {
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
};
