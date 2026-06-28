const router = require('express').Router();
const { getAll, updateContact, updateTheme, updateSettings, incrementVisitor } = require('../controllers/configController');
const { protect } = require('../middleware/auth');

router.get ('/',          getAll);
router.put ('/contact',   protect, updateContact);
router.put ('/theme',     protect, updateTheme);
router.put ('/settings',  protect, updateSettings);
router.post('/visitor',   incrementVisitor);   // public — no auth

module.exports = router;
