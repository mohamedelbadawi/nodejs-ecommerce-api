const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');

exports.createSubcategoryValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 2 }).withMessage("Subcategory name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('Subcategory name must be shorter than 32 chars'),
    check('category').exists().withMessage('category id field is required').notEmpty().withMessage('category id field must be not empty').isMongoId().withMessage("category id is invalid"),
    validatorMiddleware];


    
exports.getSubcategoryValidator = [
    check('id').exists().withMessage('subcategory id is required').isMongoId().withMessage('subcategory id is invalid'), validatorMiddleware
]
exports.updateSubcategoryValidator = [
    check('id').exists().withMessage('subcategory id is required').isMongoId().withMessage('subcategory id is invalid'),
    check('name').exists().withMessage('subcategory id is required').isMongoId().withMessage('subcategory id is invalid'),
    check('category').exists().withMessage('category id is required').isMongoId().withMessage('category id is invalid'), validatorMiddleware
]
exports.deleteSubcategoryValidator = [
    check('id').exists().withMessage('subcategory id is required').isMongoId().withMessage('subcategory id is invalid'), validatorMiddleware
]
