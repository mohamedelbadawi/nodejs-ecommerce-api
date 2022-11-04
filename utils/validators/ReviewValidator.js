const { check, param } = require('express-validator');

const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');
const Review = require('../../models/Review');

exports.createReviewValidator = [
    check('rate').exists().withMessage('rate field is required').notEmpty().withMessage('rate field must be not empty'),
    check('user').isMongoId().withMessage('user id is invalid'),
    check('rate').isFloat(({ min: 1, max: 5 })),
    check('product').isMongoId().withMessage('product id is invalid'),
    validatorMiddleware];
exports.getReviewValidator = [
    check('id').exists().withMessage('Review id is required').isMongoId().withMessage('Review id is invalid'),
    validatorMiddleware
]
exports.updateReviewValidator = [
    check('rate').exists().withMessage('rate field is required').notEmpty().withMessage('rate field must be not empty'),
    check('rate').isFloat(({ min: 1, max: 5 })),
    check('product').isMongoId().withMessage('product id is invalid'),
    param('id').custom(async (val, { req }) => {
        const review = await Review.findById(val);

        if (!review) {
            return Promise.reject(new Error('there is no review with this id'))
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(new Error(`you don't have access to update this review`))
        }
    })
    , validatorMiddleware
]
exports.deleteReviewValidator = [
    check('id').exists().withMessage('Review id is required').isMongoId().withMessage('Review id is invalid').custom(async (val, { req }) => {
        const review = await Review.findById(val);

        if (!review) {
            return Promise.reject(new Error('there is no review with this id'))
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(new Error(`you don't have access to update this review`))
        }
    })
    , validatorMiddleware
]

