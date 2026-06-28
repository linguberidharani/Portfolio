const router = require('express').Router();
const { login, logout, getMe, changeUsername, changePassword } = require('../controllers/authController');
const { protect }     = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login',    loginLimiter, login);
router.post('/logout',   logout);
router.get ('/me',       protect, getMe);
router.put ('/username', protect, changeUsername);
router.put ('/password', protect, changePassword);

module.exports = router;
