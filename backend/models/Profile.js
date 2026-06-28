const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name:            { type: String, default: 'Your Name' },
  title:           { type: String, default: 'Professional Title' },
  tagline:         { type: String, default: 'Welcome to my Portfolio' },
  intro:           { type: String, default: '' },
  about:           { type: String, default: '' },
  typings:         { type: [String], default: ['Software Developer', 'UI/UX Designer', 'Problem Solver'] },
  resumeUrl:       { type: String, default: '' },
  profileImageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
