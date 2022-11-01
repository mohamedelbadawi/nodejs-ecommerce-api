const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError');
const User = require('../models/User');


exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {

    if (!roles.includes(req.user.role)) {
        return next(new ApiError("you are not allowed to access this route"));
    }
    next();
})

exports.auth = asyncHandler(async (req, res, next, ...roles) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError("you must be logged in ", 401));
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // check if user exists
    const user = await User.findById(userData.userId);

    if (!user) {
        return next(new ApiError("this user does not exist", 401));
    }

    // check if password changed or no
    if (user.password_updated_at) {
        // change to seconds timestamps
        const passwordUpdateAtSeconds = parseInt(user.password_updated_at.getTime() / 1000, 10);
        if (passwordUpdateAtSeconds > userData.iat) {
            return next(new ApiError("your token is expired please renew it"));
        }
    }
    req.user = user;
    next();
})