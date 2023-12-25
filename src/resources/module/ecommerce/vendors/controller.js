// Model
const Vendor = require("./model");

// Features
const APIfeatures = require("../../../../services/apiFeatures");
const catchAsync = require("../../../../services/catchAsync");

// GET

exports.getAllVendors = catchAsync(async (req, res, next) => {
  const features = new APIfeatures(Vendor.find(), req.query)
    .filter()
    .sort()
    .pagination();

  const props = await features.query;

  res.status(200).json({
    result: props.length,
    data: props,
  });
});

exports.getVendorByID = catchAsync(async (req, res, next) => {
  const prop = await Vendor.findById(req.params.id);

  res.status(200).json({
    data: prop,
  });
});

// POST

exports.addVendor = catchAsync(async (req, res, next) => {
  const newVendor = await Vendor.create(req.body);

  res.status(201).json({
    message:
      "New Vendor has been added successfully*#* تمت أضافة بائع جديد بنجاح",
    data: newVendor,
  });
});

// PATCH

exports.updateVendor = catchAsync(async (req, res, next) => {
  const prop = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message:
      "Vendor has been Modifed successfully*#* تمت تعديل البائع الخصم بنجاح",
    data: prop,
  });
});

exports.reduceVendorNumber = catchAsync(async (req, res, next) => {
  await Vendor.findByIdAndUpdate(req.params.id, {
    $inc: { times: -1, used: 1 },
  });

  res.status(200).json({
    message: "promo code has been used *#* تم استخدام كود الخصم الخاص بك",
  });
});

// DELETE

exports.deleteVendor = catchAsync(async (req, res, next) => {
  await Vendor.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Vendor has been deleted successfully*#* تم مسح البائع بنجاح",
  });
});
