//Model
const Product = require("./model");

//Features
const APIfeatures = require("../../../../services/apiFeatures");
const catchAsync = require("../../../../services/catchAsync");

//Lib
const sharp = require("sharp");
const fs = require("fs");

//Folder direction
const dir = `${__basedir}\\src\\assets\\products`;
const { pagesCount } = require("../../../../services/functions");

//GET
exports.getAllProducts = catchAsync(async (req, res, next) => {
  let q;
  if (req.query.q) {
    q = {
      $or: [
        {
          name: { $regex: req.query.q, $options: "i" },
        },
      ],
    };
  } else {
    q = {};
  }
  const features = new APIfeatures(Product.find(q), req.query)
    .filter()
    .sort()
    .pagination();

  const products = await features.query;
  const pages = pagesCount(await Product.countDocuments(q));
  res.status(200).json({
    result: products.length,
    pages: pages,
    data: products,
  });
});

exports.getProductByID = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    data: product,
  });
});

exports.getVendorProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ vendor: req.user.id });

  res.status(200).json({
    result: products.length,
    data: products,
  });
});

//POST
exports.addProduct = catchAsync(async (req, res, next) => {
  if (req.files.photo) {
    req.body.imgs = [];

    req.files.photo.forEach((file, i) => {
      const filename = `product-${req.body.name}-${i + 1}.jpeg`;
      req.body.imgs.push(filename);
    });
    req.body.card_img = req.body.imgs[0];
    const newProduct = await Product.create(req.body);
    req.files.photo.map(async (file, i) => {
      const filename = `product-${req.body.name}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: "fill",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/assets/products/${filename}`);
      req.body.imgs.push(filename);
    });
    res.status(201).json({
      message:
        "New product has been added successfully*#*تمت أضافة منتج جديد بنجاح",
      product: newProduct,
    });
  } else {
    res.status(400).json({
      message:
        "Please upload images for the product*#*من فضلك قم برفع صور للمنتج",
    });
  }
});

//PATCH
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Product has been Modifed successfully*#* تمت تعديل المنتج بنجاح",
    data: product,
  });
});

exports.addProp = catchAsync(async (req, res, next) => {
  await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { props: req.body.prop } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message:
      "Property has been added successfully to product*#*تمت تعديل اضافة الخاصية بنجاح للمنتج",
  });
});

exports.removeProp = catchAsync(async (req, res, next) => {
  await Product.findByIdAndUpdate(req.params.id, {
    $pull: { props: req.body.prop },
  });
  res.status(200).json({
    message:
      "Property has been added successfully to product*#*تمت تعديل اضافة الخاصية بنجاح للمنتج",
  });
});

exports.updateProductImage = catchAsync(async (req, res, next) => {
  if (req.file) {
    let filename = `${req.body.img}`;
    if (!req.body.img) {
      res.status(400).json({
        message:
          "Please choose the image you want to change*#*من فضلك قم باختيار الصورة المراد تعديلها",
      });
    } else {
      sharp(req.file.buffer)
        .resize(1200, 1200, {
          fit: "fill",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`src/assets/products/${filename}`);

      res.status(200).json({
        message:
          "Product image has been Modifed successfully*#*تمت تعديل صورة المنتج بنجاح",
      });
    }
  } else {
    res.status(400).json({
      message:
        "Please upload images for the product*#*من فضلك قم برفع صور للمنتج",
    });
  }
});

exports.addProductImage = catchAsync(async (req, res, next) => {
  let newImages = [];

  const product = await Product.findById(req.params.id);
  if (req.files) {
    if (
      product.imgs.length < 4 &&
      req.files.photo.length < 4 - product.imgs.length + 1
    ) {
      req.files.photo.map(async (file, i) => {
        const filename = `product-${product.name}-${
          product.imgs.length + i
        }-added.jpeg`;
        sharp(file.buffer)
          .resize(1200, 1200, {
            fit: "fill",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`src/assets/products/${filename}`);
        newImages.push(filename);
      });

      await Product.findByIdAndUpdate(req.params.id, {
        $push: { imgs: { $each: newImages } },
      });

      res.status(200).json({
        message: "Images has uploaded successfully*#*تم رفع الصور بنجاح",
      });
    } else {
      res.status(400).json({
        message: "Max number for product images is 4*#*أقصي عدد لصور للمنتج 4",
      });
    }
  } else {
    res.status(400).json({
      message:
        "Please upload images for the product*#*من فضلك قم برفع صور المنتج",
    });
  }
});

exports.deleteProductImage = catchAsync(async (req, res, next) => {
  let filename = `${req.body.img}`;

  if (!req.body.img) {
    res.status(400).json({
      message:
        "Please choose the image you want to delete*#*من فضلك قم باختيار الصورة المراد حذفها",
    });
  } else {
    if (fs.existsSync(`${dir}\\${filename}`)) {
      const product = await Product.findById(req.params.id);
      if (product.imgs.length <= 1) {
        res.status(400).json({
          message:
            "You cannot delete all product imges*#*لا يمكن حذف جميع صور المنتج",
        });
      } else {
        await Product.findByIdAndUpdate(req.params.id, {
          $pull: { imgs: req.body.img },
        });
        fs.unlinkSync(`${dir}\\${filename}`);
        res.status(200).json({
          message:
            "Product image has been deleted successfully*#*تمت حذف صورة المنتج بنجاح",
        });
      }
    } else {
      res.status(400).json({
        message: "Image not found*#*هذه الصورة غير موجودة",
      });
    }
  }
});

// DELETE
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  await Product.findByIdAndDelete(req.params.id);
  if (product.imgs.length != 0) {
    product.imgs.forEach((e) => {
      if (fs.existsSync(`${dir}\\${e}`)) {
        fs.unlinkSync(`${dir}\\${e}`);
      }
    });
  }

  res.status(200).json({
    message: "Product has been deleted successfully*#*تم مسح المنتج بنجاح",
  });
});
