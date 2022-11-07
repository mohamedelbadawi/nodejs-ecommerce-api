const { check } = require('express-validator');
const { validatorMiddleware } = require('../../middlewares/ValidatorMiddleware');

exports.updatePaymentValidator = [
    check('status').exists().notEmpty().custom((val) => {

        if (val !== 'paid' && val !== 'canceled') {
            throw new Error('can not update status ');
        }
        return true;
    }),
    validatorMiddleware
]
exports.updateDeliveryValidator = [
    check('status').exists().notEmpty().custom((val) => {

        if (val !== 'delivered' && val !== 'canceled') {
            throw new Error('can not update delivery status ');
        }
        return true;
    }),
    validatorMiddleware
]