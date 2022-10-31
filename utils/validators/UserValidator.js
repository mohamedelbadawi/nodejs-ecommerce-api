const { check } = require('express-validator');
const slugify = require('slugify');
const argon = require("argon2")
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');
const User = require('../../models/User');

exports.createUserValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('name must be shorter than 32 chars').custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid").custom((val) => User.findOne({ email: val }).then((user) => {
        if (user) { return Promise.reject(new Error('this email is already used')) }
    })),
    check('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('Password is must be at least 8 chars').custom((password, { req }) => {
        if (password !== req.body.passwordConfirmation) {
            throw new Error('Password Confirmation in incorrect')
        }
        return true;
    }),
    check('passwordConfirmation').notEmpty().withMessage('Password confirmation is required'),
    check('profileImg').optional(),

    check('phone').isMobilePhone("ar-EG"),
    validatorMiddleware];
exports.getUserValidator = [
    check('id').exists().withMessage('User id is required').isMongoId().withMessage('User id is invalid'),
    validatorMiddleware
]
exports.updateUserValidator = [
    check('name').exists().withMessage('Name field is required').notEmpty().withMessage('Name field must be not empty').isLength({ min: 3 }).withMessage("name must be longer than 3 chars")
        .isLength({ max: 32 }).withMessage('name must be shorter than 32 chars').custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid").custom((val) => User.findOne({ email: val }).then((user) => {
        if (user) { return Promise.reject(new Error('this email is already used')) }
    })),
    check('profileImg').optional(),

    check('phone').isMobilePhone("ar-EG"), validatorMiddleware
]
exports.deleteUserValidator = [
    check('id').exists().withMessage('User id is required').isMongoId().withMessage('User id is invalid'), validatorMiddleware
]


exports.updateUserPasswordValidator = [
    check('password').exists().withMessage('password is required').isLength({ min: 8 })
        .withMessage('Password is must be at least 8 chars').custom((password, { req }) => {

            if (password !== req.body.passwordConfirmation) {
                throw new Error('Password Confirmation in incorrect')
            }
            return true;
        }),
    check('currentPassword').custom(async (val, { req }) => {
        const user = await User.findById(req.params.id);
        console.log(await argon.verify(user.password, val));
        if (!await argon.verify(user.password, req.body.currentPassword)) {
            throw new Error('current password not right');
        }
        return true
    }),
    validatorMiddleware
]