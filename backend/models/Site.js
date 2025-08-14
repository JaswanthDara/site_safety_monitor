
const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  manager: { type: String },
  contact: { type: String },
});

module.exports = mongoose.model('Site', siteSchema);
