const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllCategories,
  getCategoryByID,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('./controller');

// Middlewares
const { upoladPic, resizeCategoryPic } = require('./middleware');

// GET
router.get('/', getAllCategories);
router.get('/:id', getCategoryByID);

// POST
router.post('/', [upoladPic, resizeCategoryPic], addCategory);

// PATCH
router.patch('/:id', [upoladPic, resizeCategoryPic], updateCategory);

// DELETE
router.delete('/:id', deleteCategory);

module.exports = router;
