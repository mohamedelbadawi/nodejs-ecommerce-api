const router = require('express').Router();
const subcategoryRoutes = require('./subcategoryRoutes');
const { auth, allowedTo } = require('../middlewares/TokenHandler')
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeCategoryImage } = require('../services/CategoryServices');
const { createCategoryValidator, getCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/CategoryValidator');

router.route('/').post(auth, allowedTo('admin'), uploadCategoryImage, resizeCategoryImage, createCategoryValidator, createCategory).get(auth, getCategories);
router.route('/:id').get(getCategoryValidator, getCategory).put(updateCategoryValidator, updateCategory).delete(auth, allowedTo('admin'), deleteCategoryValidator, deleteCategory);
router.use('/:categoryId/subcategories', subcategoryRoutes);

module.exports = router;