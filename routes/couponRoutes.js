const router = require('express').Router();
const { allowedTo, auth } = require('../middlewares/TokenHandler');
const { updateCoupon, getCoupon, deleteCoupon, getCoupons, createCoupon, } = require('../services/CouponServices');
const { createCouponValidator, getCouponValidator, updateCouponValidator, deleteCouponValidator } = require('../utils/validators/CouponValidator');

router.route('/').post(auth, allowedTo('admin', 'supervisor'), createCouponValidator, createCoupon).get(auth, allowedTo('admin', 'supervisor'), getCoupons);
router.route('/:id').get(auth, allowedTo('admin', 'supervisor'), getCouponValidator, getCoupon).put(auth, allowedTo('admin', 'supervisor'), updateCouponValidator, updateCoupon).delete(auth, allowedTo('admin'), deleteCouponValidator, deleteCoupon);

module.exports = router;