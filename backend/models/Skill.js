const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  level:    { type: Number, default: 50, min: 0, max: 100 },
  category: { type: String, default: 'General' },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
