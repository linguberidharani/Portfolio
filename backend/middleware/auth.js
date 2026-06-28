const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

// BUG FIX: Added detailed logging to help diagnose auth failures.
// Also handles the case where cookieParser hasn't run (shouldn't happen with correct middleware order).
const protect = async (req, res, next) => {
  try {
    // Read token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      // Help diagnose: log what cookies were actually received
      console.warn('[Auth] No token cookie found. Cookies received:', Object.keys(req.cookies || {}));
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin to request
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = { protect };
