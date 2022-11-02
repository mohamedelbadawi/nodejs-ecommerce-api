const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const argon = require("argon2");
const User = require("../models/User");
const { uploadSingleImage } = require('../middlewares/UploadImage');
const factory = require('./handlers');
const ApiError = require('../utils/ApiError');




exports.uploadUserImage = uploadSingleImage('profileImg')

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `${req.body.name}-${uuidv4()}-${Date.now()}.jpeg`
        await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/users/${fileName}`)
        req.body.image = fileName;
    }
    next();
})

// @desc create user
// @route POST /api/v1/users
// @access private
exports.createUser = factory.createModel(User);

// @desc get list of users
// @route get /api/v1/users
// @access public

exports.getUsers = factory.getAllModels(User);

// @desc    get user by id
// @route   get /api/v1/users/:id    
// @access    public

exports.getUser = factory.getModel(User, 'user');

// @desc update specific user by id
// @route put /api/v1/users/:id
// @access private

exports.updateUser = factory.updateModel(User, 'user');

// @desc delete specific user by id
// @route delete /api/v1/users
// @access private
exports.deleteUser = factory.deleteModel(User, 'user');

// @desc update specific user by id
// @route put /api/v1/users/:id
// @access private

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
    const newPassword = await argon.hash(req.body.password);
    const user = await User.findOneAndUpdate({ _id: req.params.id }, { password: newPassword, password_updated_at: Date.now() }, { new: true });

    if (!user) {
        return next(new ApiError('No user for this id', 404));
    }
    res.status(200).json({ data: user });
})


exports.getLoggedUser = asyncHandler(async (req, res, next) => {
    console.log(req)
    req.params.id = req.user._id;
    next();
})


exports.deActiveUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).json({ status: 'Success' });
})