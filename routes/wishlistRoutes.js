const router = require('express').Router();
const { auth } = require('../middlewares/TokenHandler');
const { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } = require('../services/wishlistSerivces');
const { addProductToWishlistValidator } = require('../utils/validators/WishlistValidator');



router.route('/').get(auth, getLoggedUserWishlist).post(auth, addProductToWishlistValidator, addProductToWishlist).delete(auth, removeProductFromWishlist, removeProductFromWishlist);

module.exports = router;