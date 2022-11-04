const { check } = require("express-validator");
const { validatorMiddleware } = require("../../middlewares/ValidatorMiddleware");
const Product = require('../../models/Product')

exports.addUserAddressValidator = [
    check('alias').exists(),
    check('details').optional(),
    check('phone').isMobilePhone('ar-EG'),
    check('city').exists(),
    check('postalCode').exists(),
    validatorMiddleware
]
exports.removeUserAddressValidator = [
    check('addressId').isMongoId().withMessage('Invalid address id').exists(),
    validatorMiddleware
]

