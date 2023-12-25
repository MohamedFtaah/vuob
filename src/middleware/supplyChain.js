// features
const AppError = require("../services/appError");
const catchAsync = require("../services/catchAsync");

// lib
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
  destination : (req , file , cb) => {
      cb(null , 'src/assets/')
  },
  filename : (req , file , cb ) => {
      cb (null, new Date().toISOString().replace(/:/g, '-') + "--" + file.originalname);
  }
})

exports.hasAccountCode = catchAsync(async (req, res, next) => {
  if (!req.user.accountCode) {
    return next(
      new AppError(
        "You can't do any operations before add code*#*لا يمكنك القيام بأى عمليات قبل اضافة الكود",
        406
      )
    );
  }

  next();
});

exports.uploadFile = multer({
    storage : fileStorageEngine,

    limits: {
        fileSize: 1024 * 1024 * 20 // 20mb
    },
    
    fileFilter : (req , file , cb) => {
        cb(null,true); 
    }
})