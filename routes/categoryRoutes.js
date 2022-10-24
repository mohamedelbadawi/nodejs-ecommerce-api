const router = require('express').Router();
const subcategoryRoutes = require('./subcategoryRoutes');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('../services/CategoryServices');
const { createCategoryValidator, getCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/CategoryValidator');

router.route('/').post(createCategoryValidator, createCategory).get(getCategories);
router.route('/:id').get(getCategoryValidator, getCategory).put(updateCategoryValidator, updateCategory).delete(deleteCategoryValidator, deleteCategory);
router.use('/:categoryId/subcategories', subcategoryRoutes);

module.exports = router;