const router = require('express').Router();
const { allowedTo, auth } = require('../middlewares/TokenHandler');
const { updateBrand, getBrand, deleteBrand, getBrands, createBrand, uploadBrandImage, resizeBrandImage } = require('../services/BrandServices');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/BrandValidator');

router.route('/').post(auth, allowedTo('admin', 'supervisor'), uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand).get(getBrands);
router.route('/:id').get(getBrandValidator, getBrand).put(auth, allowedTo('admin', 'supervisor'), updateBrandValidator, updateBrand).delete(auth, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;