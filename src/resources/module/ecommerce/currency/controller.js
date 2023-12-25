// Model
const Currency = require('./model');

// Features
const APIfeatures = require('../../../../services/apiFeatures');
const catchAsync = require('../../../../services/catchAsync');
const AppError = require('../../../../services/appError');
const { pagesCount } = require('../../../../services/functions');

// GET
exports.getAllCurrencies = catchAsync(async (req, res) => {
  const features = new APIfeatures(Currency.find(), req.query);

  // count docs
  const pages = pagesCount(await Currency.countDocuments());
  const currencies = await features.query;

  res.status(200).json({
    data: {
      num: currencies.length,
      data: currencies,
      pages: pages,
    },
  });
});

exports.getCurrencyByID = catchAsync(async (req, res) => {
  const prop = await Currency.findById(req.params.id);
  res.status(200).json({
    data: prop,
  });
});

exports.checkDefaultCurr = catchAsync(async (req, res) => {
  const defaultCurr = await Currency.countDocuments({ isDefault: true });
  let found = false;
  if (defaultCurr > 0) {
    found = true;
  }
  res.status(200).json({
    data: found,
  });
});

exports.getDefaultCurr = catchAsync(async (req, res) => {
  const defaultCurr = await Currency.find({ isDefault: true });

  res.status(200).json({
    message: `${defaultCurr.name} is the default currency*#* ${defaultCurr.name} العملة الاساسية`,
    data: defaultCurr,
  });
});

// POST

exports.addCurrency = catchAsync(async (req, res) => {
  const count = await Currency.countDocuments();
  if (count < 13) {
    await Currency.create(req.body);
  } else {
    new AppError('Max Currencies number is 13*#*اقصي عدد للعملات هو 13');
  }
  res.status(201).json({
    message:
      'New currency has been added successfully*#*تمت أضافة عملة جديدة بنجاح',
  });
});

exports.addDefaultCurrency = catchAsync(async (req, res) => {
  const currs = await Currency.find();

  if (currs.length == 0) {
    req.body.isDefault = true;
    const newCurrency = await Currency.create(req.body);
    res.status(201).json({
      message:
        'Default currency has been set successfully*#*تمت تعين العملة الافتراضية بنجاح',
      data: newCurrency,
    });
  } else {
    new AppError(
      "There's already default currency*#*يوجد عملة افتراضية بالفعل",
      400
    );
  }
});

// PATCH
exports.updateCurrency = catchAsync(async (req, res) => {
  const curr = await Currency.findById(req.params.id);

  if (curr.isDefault == true) {
    req.body.enabled = true;
  }

  const currency = await Currency.findByIdAndUpdate(curr._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'Currency has been Modifed successfully*#* تمت تعديل العملة بنجاح',
    data: currency,
  });
});

exports.setDefaultCurr = catchAsync(async (req, res) => {
  const def = await Currency.find({ isDefault: true });

  if (def.length !== 0) {
    await Currency.findByIdAndUpdate(
      def[0]._id,
      { isDefault: false, enabled: false },
      { new: true, runValidators: true }
    );
  }

  const newDefault = await Currency.findByIdAndUpdate(
    req.params.id,
    { isDefault: true, val: 1, enabled: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: `${newDefault.name} has been set as default currency*#* كعملة اساسية ${newDefault.name} تم تعين`,
    data: newDefault,
  });
});

// DELETE

exports.deleteCurrency = catchAsync(async (req, res, next) => {
  const curr = await Currency.findById(req.params.id);

  if (curr.isDefault == true) {
    return next(
      new AppError(
        "Default currency can't be deleted*#*لا يمكن حذف العملة الاساسية",
        400
      )
    );
  } else {
    await Currency.findByIdAndDelete(curr._id);
    res.status(200).json({
      message: 'Currency has been deleted successfully*#* تم مسح العملة بنجاح',
    });
  }
});
