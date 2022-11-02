const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const argon = require('argon2')
const { createHash } = require('node:crypto')
const User = require('../models/User')
const ApiError = require("../utils/ApiError")
const sendEmail = require('../utils/sendEmail');
const { sendSms } = require("../utils/sendSms")

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


const createToken = (userId) => jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
});

// @desc   forget password via email
// @route  post /api/v1/forgetPassword/email
// @access  public

const createCode = () => {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedCode = createHash('sha256')
        .update(resetCode)
        .digest('hex');
    return { resetCode: resetCode, hashedCode: hashedCode };
}

exports.resetPasswordViaEmail = asyncHandler(async (req, res, next) => {
    // get the user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ApiError("there is no account with this email "))
    }

    const { resetCode, hashedCode } = createCode();

    user.password_reset_code = hashedCode;
    user.password_reset_expire = Date.now() + 10 * 60 * 1000;
    user.password_reset_verified = false;
    user.save();
    const message = `Hi ${user.name},
    
        A password reset for your account was requested.
    
        this is your reset password code "${resetCode}"
    
        Note that this code is valid for 10 minutes. After the time limit has expired, you will have to resubmit the request for a password reset.
    
        E-shop team
        `;

    await sendEmail({ email: user.email, subject: 'E-shop password reset ', message: message })

    res.status(200).json({ status: "success", message: "reset code was sent to you successfully" });

});
exports.resetPasswordViaPhone = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ApiError("there is no account with this email "))
    }

    const { resetCode, hashedCode } = createCode();

    user.password_reset_code = hashedCode;
    user.password_reset_expire = Date.now() + 10 * 60 * 1000;
    user.password_reset_verified = false;
    user.save();
    const message = `Hi ${user.name},
    
    A password reset for your account was requested.

    this is your reset password code "${resetCode}"

    Note that this code is valid for 10 minutes. After the time limit has expired, you will have to resubmit the request for a password reset.

    E-shop team
    `;
    await sendSms(user.phone, message);
    res.status(200).json({ status: "success", message: "reset code was sent to you successfully" });

})

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedCode = createHash('sha256')
        .update(req.body.reset_code)
        .digest('hex');

    const user = await User.findOne({ password_reset_code: hashedCode, password_reset_expire: { $gte: Date.now() } });

    if (!user) {
        return next(new ApiError("this code is invalid"));
    }
    user.password_reset_verified = true;
    await user.save();
    res.status(200).json({ status: 'success', data: user.id });


});


exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError('can not reset password for this email', 404));
    }
    if (!user.password_reset_verified) {
        return next(new ApiError('the reset code password not verify', 404));
    }
    user.password = await req.body.password;
    user.password_reset_code = undefined;
    user.password_reset_expire = undefined;
    user.password_reset_verified = undefined;
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ token })
})