const Profile = require('../models/Profile');

// GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

// PUT /api/profile  (protected)
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name','title','tagline','intro','about','typings','resumeUrl','profileImageUrl'];
    const update  = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    Object.assign(profile, update);
    await profile.save();

    res.json({ success: true, message: 'Profile updated.', data: profile });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile };
