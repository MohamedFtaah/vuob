// models
const User = require('../resources/global/user/model');

// features
const catchAsync = require('../services/catchAsync');
const AppError = require('../services/appError');

// env
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

// libs
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// Authentication
exports.userAuth = catchAsync(async (req, res, next) => {
  const tokenData = req.cookies.token || req.headers['authorization'];
  let token;

  if (tokenData != null || undefined) {
    token = tokenData.split(' ')[1];
  }
  if (!tokenData) {
    return next(
      new AppError('Please login first*#*من فضلك قم بتسجيل الدخول اولا', 401)
    );
  }
  let t;
  if (process.env.DEV_ENV === 'BACK') {
    t = tokenData;
  } else {
    t = token;
  }
  const decoded = await promisify(jwt.verify)(t, process.env.JWT_SECRET);

  const user = await User.findById(decoded.payload.id);

  if (!user.status) {
    return next(
      new AppError(
        'Sorry this account has been suspended please contact with your account admin or the super admin*#*عذراً هذا الحساب معطل برجاء التواصل مع مدير الحساب الخاص بك أو مدير المنصة',
        401
      )
    );
  }

  if (!user) {
    return next(
      new AppError(
        "You can't enter this page please login first*#*لا يمكنك دخول هذه الصفحة من فضلك قم بتسجيل الدخول اولا",
        401
      )
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'You changed password recently please login again*#*لقد قمت بتغيير كلمه السر مؤخرا من فضلك قم باعاده تسجيل الدخول مره اخرى',
        401
      )
    );
  }
  req.user = user;

  next();
});

// Authorization
exports.userAuthorization = catchAsync(async (req, res, next) => {
  if (req.user.type != 'user') {
    return next(
      new AppError(
        'You do not have permission to access*#*انتا لا تمتلك تصريح لدخول هذه الصفحة',
        401
      )
    );
  }

  next();
});

// Authorization Types
exports.superAdminAuthorization = catchAsync(async (req, res, next) => {
  if (req.user.type != 'superAdmin') {
    return next(
      new AppError(
        'You do not have permission to access*#*انتا لا تمتلك تصريح لدخول هذه الصفحة',
        401
      )
    );
  }

  next();
});
