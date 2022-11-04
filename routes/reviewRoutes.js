const router = require('express').Router();
const { allowedTo, auth } = require('../middlewares/TokenHandler');
const { updateReview, getReview, deleteReview, getReviews, createReview, } = require('../services/ReviewServices');
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utils/validators/ReviewValidator');

router.route('/').post(auth, createReviewValidator, createReview).get(getReviews);
router.route('/:id').get(getReviewValidator, getReview).put(auth, allowedTo('admin'), updateReviewValidator, updateReview).delete(auth, allowedTo('admin'), deleteReviewValidator, deleteReview);

module.exports = router;