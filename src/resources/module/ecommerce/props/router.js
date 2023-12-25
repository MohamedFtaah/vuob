const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllprops,
  getPropByID,
  deleteProp,
  addProp,
  updateProp,
} = require('./controller');

// Middlewares

// GET
router.get('/', getAllprops);
router.get('/:id', getPropByID);

// POST
router.post('/', addProp);

// PATCH
router.patch('/:id', updateProp);

// DELETE
router.delete('/:id', deleteProp);

module.exports = router;
