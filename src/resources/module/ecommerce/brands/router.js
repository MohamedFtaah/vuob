const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllBrands,
  addBrand,
  deleteBrand,
  setAtFront,
  editBrand,
} = require('./controller');

// Middlewares
const { upoladPic, resizeBrandPic } = require('./middleware');

// GET
router.get('/', getAllBrands);

// POST
router.post('/', [upoladPic, resizeBrandPic], addBrand);

// PATCH
router.patch('/:id/landing', setAtFront);
router.patch('/:id', [upoladPic, resizeBrandPic], editBrand);
// DELETE
router.delete('/:id', deleteBrand);

module.exports = router;
