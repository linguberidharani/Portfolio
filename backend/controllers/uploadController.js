const path = require("path");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ---------------- Cloudinary Storage ----------------

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const type = req.query.type || "file";

    return {
      folder: `portfolio/${type}`,
      resource_type: "auto",
      public_id: `${type}-${Date.now()}`,
    };
  },
});

// ---------------- File Filters ----------------

const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) return cb(null, true);

  cb(new Error("Only image files are allowed."));
};

const resumeFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") return cb(null, true);

  cb(new Error("Only PDF files are allowed."));
};

// ---------------- Multer ----------------

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFilter,
});

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: resumeFilter,
});

// ---------------- Controllers ----------------

const handleImageUpload = (req, res) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    res.json({
      success: true,
      message: "Image uploaded.",
      url: req.file.path,
      filename: req.file.filename,
    });
  });
};

const handleResumeUpload = (req, res) => {
  uploadResume.single("resume")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded.",
      });
    }

    res.json({
      success: true,
      message: "Resume uploaded.",
      url: req.file.path,
      filename: req.file.filename,
    });
  });
};

module.exports = {
  handleImageUpload,
  handleResumeUpload,
};