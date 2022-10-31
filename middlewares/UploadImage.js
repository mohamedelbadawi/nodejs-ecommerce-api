const multer = require('multer');

const ApiError = require('../utils/ApiError');

const multerConfiguration = () => {
    const multerStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        }
        else {
            cb(new ApiError('only images allowed'), false)
        }
    }
    return multer({ storage: multerStorage, fileFilter: multerFilter });
};


exports.uploadSingleImage = () => {
    const upload = multerConfiguration();
    return upload.single('image');
}

exports.uploadMixImages = (fields) => {
    const upload = multerConfiguration();
    return upload.fields(fields);
}
