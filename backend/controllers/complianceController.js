const Compliance = require('../models/Compliance');
const User = require('../models/User');

// Get all equipment compliance
const getCompliances = async (req, res) => {
  try {
    const compliances = await Compliance.find()
      .sort({ checkedAt: -1 })
      .populate('checkedBy', 'name'); 

    res.json(compliances);
  } catch (error) {
    console.error('Error fetching compliances:', error);
    res.status(500).json({ message: 'Server error fetching compliances' });
  }
};


// Get a compliance by Id
const getComplianceById = async (req, res) => {
  const { id } = req.params;

  try {
    const compliance = await Compliance.findById(id)
      .populate('checkedBy', 'name');

    if (!compliance) {
      return res.status(404).json({ message: 'Compliance record not found' });
    }

    res.json(compliance);
  } catch (error) {
    console.error('Error fetching compliance by ID:', error);
    res.status(500).json({ message: 'Server error fetching compliance' });
  }
};



// Create a new equipment compliance
const createCompliance = async (req, res) => {
  const { equipmentName, checkedBy, checkedAt, status, remarks } = req.body;

  // Validate required fields
  if (!equipmentName || !checkedBy || !checkedAt || !status) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newCompliance = new Compliance({
      equipmentName: equipmentName, 
      checkedBy,
      checkedAt,
      status,
      remarks,
    });

    const savedCompliance = await newCompliance.save();
    res.status(201).json(savedCompliance);
  } catch (error) {
    console.error('Error creating compliance:', error);
    res.status(500).json({ message: 'Server error creating compliance' });
  }
};


// Update compliance record by ID
const updateCompliance = async (req, res) => {
  const { id } = req.params;
  const { equipmentName, checkedBy, checkedAt, status, remarks } = req.body;

  try {
    const compliance = await Compliance.findById(id);
    if (!compliance) {
      return res.status(404).json({ message: 'Compliance record not found' });
    }

    compliance.equipmentName = equipmentName || compliance.equipmentName;
    compliance.checkedBy = checkedBy || compliance.checkedBy;
    compliance.checkedAt = checkedAt || compliance.checkedAt;
    compliance.status = status || compliance.status;
    compliance.remarks = remarks || compliance.remarks;

    const updatedCompliance = await compliance.save();
    res.json(updatedCompliance);
  } catch (error) {
    console.error('Error updating compliance:', error);
    res.status(500).json({ message: 'Server error updating compliance' });
  }
};

// Delete compliance record by Id
const deleteCompliance = async (req, res) => {
  const { id } = req.params;

  try {
    const compliance = await Compliance.findById(id);
    if (!compliance) {
      return res.status(404).json({ message: 'Compliance record not found' });
    }

    await compliance.remove();
    res.json({ message: 'Compliance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting compliance:', error);
    res.status(500).json({ message: 'Server error deleting compliance' });
  }
};

module.exports = {
  getCompliances,
  getComplianceById,
  createCompliance,
  updateCompliance,
  deleteCompliance,
};
