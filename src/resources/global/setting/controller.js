//Model
const Settings = require("./model");

//Features
const catchAsync = require("../../../services/catchAsync");

//JSON
const setting = require("./settings.json");


//GET
exports.getMaintenance = catchAsync(async (req, res, next) => {
  const maintenance = await Settings.findOne({ name: "maintenance" });

  res.status(200).json({
    data: maintenance,
  });
});

//POST
exports.createSettings = catchAsync(async (req, res, next) => {
  setting.setting.forEach(async (e) => {
    await Settings.create(e);
  });

  res.status(201).json({
    data: "Create setting done successfully*#*تم أنشاء الضبط",
  });
});

//PATCH
exports.enableMaintenance = catchAsync(async (req, res, next) => {
  const maintenance = await Settings.findOne({ name: "maintenance" });
  maintenance.value = true;
  await maintenance.save();

  res.status(200).json({
    data: maintenance,
    message: "The maintenance mode is activated*#*تم تفعيل وضع الصيانة للمنصة",
  });
});

exports.disableMaintenance = catchAsync(async (req, res, next) => {
  const maintenance = await Settings.findOne({ name: "maintenance" });
  maintenance.value = false;
  await maintenance.save();

  res.status(200).json({
    data: maintenance,
    message: "The maintenance mode is inactived*#*تم تعطيل وضع الصيانة للمنصة",
  });
});
