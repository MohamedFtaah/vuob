//Models
const Permission = require("./model");

//Features
const catchAsync = require("../../../services/catchAsync");


//GET
exports.getAllPermissions = catchAsync(async (req, res, next) => {

  const perms = Permission.find();

  res.status(200).json({
    resault: perms.length,
    data: perms,
  });
});

exports.getPermissionByID = catchAsync(async (req, res, next) => {

  const perm = await Permission.findById(req.params.id);

  res.status(200).json({
    data: perm,
  });

});

//POST
exports.addPermission = catchAsync(async (req, res, next) => {

  const newPerm = await Permission.create({
    name : req.body.name,
    desc : req.body.desc,
    permissions : req.body.permissions,
    accountAdmin: req.user.id,
  });

  res.status(201).json({
    message: "Add new permission done successfully*#*تمت أضافة مجموعة صلاحيات جديد بنجاح",
    data: newPerm,
  });
});

//PATCH
exports.updatePermission = catchAsync(async (req, res, next) => {

  const perm = await Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Update permission done successfully*#*تمت تعديل مجموعة الصلاحيات بنجاح",
    data: perm,
  });
});

//DELETE
exports.deletePermission = catchAsync(async (req, res, next) => {

  await Permission.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Delete permission done successfully*#*تم مسح مجموعة الصلاحيات بنجاح",
  });
  
});
