//Model
const Schema = require("./model");

//Features
const catchAsync = require("../../../../services/catchAsync");
const ApiFeatures = require("../../../../services/apiFeatures");
const AppError = require("../../../../services/appError");

//Functions
const { pagesCount } = require("../../../../services/functions");

//JSON
const defaultColumns = require("./DefaultColumns.json");


//GET
exports.getAllSchemas = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Schema.find(), req.query)
    .filter()
    .sort()
    .pagination();

  const schemas = await features.query;
  const pages = pagesCount(await Schema.countDocuments());

  res.status(200).json({
    pages: pages,
    data: schemas,
  });
});

exports.getSchemasForUser = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Schema.find().select("name default enabled"),
    req.query
  )
    .filter()
    .sort()
    .pagination();

  const schemas = await features.query;
  const pages = pagesCount(await Schema.countDocuments());

  res.status(200).json({
    pages: pages,
    data: schemas,
  });
});

exports.getDefaultSchema = catchAsync(async (req, res, next) => {
  const schema = await Schema.findOne({ default: true }).select("name default");

  res.status(200).json({
    data: schema,
  });
});

exports.getSchemaById = catchAsync(async (req, res, next) => {
  const schema = await Schema.findById(req.params.id);

  res.status(200).json({
    data: schema,
  });
});

//POST
exports.addSchema = catchAsync(async (req, res, next) => {
  req.body.header = defaultColumns.header;
  req.body.item = defaultColumns.item;
  let no = await Schema.count();
  if (no === 0) {
    req.body.default = true;
  }
  const pages = pagesCount(await Schema.countDocuments());
  const newSchema = await Schema.create(req.body);
  const totalNumber = await Schema.count();

  res.status(201).json({
    message:
      "New list has been added successfully*#*تمت أضافة وثيقة جديدة بنجاح",
    data: newSchema,
    pages: pages,
  });
});

//PATCH
exports.updateSchema = catchAsync(async (req, res, next) => {
  const { name, desc } = req.body;
  const schema = await Schema.findByIdAndUpdate(
    req.params.id,
    { name, desc },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "List has been modified successfully*#*تمت تعديل الوثيقة بنجاح",
    data: schema,
  });
});

exports.addColumn = catchAsync(async (req, res, next) => {
  const columnSet = req.body.columnSet;
  const column = req.body.column;
  const schema = await Schema.findById(req.params.id);
  schema[columnSet].push(column);
  await schema.save();

  res.status(200).json({
    message:
      "Column has been added successfully*#*تمت أضافة العمود للوثيقة بنجاح",
  });
});

exports.deleteColumn = catchAsync(async (req, res, next) => {
  const columnSet = req.body.columnSet;
  const columnName = req.body.columnName;
  const schema = await Schema.findById(req.params.id);
  schema[columnSet] = schema[columnSet].filter((e) => e.name !== columnName);
  await schema.save();

  res.status(200).json({
    message:
      "Column has been deleted successfully*#*تمت حذف العمود من الوثيقة بنجاح",
  });
});

exports.updateColumn = catchAsync(async (req, res, next) => {
  const columnSet = req.body.columnSet;
  const columnName = req.body.columnName;
  const column = req.body.column;
  const schema = await Schema.findById(req.params.id);
  const col = schema[columnSet].findIndex((e) => e.name === columnName);
  schema[columnSet][col] = column;
  await schema.save();

  res.status(200).json({
    message: "Column has been modified successfully*#*تمت تعديل العمود بنجاح",
  });
});

exports.enabledSchema = catchAsync(async (req, res, next) => {
  const schema = await Schema.findByIdAndUpdate(
    req.params.id,
    { enabled: true, done: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "List has been enabled successfully*#*تمت تفعيل الوثيقة بنجاح",
    data: schema,
  });
});

exports.disableSchema = catchAsync(async (req, res, next) => {
  const schema = await Schema.findByIdAndUpdate(
    req.params.id,
    { enabled: false },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "List has been disabled successfully*#*تمت تعطيل الوثيقة بنجاح",
    data: schema,
  });
});

exports.setAsDefault = catchAsync(async (req, res, next) => {
  const defaultList = await Schema.findOne({ default: true });
  if (defaultList) {
    defaultList.default = false;
    await defaultList.save();
  }

  const schema = await Schema.findByIdAndUpdate(
    req.params.id,
    { default: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message:
      "List has been set as default successfully*#*تمت تعين الوثيقة كوثيقة افتراضية بنجاح",
    data: schema,
  });
});

//DELETE
exports.deleteSchema = catchAsync(async (req, res, next) => {
  const schema = await Schema.findById(req.params.id);
  if (schema.done) {
    return next(
      new AppError(
        "This list has been enabled before you can't delete it*#* هذا الوثيقة قد فعلت مسبقاً لا يمكنك حذفها"
      )
    );
  }
  await Schema.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "List has been deleted successfully*#*تمت حذف الوثيقة بنجاح",
  });
});







