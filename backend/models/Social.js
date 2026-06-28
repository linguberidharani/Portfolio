const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  icon:  { type: String, required: true },
  url:   { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Social', socialSchema);
