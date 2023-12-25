// Model
const Category = require('./model');

// Features
const APIfeatures = require('../../../../services/apiFeatures');
const catchAsync = require('../../../../services/catchAsync');

// Lib
const fs = require('fs');

// Folder direction
const dir = `${__basedir}\\src\\assets\\categories`;
const { pagesCount } = require('../../../../services/functions');
const domain = process.env.DOMAIN;
const port = process.env.PORT;

// GET
exports.getAllCategories = catchAsync(async (req, res) => {
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
  const features = new APIfeatures(Category.find(q), req.query)
    .filter()
    .sort()
    .pagination();

  const categories = await features.query;
  const pages = pagesCount(await Category.countDocuments(q));
  res.status(200).json({
    result: categories.length,
    pages: pages,
    data: categories,
  });
});

exports.getCategoryByID = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.status(200).json({
    data: category,
  });
});

// POST
exports.addCategory = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.img = `${req.protocol}://${domain}:${port}/categories/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    message:
      'New category has been added successfully*#*تمت أضافة فئة جديد بنجاح',
    data: newCategory,
  });
});

// PATCH
exports.updateCategory = catchAsync(async (req, res) => {
  const categoryData = await Category.findById(req.params.id);

  if (req.file) {
    const img = categoryData.img.split('/categories/')[1];
    if (fs.existsSync(`${dir}/${img}`)) {
      fs.unlinkSync(`${dir}/${img}`);
    }
    req.body.img = `${req.protocol}://${domain}:${port}/categories/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'Category has been Modifed successfully*#*تمت تعديل الفئة بنجاح',
    data: category,
  });
});

// DELETE
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  const img = category.img.split('/categories/')[1];
  if (fs.existsSync(`${dir}/${img}`)) {
    fs.unlinkSync(`${dir}/${img}`);
  }
  res.status(200).json({
    message: 'Category has been deleted successfully*#*تم مسح الفئة بنجاح',
  });
});
