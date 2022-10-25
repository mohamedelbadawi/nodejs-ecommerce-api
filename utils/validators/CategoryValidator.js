const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');

exports.createCategoryValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("category name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('category name must be shorter than 32 chars'),
    validatorMiddleware];
exports.getCategoryValidator = [
    check('id').exists().withMessage('category id is required').isMongoId().withMessage('category id is invalid'), validatorMiddleware
]
exports.updateCategoryValidator = [
    check('id').exists().withMessage('category id is required').isMongoId().withMessage('category id is invalid'), validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id').exists().withMessage('category id is required').isMongoId().withMessage('category id is invalid'), validatorMiddleware
]

