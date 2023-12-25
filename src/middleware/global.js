const Settings = require("../resources/global/setting/model");

const catchAsync = require("../services/catchAsync");
const AppError = require("../services/appError");


exports.checkMaintenance = catchAsync(async (req, res, next) => {
  const Maintenance = await Settings.findOne({ name: "maintenance" });
  const isSuperAdmin = req.user.type === "superAdmin";
  if (!isSuperAdmin) {
    if (Maintenance) {
      if (!Maintenance.value) {
        next();
      } else {
        return next(
          new AppError(
            "Servers are down*#*عذرا المنصة تقوم ببعض الأصلاحات",
            503
          )
        );
      }
    } else {
      next();
    }
  } else {
    next();
  }
});