const asyncHandler = require('express-async-handler');
const factory = require('./handlers');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// @desc add to addresses
// @route POST /api/v1/addresses
// @access private

exports.addUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    },
        {
            new: true
        }
    );

    res.status(200).json({ status: "success", message: "Address added successfully  ", data: user.addresses });
})
// @desc add to addresses
// @route POST /api/v1/addresses
// @access private

exports.removeUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.body.addressId } }
    },
        {
            new: true
        }
    );

    res.status(200).json({ status: "success", message: "Address deleted successfully", data: user.addresses });
})
exports.getLoggedUserAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('addresses');
    res.status(200).json({ status: "success", data: user.addresses });
})
