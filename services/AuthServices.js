const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const argon = require('argon2')
const User = require('../models/User')
const ApiError = require("../utils/ApiError")

// @desc   signup
// @route  GET /api/v1/signup
// @access  public
exports.signup = asyncHandler(async (req, res, next) => {
    const hashedPassword = await argon.hash(req.body.password);
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({ data: user, token: token });
})

// @desc   login
// @route  GET /api/v1/login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user || !await argon.verify(user.password, req.body.password)) {
        return next(new ApiError("Incorrect email or password", 404));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({ data: user, token: token });
})

