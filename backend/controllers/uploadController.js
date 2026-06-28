const path   = require('path');
const multer = require('multer');
const fs     = require('fs');

// ── Storage configuration ───────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const prefix = req.query.type || 'file'; // profile | project | certificate | resume
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

// ── File filters ────────────────────────────────────────────────────────────

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp).'));
};

const resumeFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') return cb(null, true);
  cb(new Error('Only PDF files are allowed for resume.'));
};

// ── Multer instances ─────────────────────────────────────────────────────────

const uploadImage = multer({
  storage,
  limits:     { fileSize: 5 * 1024 * 1024 },  // 5 MB
  fileFilter: imageFilter,
});

const uploadResume = multer({
  storage,
  limits:     { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: resumeFilter,
});

// ── Controller functions ─────────────────────────────────────────────────────

// POST /api/upload/image  (protected)
// BUG FIX: Removed req.uploadType mutation — filename now reads from req.query.type directly.
// This avoids a race condition where multer reads the filename before uploadType was set.
const handleImageUpload = (req, res, next) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      // Return a proper JSON error (not HTML multer default)
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Make sure the field name is "image".' });
    }

    const fileUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    res.json({ success: true, message: 'Image uploaded.', url: fileUrl, filename: req.file.filename });
  });
};

// POST /api/upload/resume  (protected)
const handleResumeUpload = (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Make sure the field name is "resume".' });
    }

    const fileUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
    res.json({ success: true, message: 'Resume uploaded.', url: fileUrl, filename: req.file.filename });
  });
};

module.exports = { handleImageUpload, handleResumeUpload };
