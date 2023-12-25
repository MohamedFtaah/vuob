const express = require('express');
const router = express.Router();

//Controller
const {
  getAllPermissions,
  getPermissionByID,
  addPermission,
  updatePermission,
  deletePermission,
} = require('./controller');

//Middleware
const { userAuth } = require('../../../middleware/auth');

//GET

//POST

//PATCH

//DELETE

module.exports = router;
