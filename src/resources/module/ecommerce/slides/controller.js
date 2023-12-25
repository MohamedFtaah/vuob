// Model
const Slide = require('./model');

// Features
const APIfeatures = require('../../../../services/apiFeatures');
const catchAsync = require('../../../../services/catchAsync');

// Lib
const fs = require('fs');

// Folder direction
const dir = `${__basedir}\\src\\assets\\slides`;
const { pagesCount } = require('../../../../services/functions');
const domain = process.env.DOMAIN;
const port = process.env.PORT;
// GET
exports.getAllSlides = catchAsync(async (req, res, next) => {
  const features = new APIfeatures(Slide.find(), req.query)
    .filter()
    .sort()
    .pagination();

  const slides = await features.query;
  const pages = pagesCount(await Slide.countDocuments());
  res.status(200).json({
    result: slides.length,
    pages: pages,
    data: slides,
  });
});

// POST
exports.addSlide = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.img = `${req.protocol}://${domain}:${port}/slides/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  const newSlide = await Slide.create(req.body);

  res.status(201).json({
    message:
      'New slide has been added successfully*#*تمت أضافة شريحة جديد بنجاح',
    data: newSlide,
  });
});

exports.editSlide = catchAsync(async (req, res, next) => {
  const slide = await Slide.findById(req.params.id);

  if (req.file) {
    const img = slide.img.split('/slides/')[1];
    if (fs.existsSync(`${dir}/${img}`)) {
      fs.unlinkSync(`${dir}/${img}`);
    }
    req.body.img = `${req.protocol}://${domain}:${port}/slides/${req.file.filename}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  await Slide.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'Slide has been Modifed successfully*#*تم تعديل الشريحة بنجاح',
  });
});

// DELETE
exports.deleteSlide = catchAsync(async (req, res, next) => {
  const slide = await Slide.findByIdAndDelete(req.params.id);
  const img = slide.img.split('/slides/')[1];
  if (fs.existsSync(`${dir}/${img}`)) {
    fs.unlinkSync(`${dir}/${img}`);
  }
  res.status(200).json({
    message: 'Slide has been deleted successfully*#*تم مسح الشريحة بنجاح',
  });
});
