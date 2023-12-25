const express = require('express');
const router = express.Router();

//Controller
const {
  login,
  getUsers,
  getUserById,
  addUser,
  editUser,
  deleteUser,
  getUsersDialog,
  getUsersDialogVendors,
  vendor,
  seller,
  buyer,
} = require('./controller');

//Middleware
const { userAuth } = require('../../../middleware/auth');

//GET
router.get('/', userAuth, getUsers); // admin login
router.get('/:id', userAuth, getUserById);
router.get('/dialog', userAuth, getUsersDialog);
router.get('/vendors/dialogVendors', userAuth, getUsersDialogVendors);

//POST
router.post('/login', login);
router.post('/', userAuth, addUser);

//PATCH
router.patch('/:id', userAuth, editUser);
router.patch('/:id/vendor', userAuth, vendor);
router.patch('/:id/seller', userAuth, seller);
router.patch('/:id/buyer', userAuth, buyer);

//DELETE
router.delete('/:id', deleteUser);
module.exports = router;
