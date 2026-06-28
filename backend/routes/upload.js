const router = require('express').Router();
const { handleImageUpload, handleResumeUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/image',  protect, handleImageUpload);
router.post('/resume', protect, handleResumeUpload);

module.exports = router;
