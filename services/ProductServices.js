const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Product = require('../models/Product');
const factory = require('./handlers')

// @desc create Product 
// @route POST /api/v1/products
// @access private
exports.createProduct = factory.createModel(Product);

// @desc get list of Products
// @route get /api/v1/Products
// @access public

exports.getProducts = factory.getAllModels(Product);
// @desc    get Product by id
// @route   get /api/v1/Products/:id    
// @access    public

exports.getProduct = factory.getModel(Product, 'product');
// @desc update specific Product by id
// @route put /api/v1/Products/:id
// @access private

exports.updateProduct = factory.updateModel(Product, 'product')

// @desc delete specific Product by id
// @route delete /api/v1/Products
// @access private
exports.deleteProduct = factory.deleteModel(Product, 'product');