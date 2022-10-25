const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Subcategory = require('../models/Subcategory');
const ApiError = require('../utils/ApiError');

// @desc create subcategory
// @route POST /api/v1/subcategories
// @access private
exports.createSubcategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subcategory = await Subcategory.create({ name, slug: slugify(name), category });
    return res.status(201).json({ data: subcategory });
})

// @desc get list of subcategories
// @route get /api/v1/subcategories
// @access public

exports.getSubcategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const skip = (page - 1) * limit;
    const subcategories = await Subcategory.find({}).skip(skip).limit(limit).populate({ path: 'category', select: 'name' });
    res.status(200).json({ results: subcategories.length, page: page, data: subcategories });
})

// @desc    get subcategory by id
// @route   get /api/v1/subcategories/:id    
// @access    public

exports.getSubcategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);
    if (!subcategory)
        return next(new ApiError(`No subcategory with this id:${id}`, 404))
    res.status(200).json({ data: subcategory });

})

// @desc update specific subcategory by id
// @route put /api/v1/subcategories/:id
// @access private

exports.updateSubcategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subcategory = await Subcategory.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), category }, { new: true });
    if (!subcategory)
        return next(new ApiError(`No subcategory with this id:${id}`, 404))
    res.status(200).json({ data: subcategory });
})

// @desc delete specific subcategory by id
// @route delete /api/v1/subcategories
// @access private
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete({ _id: id });
    if (!subcategory)
        return next(new ApiError(`No subcategory with this id:${id}`, 404))

    res.status(200).json({ msg: "subcategory deleted successfully" });

})