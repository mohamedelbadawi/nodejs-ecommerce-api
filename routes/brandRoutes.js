const router = require('express').Router();
const { updateBrand, getBrand, deleteBrand, getBrands, createBrand } = require('../services/BrandServices');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/BrandValidator');

router.route('/').post(createBrandValidator, createBrand).get(getBrands);
router.route('/:id').get(getBrandValidator, getBrand).put(updateBrandValidator, updateBrand).delete(deleteBrandValidator, deleteBrand);

module.exports = router;