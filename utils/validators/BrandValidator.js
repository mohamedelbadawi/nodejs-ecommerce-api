const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');

exports.createBrandValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("Brand name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('Brand name must be shorter than 32 chars'),
    validatorMiddleware];
exports.getBrandValidator = [
    check('id').exists().withMessage('Brand id is required').isMongoId().withMessage('Brand id is invalid'),
    validatorMiddleware
]
exports.updateBrandValidator = [
    check('id').exists().withMessage('Brand id is required').isMongoId().withMessage('Brand id is invalid'),
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("Brand name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('Brand name must be shorter than 32 chars'), validatorMiddleware
]
exports.deleteBrandValidator = [
    check('id').exists().withMessage('Brand id is required').isMongoId().withMessage('Brand id is invalid'), validatorMiddleware
]

