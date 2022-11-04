const { check } = require("express-validator");
const { validatorMiddleware } = require("../../middlewares/ValidatorMiddleware");
const Product = require('../../models/Product')

exports.addProductToWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid product id').exists().custom(async (val, { req }) => {
        const product = await Product.findById(val);
        if (!product) {
            return Promise.reject(new Error('there is no product with this id'));
        }
    }),
    validatorMiddleware
]
exports.removeProductFromWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid product id').exists().custom(async (val, { req }) => {
        const product = await Product.findById(val);
        if (!product) {
            return Promise.reject(new Error('there is no product with this id'));
        }
    }),
    validatorMiddleware
]

