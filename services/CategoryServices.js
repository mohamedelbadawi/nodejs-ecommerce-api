const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const Category = require('../models/Category');
const factory = require('./handlers');
const { uploadSingleImage } = require('../middlewares/UploadImage');

exports.uploadCategoryImage = uploadSingleImage('image');
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
    const fileName = `${req.body.name.replace(' ', '')}-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/categories/${fileName}`)
    req.body.image = fileName;
    next();
})
// @desc create category 
// @route POST /api/v1/categories
// @access private
exports.createCategory = factory.createModel(Category);

// @desc get list of categories
// @route get /api/v1/categories
// @access public
exports.getCategories = factory.getAllModels(Category);

// @desc    get category by id
// @route   get /api/v1/categories/:id    
// @access    public
exports.getCategory = factory.getModel(Category, 'category');

// @desc update specific category by id
// @route put /api/v1/categories/:id
// @access private
exports.updateCategory = factory.updateModel(Category, 'category');

// @desc delete specific category by id
// @route delete /api/v1/categories
// @access private
exports.deleteCategory = factory.deleteModel(Category, 'category');