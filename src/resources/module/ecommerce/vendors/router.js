const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllVendors,
  getVendorByID,
  addVendor,
  updateVendor,
  reduceVendorNumber,
  deleteVendor,
} = require('./controller');

// Middlewares

// GET
router.get('/', getAllVendors);
router.get('/:id', getVendorByID);

// POST
router.post('/', addVendor);

// PATCH
router.patch('/:id', updateVendor);

//DELETE
router.delete('/:id', deleteVendor);

module.exports = router;
