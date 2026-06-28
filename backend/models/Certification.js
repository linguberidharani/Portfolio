const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  issuer:   { type: String, default: '' },
  year:     { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
