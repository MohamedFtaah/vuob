const express = require('express');

const schemaRoutes = require('./schema/router');

const api = process.env.API;
const {
  userAuth,
  superAdminAuthorization,
} = require('../../../middleware/auth');
module.exports = function (app) {
  app.use(express.json());
  app.use(userAuth);
  app.use(superAdminAuthorization);
  app.use(`${api}schema`, schemaRoutes);
};
