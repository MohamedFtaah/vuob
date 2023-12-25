const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllSlides,
  addSlide,
  deleteSlide,
  editSlide,
} = require('./controller');

// Middlewares
const { upoladPic, resizeSlidePic } = require('./middleware');

// GET
router.get('/', getAllSlides);

// POST
router.post('/', [upoladPic, resizeSlidePic], addSlide);

// PATCH
router.patch('/:id', editSlide);

// DELETE
router.delete('/:id', deleteSlide);

module.exports = router;
