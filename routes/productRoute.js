const router = require('express').Router();
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/ProductValidator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadProductImages, resizeProductImages } = require('../services/ProductServices');
const { auth, allowedTo } = require('../middlewares/TokenHandler');

router.route('/').post(auth, allowedTo('admin', 'supervisor'), uploadProductImages, resizeProductImages, createProductValidator, createProduct).get(getProducts);
router.route('/:id').get(getProductValidator, getProduct).put(auth, allowedTo('admin', 'supervisor'), updateProductValidator, updateProduct).delete(auth, allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;