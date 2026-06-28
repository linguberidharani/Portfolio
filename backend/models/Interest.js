const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  icon:  { type: String, default: 'fas fa-star' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Interest', interestSchema);
