const Subcategory = require('../models/Subcategory');
const factory = require('./handlers');

// @desc create subcategory
// @route POST /api/v1/subcategories
// @access private
exports.createSubcategory = factory.createModel(Subcategory);

// @desc get list of subcategories
// @route get /api/v1/subcategories
// @access public
exports.getSubcategories = factory.getAllModels(Subcategory);

// @desc    get subcategory by id
// @route   get /api/v1/subcategories/:id    
// @access    public
exports.getSubcategory = factory.getModel(Subcategory, 'subcategory');

// @desc update specific subcategory by id
// @route put /api/v1/subcategories/:id
// @access private
exports.updateSubcategory = factory.updateModel(Subcategory, 'subcategory');

// @desc delete specific subcategory by id
// @route delete /api/v1/subcategories
// @access private
exports.deleteSubcategory = factory.deleteModel(Subcategory, 'subcategory');

