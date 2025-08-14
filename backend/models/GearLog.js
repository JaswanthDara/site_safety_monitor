const mongoose = require('mongoose');

const gearLogSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    gearType: {
      type: String,
      required: true,
      trim: true,
    },
    gearCondition: {
      type: String,
      required: true,
      trim: true,
    },
    dateChecked: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Good', 'Damaged', 'Replaced'],
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const GearLog = mongoose.model('GearLog', gearLogSchema);

module.exports = GearLog;
