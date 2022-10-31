const router = require('express').Router();
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/ProductValidator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadProductImages, resizeProductImages } = require('../services/ProductServices')

router.route('/').post(uploadProductImages, resizeProductImages, createProductValidator, createProduct).get(getProducts);
router.route('/:id').get(getProductValidator, getProduct).put(updateProductValidator, updateProduct).delete(deleteProductValidator, deleteProduct);

module.exports = router;