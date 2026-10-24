const multer = require('multer');
const { HttpError } = require('../utils/errors');

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB
  fileFilter: (req, file, cb) =>
    ALLOWED.has(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(415, 'Only JPEG, PNG or WebP images are allowed')),
});
