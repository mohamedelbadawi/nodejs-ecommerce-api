const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
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
    const totalDocuments = Brand.countDocuments();
    const apiFeatures = new ApiFeatures(Brand.find(), req.query).search().filter().sort().paginate().paginate(totalDocuments);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const Brands = await mongooseQuery;

    res.status(200).json({ results: Brands.length, paginationResult: paginationResult, data: Brands });
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