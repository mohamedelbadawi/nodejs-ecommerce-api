const ApiError = require("../utils/ApiError");

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack });
    }
    else {
        if (err.name === 'JsonWebTokenError') {
            return new ApiError('Invalid token,please login again', 401);
        }
        if (err.name === 'TokenExpiredError') {
            return new ApiError('Expired token, please login again', 401);
        }
        res.status(err.statusCode).json({ status: err.status, message: err.message });
    }

}

module.exports = globalError;

