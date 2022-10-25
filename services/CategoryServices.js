const Category = require('../models/Category');
const slugify = require("slugify");
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
// @desc create category 
// @route POST /api/v1/categories
// @access private
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    return res.status(201).json({ data: category });
})

// @desc get list of categories
// @route get /api/v1/categories
// @access public

exports.getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const categories = await Category.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: categories.length, page: page, data: categories });
})

// @desc    get category by id
// @route   get /api/v1/categories/:id    
// @access    public

exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
        return next(new ApiError(`No category with this id:${id}`, 404))
    res.status(200).json({ data: category });

})

// @desc update specific category by id
// @route put /api/v1/categories/:id
// @access private

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true });
    if (!category)
        return next(new ApiError(`No category with this id:${id}`, 404))
    res.status(200).json({ data: category });
})

// @desc delete specific category by id
// @route delete /api/v1/categories
// @access private
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete({ _id: id });
    if (!category)
        return next(new ApiError(`No category with this id:${id}`, 404))

    res.status(200).json({ msg: "Category deleted successfully" });

})