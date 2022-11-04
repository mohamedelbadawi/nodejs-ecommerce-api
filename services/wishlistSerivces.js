const asyncHandler = require('express-async-handler');
const factory = require('./handlers');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// @desc add to wishlist
// @route POST /api/v1/wishlist
// @access private

exports.addProductToWishlist = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    },
        {
            new: true
        }
    );

    res.status(200).json({ status: "success", message: "Product add successfully to wishlist ", data: user.wishlist });
})
// @desc add to wishlist
// @route POST /api/v1/wishlist
// @access private

exports.removeProductFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.body.productId }
    },
        {
            new: true
        }
    );

    res.status(200).json({ status: "success", message: "Product removed successfully from wishlist ", data: user.wishlist });
})
exports.getLoggedUserWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({ status: "success", message: "Product removed successfully from wishlist ", data: user.wishlist });
})
