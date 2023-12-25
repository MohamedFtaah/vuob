//Model
const User = require('./model');

//Features
const catchAsync = require('../../../services/catchAsync');
const AppError = require('../../../services/appError');
const Email = require('../../../services/email');
const ApiFeatures = require('../../../services/apiFeatures');

//Functions
const { signToken } = require('../../../services/token');

//Libraries
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { pagesCount, pagesCountHalf } = require('../../../services/functions');

// config enviornment vairables
dotenv.config({ path: 'src/config/config.env' });

// cookies options
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

//GET
exports.getUsers = catchAsync(async (req, res, next) => {
  let q;
  if (req.query.q) {
    q = {
      $or: [
        { email: { $regex: req.query.q, $options: 'i' }, type: 'user' },
        { name: { $regex: req.query.q, $options: 'i' }, type: 'user' },
      ],
    };
  } else {
    q = { type: 'user' };
  }
  const features = new ApiFeatures(
    User.find(q).select('email name status'),
    req.query
  )
    .filter()
    .pagination()
    .sort()
    .limit();

  // count docs
  const pages = pagesCount(await User.countDocuments(q));
  const users = await features.query;

  res.status(200).json({
    data: {
      num: users.length,
      data: users,
      pages: pages,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    data: {
      data: user,
    },
  });
});

exports.getUsersDialog = catchAsync(async (req, res, next) => {
  let q;
  if (req.query.q) {
    q = {
      $or: [
        { email: { $regex: req.query.q, $options: 'i' }, type: 'user' },
        { name: { $regex: req.query.q, $options: 'i' }, type: 'user' },
      ],
    };
  } else {
    q = { type: 'user' };
  }
  const features = new ApiFeatures(User.find(q), req.query)
    .filter()
    .pagination()
    .sort()
    .limit();

  // count docs
  const pages = pagesCountHalf(await User.countDocuments(q));
  const users = await features.query;

  res.status(200).json({
    data: {
      num: users.length,
      data: users,
      pages: pages,
    },
  });
});

exports.getUsersDialogVendors = catchAsync(async (req, res, next) => {
  let q;
  if (req.query.q) {
    q = {
      $or: [
        {
          email: { $regex: req.query.q, $options: 'i' },
          type: 'user',
          'modules.name': 'estore',
        },
        {
          name: { $regex: req.query.q, $options: 'i' },
          type: 'user',
          'modules.name': 'estore',
        },
      ],
    };
  } else {
    q = { type: 'user', 'modules.name': 'estore' };
  }
  const features = new ApiFeatures(User.find(q), req.query)
    .filter()
    .pagination()
    .sort()
    .limit();

  // count docs
  const pages = pagesCountHalf(await User.countDocuments(q));
  const users = await features.query;

  res.status(200).json({
    data: {
      num: users.length,
      data: users,
      pages: pages,
    },
  });
});

//POST
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Please enter email and password*#*من فضلك ادخل الايميل و كلمة المرور',
        400
      )
    );
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'Email or password are incorrect*#*البريد الالكترونى او كلمة المرور غير صحيح',
        400
      )
    );
  }

  if (!user.status) {
    return next(
      new AppError(
        'Sorry this account has been suspended please contact with your account admin or the super admin*#*عذراً هذا الحساب معطل برجاء التواصل مع مدير الحساب الخاص بك أو مدير المنصة',
        401
      )
    );
  }

  if (user.type !== 'superAdmin') {
    return next(
      new AppError(
        'Email or password are incorrect*#*البريد الالكترونى او كلمة المرور غير صحيح',
        401
      )
    );
  }

  const token = signToken({ id: user._id, type: user.type });
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    token: token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      type: user.type,
      module: user.modules,
    },
    message: 'You are successfully logged in*#*تم تسجيل دخولك بنجاح',
  });
});

exports.addUser = catchAsync(async (req, res, next) => {
  const userFound = await User.findOne({ email: req.body.email });

  if (userFound)
    return next(
      new AppError(
        'This email is already used by another user*#*هذا الايميل مستخدم بالفعل',
        400
      )
    );

  const user = await User.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    message: 'Add user done successfully*#*اضافة المستخدم تمت بنجاح',
    data: user,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        'Please add valid email address*#*من فضلك ادخل بريد الكترونى صحيح',
        400
      )
    );
  }

  // generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const api = process.env.FALLBACK;

  try {
    const resetUrl = `${req.protocol}://${api}/#/new-password/${resetToken}`;
    await new Email(user, resetUrl).send(
      'userPasswordReset',
      'Medica | Reset Password'
    );

    res.status(200).json({
      message:
        'reset password link send to your email*#*تم ارسال اللينك الى الايميل الخاص بك',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Email doesn't send please try again*#*لم يتم ارسال الايميل من فضلك حاول مره اخرى ",
        403
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(
        'This link is invalid,please try again to reset password*#*هذا الرابط اصبح غير متاح , قم باعاده تغيير كلمه المرور مره اخرى',
        403
      )
    );
  }

  const { password, passwordConfirm } = req.body;

  if (!(password && passwordConfirm))
    return next(
      new AppError(
        "Please enter the new password and it's confirm*#*من فضلك ادخل كلمة السر الجديده وتأكيدها",
        400
      )
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;

  await user.save();

  const token = signToken({ id: user._id, type: user.type });

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    token: token,
    message: 'Chagne password done successfully*#*تم تغيير كلمة المرور بنجاح',
  });
});

