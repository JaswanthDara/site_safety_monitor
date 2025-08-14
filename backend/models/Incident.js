const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    site_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: [true, 'Site is required'],
    },
    incident_type: {
      type: String,
      enum: ['Fall', 'Electrical', 'Equipment Failure', 'Fire', 'Chemical', 'Other'],
      required: [true, 'Incident type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    severity_level: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: [true, 'Severity level is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
