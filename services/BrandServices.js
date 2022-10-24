const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
// @desc create brand
// @route POST /api/v1/Brands
// @access private
exports.createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    return res.status(201).json({ data: brand });
})

// @desc get list of Brands
// @route get /api/v1/Brands
// @access public

exports.getBrands = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const skip = (page - 1) * limit;
    const Brands = await Brand.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: Brands.length, page: page, data: Brands });
})

// @desc    get brand by id
// @route   get /api/v1/Brands/:id    
// @access    public

exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand)
        return next(new ApiError(`No brand with this id:${id}`, 404))
    res.status(200).json({ data: brand });

})

// @desc update specific brand by id
// @route put /api/v1/Brands/:id
// @access private

exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await Brand.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true });
    if (!brand)
        return next(new ApiError(`No brand with this id:${id}`, 404))
    res.status(200).json({ data: brand });
})

// @desc delete specific brandby id
// @route delete /api/v1/Brands
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete({ _id: id });
    if (!brand)
        return next(new ApiError(`No brand with this id:${id}`, 404))

    res.status(200).json({ msg: "brand deleted successfully" });

})