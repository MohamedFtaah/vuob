const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllCurrencies,
  getCurrencyByID,
  getDefaultCurr,
  addCurrency,
  updateCurrency,
  setDefaultCurr,
  deleteCurrency,
  checkDefaultCurr,
  addDefaultCurrency,
} = require('./controller');

// Middlewares

// GET
router.get('/', getAllCurrencies);
router.get('/default/get', getDefaultCurr);
router.get('/default/check', checkDefaultCurr);
router.get('/:id/', getCurrencyByID);

// POST
router.post('/', addCurrency);
router.post('/default/post', addDefaultCurrency);

// PATCH
router.patch('/:id', updateCurrency);
router.patch('/:id/setDefault', setDefaultCurr);

// DELETE
router.delete('/:id', deleteCurrency);

module.exports = router;
