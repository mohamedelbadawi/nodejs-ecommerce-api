const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
// @desc create Product 
// @route POST /api/v1/products
// @access private
exports.createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    return res.status(201).json({ data: product });
})

// @desc get list of Products
// @route get /api/v1/Products
// @access public

exports.getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: products.length, page: page, data: products });
})

// @desc    get Product by id
// @route   get /api/v1/Products/:id    
// @access    public

exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return next(new ApiError(`No Product with this id:${id}`, 404))
    res.status(200).json({ data: product });

})

// @desc update specific Product by id
// @route put /api/v1/Products/:id
// @access private

exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.title);

    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!product)
        return next(new ApiError(`No Product with this id:${id}`, 404))
    res.status(200).json({ data: product });
})

// @desc delete specific Product by id
// @route delete /api/v1/Products
// @access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete({ _id: id });
    if (!product)
        return next(new ApiError(`No Product with this id:${id}`, 404))

    res.status(200).json({ msg: "Product deleted successfully" });

})