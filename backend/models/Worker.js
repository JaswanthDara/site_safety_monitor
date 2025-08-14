const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  dateHired: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
