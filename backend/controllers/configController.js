const SiteConfig = require('../models/SiteConfig');

// Helper: get or create the single config document
const getConfig = async () => {
  let cfg = await SiteConfig.findOne();
  if (!cfg) cfg = await SiteConfig.create({});
  return cfg;
};

// GET /api/config
const getAll = async (req, res, next) => {
  try {
    const cfg = await getConfig();
    res.json({ success: true, data: cfg });
  } catch (err) { next(err); }
};

// PUT /api/config/contact  (protected)
const updateContact = async (req, res, next) => {
  try {
    const { email, phone, linkedin, github, location } = req.body;
    const cfg = await getConfig();
    cfg.contact = { email, phone, linkedin, github, location };
    await cfg.save();
    res.json({ success: true, message: 'Contact info updated.', data: cfg.contact });
  } catch (err) { next(err); }
};

// PUT /api/config/theme  (protected)
const updateTheme = async (req, res, next) => {
  try {
    const { primary, secondary, dark } = req.body;
    const cfg = await getConfig();
    cfg.theme = { primary, secondary, dark };
    await cfg.save();
    res.json({ success: true, message: 'Theme updated.', data: cfg.theme });
  } catch (err) { next(err); }
};

// PUT /api/config/settings  (protected)
const updateSettings = async (req, res, next) => {
  try {
    const { seoTitle, seoDesc, footer } = req.body;
    const cfg = await getConfig();
    cfg.settings = { seoTitle, seoDesc, footer };
    await cfg.save();
    res.json({ success: true, message: 'Settings updated.', data: cfg.settings });
  } catch (err) { next(err); }
};

// POST /api/config/visitor  (public — increments count)
const incrementVisitor = async (req, res, next) => {
  try {
    const cfg = await getConfig();
    cfg.visitorCount = (cfg.visitorCount || 0) + 1;
    await cfg.save();
    res.json({ success: true, visitorCount: cfg.visitorCount });
  } catch (err) { next(err); }
};

module.exports = { getAll, updateContact, updateTheme, updateSettings, incrementVisitor };
