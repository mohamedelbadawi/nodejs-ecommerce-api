const Coupon = require('../models/Coupon');
const factory = require('./handlers');





// @desc create Coupon
// @route POST /api/v1/Coupons
// @access private
exports.createCoupon = factory.createModel(Coupon);

// @desc get list of Coupons
// @route get /api/v1/Coupons
// @access 

exports.getCoupons = factory.getAllModels(Coupon);

// @desc    get Coupon by id
// @route   get /api/v1/Coupons/:id    
// @access    public

exports.getCoupon = factory.getModel(Coupon, 'Coupon');

// @desc update specific Coupon by id
// @route put /api/v1/Coupons/:id
// @access private

exports.updateCoupon = factory.updateModel(Coupon, 'Coupon');

// @desc delete specific Coupon by id
// @route delete /api/v1/Coupons
// @access private
exports.deleteCoupon = factory.deleteModel(Coupon, 'Coupon');