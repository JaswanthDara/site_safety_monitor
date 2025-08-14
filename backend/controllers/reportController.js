const Report = require('../models/Report');

// Get all hazard reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

// Get a  report by ID
const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Hazard report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
};


// Create new hazard report
const createReport = async (req, res) => {
  const { title, description, date, location } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newReport = new Report({
      title,
      description,
      date,
      location,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error creating report' });
  }
};

// Update hazard report by Id
const updateReport = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.title = title || report.title;
    report.description = description || report.description;
    report.date = date || report.date;
    report.location = location || report.location;

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error updating report' });
  }
};

// Delete hazard report by Id
const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.remove();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error deleting report' });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