//PATCH
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(
      new AppError('Please login first*#*من فضلك قم بتسجيل الدخول اولا', 401)
    );
  }

  if (
    !(req.body.currentPassword || req.body.password || req.body.passwordConfirm)
  ) {
    return next(
      new AppError(
        'Please enter the current password and the new*#*من فضلك قم بادخال الباسورد الحالى والجديد',
        400
      )
    );
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError('Current Password is incorrect*#*كلمه السر هذه خاطئه', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = signToken({ id: user._id, type: user.type });

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    token,
    message: 'Password changed successfully*#*تم تغيير كلمة المرور بنجاح',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(
      new AppError('Please login first*#*من فضلك قم بتسجيل الدخول اولا', 401)
    );
  }

  if (
    !(req.body.currentPassword || req.body.password || req.body.passwordConfirm)
  ) {
    return next(
      new AppError(
        'Please enter the current password and the new*#*من فضلك قم بادخال الباسورد الحالى والجديد',
        400
      )
    );
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(
      new AppError('Current Password is incorrect*#*كلمه السر هذه خاطئه', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = signToken({ id: user._id, type: user.type });

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    token,
    message: 'Password changed successfully*#*تم تغيير كلمة المرور بنجاح',
  });
});

exports.editUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'User has updated successfully*#*تم تعديل بيانات المستخدم بنجاح',
    data: user,
  });
});

// Update Module
exports.vendor = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const m = user.modules;
  const i = m.findIndex((e) => e.name === 'estore');
  if (i > -1) {
    if (user.modules[i].status) {
      user.modules[i].status = false;
    } else {
      user.modules[i].status = true;
    }
  } else {
    user.modules.push({
      name: 'estore',
      status: true,
      type: ['vendor'],
      role: 'admin',
      rules: [],
      info: {},
      validDate: new Date('2999-12-12'),
    });
  }
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'User has updated successfully*#*تم تعديل بيانات المستخدم بنجاح',
    data: user,
  });
});

exports.seller = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user.accountAdmin) {
    user.accountAdmin = user.id;
  }
  const m = user.modules;
  const i = m.findIndex((e) => e.name === 'supplyChain');
  if (i > -1) {
    if (user.modules[i].type.includes('seller')) {
      user.modules[i].type = user.modules[i].type.filter((e) => e !== 'seller');
      if (user.modules[i].type.length === 0) {
        user.modules[i].status = false;
      }
    } else {
      user.modules[i].type.push('seller');
      if (user.modules[i].status === false) {
        user.modules[i].status = true;
      }
    }
  } else {
    user.modules.push({
      name: 'supplyChain',
      status: true,
      type: ['seller'],
      role: 'admin',
      rules: [],
      info: {},
      validDate: new Date('2999-12-12'),
    });
  }
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'User has updated successfully*#*تم تعديل بيانات المستخدم بنجاح',
    data: user,
  });
});

exports.buyer = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const m = user.modules;
  const i = m.findIndex((e) => e.name === 'supplyChain');
  if (i > -1) {
    if (user.modules[i].type.includes('buyer')) {
      user.modules[i].type = user.modules[i].type.filter((e) => e !== 'buyer');
      if (user.modules[i].type.length === 0) {
        user.modules[i].status = false;
      }
    } else {
      user.modules[i].type.push('buyer');
      if (user.modules[i].status === false) {
        user.modules[i].status = true;
      }
    }
  } else {
    user.modules.push({
      name: 'supplyChain',
      status: true,
      type: ['buyer'],
      role: 'admin',
      rules: [],
      info: {},
      validDate: new Date('2999-12-12'),
    });
  }
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: 'User has updated successfully*#*تم تعديل بيانات المستخدم بنجاح',
    data: user,
  });
});

//DELETE
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: 'Delete user done successfully*#*تم ازالة المستخدم بنجاح',
  });
});
