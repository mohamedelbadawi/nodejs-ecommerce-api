const router = require('express').Router();

const { createSubcategory, getSubcategories, getSubcategory, updateSubcategory, deleteSubcategory } = require('../services/SubcategoryServices');
const { deleteCategoryValidator } = require('../utils/validators/CategoryValidator');
const { createSubcategoryValidator, getSubcategoryValidator } = require('../utils/validators/subcategoryValidator');


router.route("/").post(createSubcategoryValidator, createSubcategory).get(getSubcategories)
router.route("/:id").get(getSubcategoryValidator, getSubcategory).put(updateSubcategory, updateSubcategory).delete(deleteCategoryValidator, deleteSubcategory) 
module.exports = router; 