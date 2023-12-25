const multer = require("multer");
const AppError = require("../../../../services/appError");

const multerStorage = multer.memoryStorage();

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

exports.upoladProductPics = upload.fields([{ name: "photo", maxCount: 4 }]);

upload.array("photo", 4);

exports.uploadProductPic = upload.single("photo");