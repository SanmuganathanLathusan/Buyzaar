const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.array('images', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // If on Vercel, we should be uploading to Cloudinary here
  // For now, we return a success message with mock URLs to prevent 500
  const filePaths = req.files.map(file => {
    // In a real scenario, this would be the Cloudinary URL
    return `https://placehold.co/600x400?text=Uplaoded+${file.originalname}`;
  });

  res.send({
    message: 'Images received (Memory Buffer). PERSISTENCE REQUIRES CLOUDINARY ON VERCEL.',
    urls: filePaths
  });
});

module.exports = router;
