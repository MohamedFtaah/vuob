const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllSchemas,
  getSchemaById,
  getSchemasForUser,
  addSchema,
  enabledSchema,
  disableSchema,
  addColumn,
  deleteColumn,
  updateSchema,
  updateColumn,
  deleteSchema,
  setAsDefault,
  getDefaultSchema,
} = require('./controller');

// Middleware

//GET
router.get('/', getAllSchemas);
router.get('/user/all', getSchemasForUser);
router.get('/user/default', getDefaultSchema);
router.get('/:id', getSchemaById);

//POST
router.post('/', addSchema);

//PATCH
router.patch('/:id/addColumn', addColumn);
router.patch('/:id/editColumn', updateColumn);
router.patch('/:id/deleteColumn', deleteColumn);
router.patch('/:id/enable', enabledSchema);
router.patch('/:id/disable', disableSchema);
router.patch('/:id', updateSchema);
router.patch('/:id/default', setAsDefault);

//DELETE
router.delete('/:id', deleteSchema);

module.exports = router;
