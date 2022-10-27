const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const factory = require('./handlers');
// @desc create brand
// @route POST /api/v1/Brands
// @access private
exports.createBrand = factory.createModel(Brand);

// @desc get list of Brands
// @route get /api/v1/Brands
// @access public

exports.getBrands = factory.getAllModels(Brand);

// @desc    get brand by id
// @route   get /api/v1/Brands/:id    
// @access    public

exports.getBrand = factory.getModel(Brand, 'brand');

// @desc update specific brand by id
// @route put /api/v1/Brands/:id
// @access private

exports.updateBrand = factory.updateModel(Brand, 'brand');

// @desc delete specific brandby id
// @route delete /api/v1/Brands
// @access private
exports.deleteBrand = factory.deleteModel(Brand, 'brand');