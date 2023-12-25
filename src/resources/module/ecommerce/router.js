const express = require('express');

const categoryRoutes = require('./category/router');
const currencyRoutes = require('./currency/router');
const productRoutes = require('./product/router');
const vendorsRoutes = require('./vendors/router');
const propsRoutes = require('./props/router');
const brandRoutes = require('./brands/router');
const slideRoutes = require('./slides/router');

const api = process.env.API;
const {
  userAuth,
  superAdminAuthorization,
} = require('../../../middleware/auth');
module.exports = function (app) {
  app.use(express.json());
  app.use(userAuth);
  app.use(superAdminAuthorization);
  app.use(`${api}category`, categoryRoutes);
  app.use(`${api}currency`, currencyRoutes);
  app.use(`${api}product`, productRoutes);
  app.use(`${api}vendor`, vendorsRoutes);
  app.use(`${api}prop`, propsRoutes);
  app.use(`${api}brand`, brandRoutes);
  app.use(`${api}slide`, slideRoutes);
};
