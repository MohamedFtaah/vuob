const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllProducts,
  getProductByID,
  addProduct,
  updateProduct,
  addProp,
  removeProp,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  deleteProduct,
  getVendorProducts,
} = require('./controller');

// Middlewares

const { upoladProductPics, uploadProductPic } = require('./middleware');

// GET
router.get('/', getAllProducts);
router.get('/vendor', getVendorProducts);
router.get('/:id', getProductByID);

// POST
router.post('/', [upoladProductPics], addProduct);

// PATCH
router.patch('/:id', updateProduct);

router.patch('/:id/addProp', addProp);

router.patch('/:id/removeProp', removeProp);

router.patch('/:id/addImg', [upoladProductPics], addProductImage);

router.patch('/:id/patchImg', [uploadProductPic], updateProductImage);

router.patch('/:id/deleteImg', deleteProductImage);

// DELETE
router.delete('/:id', deleteProduct);

module.exports = router;
