const router = require('express').Router();
const { auth } = require('../middlewares/TokenHandler');
const { addProductToCart, getUserCart, clearUserCart, updateCartItemQuantity, applyCoupon, cancelDiscount } = require('../services/cartServices');
const { removeProductFromWishlist } = require('../services/wishlistSerivces');

router.route('/').get(auth, getUserCart).post(auth, addProductToCart).put(auth, updateCartItemQuantity).delete(auth, removeProductFromWishlist);
router.route('/coupon').put(auth, applyCoupon).delete(auth, cancelDiscount);
router.delete('/clear', auth, clearUserCart);
module.exports = router;