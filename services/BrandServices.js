const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/UploadImage');
const Brand = require('../models/Brand');
const factory = require('./handlers');





exports.uploadBrandImage = uploadSingleImage('image')

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
    const fileName = `${req.body.name}-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/brands/${fileName}`)
    req.body.image = fileName;
    next();
})

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