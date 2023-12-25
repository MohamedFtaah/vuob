// Lib
const multer = require("multer");
const sharp = require("sharp");

// Features
const AppError = require("../../../../services/appError");


const multerStorage = multer.memoryStorage();

const multerLogo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/logo");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `logo.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "This file is not an image! Please upload an image*#*هذا الملف ليس صورة من فضلك قم برفع صورة",
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

exports.upoladPic = upload.single("photo");

exports.resizeCategoryPic = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `category-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(1200, 800, {
      fit: "fill",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/assets/categories/${req.file.filename}`);

  next();
};

exports.resizeSlidePic = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `slide-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(1600, 800, {
      fit: "fill",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/assets/slides/${req.file.filename}`);

  next();
};

exports.resizeOfferPic = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `slide-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(1600, 800, {
      fit: "fill",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/assets/offers/${req.file.filename}`);

  next();
};

exports.addLogo = (req, res, next) => {
  if (!req.file) return next();
  const ext = (req.file.filename = `logo${req.file.exct}`);

  sharp(req.file.buffer).toFile(`src/assets/logo/${req.file.filename}`);
  next();
};
