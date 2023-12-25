// Model
const Brand = require('./model');

// Features
const APIfeatures = require('../../../../services/apiFeatures');
const catchAsync = require('../../../../services/catchAsync');

// Lib
const fs = require('fs');

// Folder direction
const dir = `${__basedir}\\src\\assets\\brands`;
const { pagesCount } = require('../../../../services/functions');
const domain = process.env.DOMAIN;
const port = process.env.PORT;

// GET
exports.getAllBrands = catchAsync(async (req, res, next) => {
  // query
  let q;
  if (req.query.q) {
    q = {
      $or: [
        {
          name: { $regex: req.query.q, $options: 'i' },
        },
      ],
    };
  } else {
    q = {};
  }
  const features = new APIfeatures(Brand.find(q), req.query)
    .filter()
    .sort()
    .pagination();

  const brands = await features.query;
  const pages = pagesCount(await Brand.countDocuments(q));
  res.status(200).json({
    result: brands.length,
    pages: pages,
    data: brands,
  });
});

exports.getBrandByID = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  res.status(200).json({
    data: brand,
  });
});

exports.getBrandByID = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  res.status(200).json({
    data: brand,
  });
});

// POST
exports.addBrand = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.img = `${req.protocol}://${domain}:${port}/brands/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  // set translation map (Only in form data)
  const translation = new Map();
  Object.entries(req.body.translation).forEach((e) => {
    translation.set(`${e[0]}`, JSON.parse(e[1]));
  });
  req.body.translation = translation;

  const newBrand = await Brand.create(req.body);

  res.status(201).json({
    message:
      'New Brand has been added successfully*#*تمت أضافة ماركة جديدة بنجاح',
    data: newBrand,
  });
});

exports.editBrand = catchAsync(async (req, res, next) => {
  const slide = await Brand.findById(req.params.id);
  if (req.file) {
    const img = slide.img.split('/brands/')[1];
    req.body.img = `${req.protocol}://${domain}:${port}/brands/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (fs.existsSync(`${dir}/${img}`)) {
      fs.unlinkSync(`${dir}/${img}`);
    }
  }

  // set translation map (Only in form data)
  const translation = new Map();
  Object.entries(req.body.translation).forEach((e) => {
    const data = JSON.parse(e[1]);
    translation.set(`${e[0]}`, data);
    console.log(Object.values(data));
  });
  req.body.translation = translation;

  await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    message: 'Brand has been modified successfully*#*تم تعديل الماركة بنجاح',
  });
});

// PATCH
exports.setAtFront = catchAsync(async (req, res, next) => {
  const count = await Brand.countDocuments({ front: true });
  if (req.body.front) {
    if (count >= 5) {
      res.status(400).json({
        message: 'Max number is 5 brands*#*أقصي عدد هو 5 ماركات',
      });
    } else {
      const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        message:
          'Brand has been Modifed successfully*#*تمت تعديل الماركة بنجاح',
        data: brand,
      });
    }
  } else {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: 'Brand has been Modifed successfully*#*تمت تعديل الماركة بنجاح',
      data: brand,
    });
  }
});

// DELETE
exports.deleteBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  const img = brand.img.split('/brands/')[1];
  if (fs.existsSync(`${dir}/${img}`)) {
    fs.unlinkSync(`${dir}/${img}`);
  }
  res.status(200).json({
    message: 'Brand has been deleted successfully*#*تم مسح الماركة بنجاح',
  });
});
