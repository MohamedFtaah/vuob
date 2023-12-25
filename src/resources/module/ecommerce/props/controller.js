// Model
const Prop = require('./model');

// Features
const APIfeatures = require('../../../../services/apiFeatures');
const catchAsync = require('../../../../services/catchAsync');

// Lib
const fs = require('fs');

const { pagesCount } = require('../../../../services/functions');

// GET
exports.getAllprops = catchAsync(async (req, res, next) => {
  let q;
  if (req.query.q) {
    q = {
      $or: [
        {
          [`name.${req.headers.lang}`]: { $regex: req.query.q, $options: 'i' },
        },
      ],
    };
  } else {
    q = {};
  }
  const features = new APIfeatures(Prop.find(q).select('name trans'), req.query)
    .filter()
    .sort()
    .pagination();

  const props = await features.query;
  const pages = pagesCount(await Prop.countDocuments(q));
  res.status(200).json({
    result: props.length,
    pages: pages,
    data: props,
  });
});

exports.getPropByID = catchAsync(async (req, res, next) => {
  const prop = await Prop.findById(req.params.id);
  res.status(200).json({
    data: prop,
  });
});

// POST
exports.addProp = catchAsync(async (req, res, next) => {
  const newProp = await Prop.create(req.body);

  res.status(201).json({
    message:
      'New prop has been added successfully*#*تمت أضافة خاصية جديد بنجاح',
    data: newProp,
  });
});

// PATCH
exports.updateProp = catchAsync(async (req, res, next) => {
  const prop = await Prop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'Prop has been Modifed successfully*#*تمت تعديل الخاصية بنجاح',
    data: prop,
  });
});

// DELETE
exports.deleteProp = catchAsync(async (req, res, next) => {
  await Prop.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: 'Prop has been deleted successfully*#*تم مسح الخاصية بنجاح',
  });
});
