const router = require('express').Router({ mergeParams: true });

const { createSubcategory, getSubcategories, getSubcategory, updateSubcategory, deleteSubcategory } = require('../services/SubcategoryServices');
const { deleteCategoryValidator } = require('../utils/validators/CategoryValidator');
const { createSubcategoryValidator, getSubcategoryValidator } = require('../utils/validators/subcategoryValidator');
const { auth, allowedTo } = require('../middlewares/TokenHandler')

router.route("/").post(auth, allowedTo('admin', 'supervisor'), createSubcategoryValidator, createSubcategory).get(getSubcategories)
router.route("/:id").get(getSubcategoryValidator, getSubcategory).put(auth, allowedTo('admin', 'supervisor'), updateSubcategory, updateSubcategory).delete(auth, allowedTo('admin'), deleteCategoryValidator, deleteSubcategory)
module.exports = router; 