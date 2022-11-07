const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');


exports.getAllModels = (model) => asyncHandler(async (req, res) => {
    const totalDocuments = model.countDocuments();
    let filter = {};
    if (req.filterObject) {
        filter = req.filterObject;
    }
    const apiFeatures = new ApiFeatures(model.find(filter), req.query).search().filter().sort().paginate().paginate(totalDocuments);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({ results: documents.length, paginationResult: paginationResult, data: documents });
})

exports.createModel = (model) => asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    return res.status(201).json({ data: document });
})


exports.getModel = (model, modelName, populationOptions) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = model.findById(id);
    if (populationOptions) {
        query.populate(populationOptions);
    }
    const document = await query;
    if (!document)
        return next(new ApiError(`No ${modelName} with this id:${id}`, 404))
    res.status(200).json({ data: document });

})
exports.updateModel = (model, modelName) => asyncHandler(async (req, res, next) => {
    // console.log(req.params)
    const { id } = req.params;
    const document = await model.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!document)
        return next(new ApiError(`No ${modelName} with this id:${id}`, 404))
    document.save();
    res.status(200).json({ data: document });
})
exports.deleteModel = (model, modelName) => asyncHandler(async (req, res, next) => {
    console.log();
    const { id } = req.params;
    const document = await model.findByIdAndDelete({ _id: id });
    if (!document)
        return next(new ApiError(`No ${modelName} with this id:${id}`, 404))
    document.remove();
    res.status(200).json({ msg: `${modelName} deleted successfully` });

})