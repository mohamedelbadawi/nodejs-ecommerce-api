const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const ApiFeatures = require('../utils/ApiFeatures')
const factory = require('./handlers');

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