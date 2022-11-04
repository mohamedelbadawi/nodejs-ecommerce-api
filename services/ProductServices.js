const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { uploadMixImages } = require('../middlewares/UploadImage');
const Product = require('../models/Product');
const factory = require('./handlers')





const fields = [{
    name: 'coverImage',
    maxCount: 1
},
{
    name: 'images',
    maxCount: 5
}
];

exports.uploadProductImages = uploadMixImages(fields)

exports.resizeProductImages = asyncHandler(async (req, res, next) => {

    console.log(req.files.coverImage[0].buffer)
    if (req.files.coverImage) {
        const fileName = `${req.body.title.replace(' ', '')}-${uuidv4()}-${Date.now()}.jpeg`
        await sharp(req.files.coverImage[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/products/${fileName}`)
        req.body.coverImage = fileName;
    }
    if (req.files.images) {
        req.body.images = []
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const fileName = `${req.body.title.replace(' ', '')}-${uuidv4()}-${Date.now()}+${index + 1}.jpeg`
                await sharp(img.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 95 }).toFile(`uploads/products/${fileName}`)
                req.body.images.push(fileName)
            })
        )
    }
    next();
})
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

exports.getProduct = factory.getModel(Product, 'product', 'reviews');
// @desc update specific Product by id
// @route put /api/v1/Products/:id
// @access private

exports.updateProduct = factory.updateModel(Product, 'product')

// @desc delete specific Product by id
// @route delete /api/v1/Products
// @access private
exports.deleteProduct = factory.deleteModel(Product, 'product');