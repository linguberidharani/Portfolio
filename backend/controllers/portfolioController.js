const Profile       = require('../models/Profile');
const Social        = require('../models/Social');
const Education     = require('../models/Education');
const Skill         = require('../models/Skill');
const Project       = require('../models/Project');
const Experience    = require('../models/Experience');
const Achievement   = require('../models/Achievement');
const Certification = require('../models/Certification');
const Interest      = require('../models/Interest');
const SiteConfig    = require('../models/SiteConfig');

// GET /api/portfolio  — single call returns everything for public page
const getPortfolio = async (req, res, next) => {
  try {
    const [
      profile, socials, education, skills, projects,
      experience, achievements, certifications, interests, config
    ] = await Promise.all([
      Profile.findOne(),
      Social.find().sort('order'),
      Education.find().sort('order'),
      Skill.find().sort('order'),
      Project.find().sort('order'),
      Experience.find().sort('order'),
      Achievement.find().sort('order'),
      Certification.find().sort('order'),
      Interest.find().sort('order'),
      SiteConfig.findOne(),
    ]);

    res.json({
      success: true,
      data: {
        profile:        profile  || {},
        socials:        socials,
        education:      education,
        skills:         skills,
        projects:       projects,
        experience:     experience,
        achievements:   achievements,
        certifications: certifications,
        interests:      interests,
        contact:        config?.contact  || {},
        theme:          config?.theme    || {},
        settings:       config?.settings || {},
        visitorCount:   config?.visitorCount || 0,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPortfolio };
