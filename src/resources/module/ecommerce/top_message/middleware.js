// Lib
const multer = require('multer');
const sharp = require('sharp');

// Features
const AppError = require('../../../../services/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'This file is not an image! Please upload an image*#*هذا الملف ليس صورة من فضلك قم برفع صورة',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.upoladPic = upload.single('photo');

exports.resizeSlidePic = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `slide-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(1920, 1080, {
      fit: 'fill',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`src/assets/slides/${req.file.filename}`);

  next();
};
