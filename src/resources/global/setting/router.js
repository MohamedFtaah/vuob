const express = require('express');
const router = express.Router();

//Controller
const {
  getMaintenance,
  enableMaintenance,
  disableMaintenance,
  createSettings,
} = require('./controller');

//Middleware
const { userAuth } = require('../../../middleware/auth');

//GET
router.get('/getMaintenance', userAuth, getMaintenance);

//POST
router.post('/create', userAuth, createSettings);

//PATCH
router.patch('/enableMaintenance', userAuth, enableMaintenance);
router.patch('/disableMaintenance', userAuth, disableMaintenance);

module.exports = router;
