const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  contact: {
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },
    location: { type: String, default: '' },
  },
  theme: {
    primary:   { type: String, default: '#7C3AED' },
    secondary: { type: String, default: '#0D9488' },
    dark:      { type: Boolean, default: true },
  },
  settings: {
    seoTitle:  { type: String, default: 'My Portfolio' },
    seoDesc:   { type: String, default: 'Professional Portfolio' },
    footer:    { type: String, default: '© 2025 My Portfolio. All rights reserved.' },
  },
  visitorCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
