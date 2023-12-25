const express = require('express');

const userRoutes = require('../global/user/router');
const permissionRoutes = require('../global/permission/router');
const settingRoutes = require('../global/setting/router');

const api = process.env.API;

module.exports = function (app) {
  app.use(express.json());
  app.use(`${api}user`, userRoutes);
  app.use(`${api}permission`, permissionRoutes);
  app.use(`${api}setting`, settingRoutes);
};
