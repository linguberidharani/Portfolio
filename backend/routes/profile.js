const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/', getProfile);
router.put('/', protect, updateProfile);

module.exports = router;
