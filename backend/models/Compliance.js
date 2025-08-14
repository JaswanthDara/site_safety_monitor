const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  equipmentName: {
    type: String,  
    required: [true, 'Equipment name is required'],
    trim: true,
  },
   checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkedAt: {
    type: Date,
    required: [true, 'CheckedAt date is required'],
  },
  status: {
    type: String,
    enum: ['Compliant', 'Non-compliant', 'Pending'],
    required: [true, 'Status is required'],
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
});

const Compliance = mongoose.model('Compliance', complianceSchema);

module.exports = Compliance;
