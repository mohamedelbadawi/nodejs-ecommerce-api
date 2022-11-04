const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');

exports.createCouponValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("Coupon name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('Coupon name must be shorter than 32 chars'),
    check('expire').isDate().exists(),
    check('discount').exists().isNumeric(),
    validatorMiddleware];
exports.getCouponValidator = [
    check('id').exists().withMessage('Coupon id is required').isMongoId().withMessage('Coupon id is invalid'),
    validatorMiddleware
]
exports.updateCouponValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("Coupon name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('Coupon name must be shorter than 32 chars'),
    check('expire').isDate().exists(),
    check('discount').exists().isNumeric(), validatorMiddleware
]
exports.deleteCouponValidator = [
    check('id').exists().withMessage('Coupon id is required').isMongoId().withMessage('Coupon id is invalid'), validatorMiddleware
]

