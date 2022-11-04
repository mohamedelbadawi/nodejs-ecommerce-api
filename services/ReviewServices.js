const factory = require("./handlers");
const Review = require('../models/Review')





exports.createReview = factory.createModel(Review);

// @desc get list of Reviews
// @route get /api/v1/Reviews
// @access public

exports.getReviews = factory.getAllModels(Review);
// @desc    get Review by id
// @route   get /api/v1/Reviews/:id    
// @access    public

exports.getReview = factory.getModel(Review, 'Review');
// @desc update specific Review by id
// @route put /api/v1/Reviews/:id
// @access private

exports.updateReview = factory.updateModel(Review, 'Review')

// @desc delete specific Review by id
// @route delete /api/v1/Reviews
// @access private
exports.deleteReview = factory.deleteModel(Review, 'Review');