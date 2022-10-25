const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ApiError = require('./utils/ApiError');

dotenv.config();
const initializeApp = () => {





    const app = new express();

    if (process.env.NODE_ENV == "development") {
        app.use(morgan('dev'));
    }
    app.use(express.json());

    const categoryRoutes = require('./routes/categoryRoutes');
    // db connection
    const dbConnection = require('./config/database');
    const globalError = require('./middlewares/ErrorMiddleware');
    // routes
    app.use('/api/v1/categories', categoryRoutes);

    // middleware
    app.use(globalError)

    app.all('*', (req, res, next) => {
        next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
    })


    app.on('unhandledRejection', (err) => {
        console.error(`unhandledRejection error ${err.name} | ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    })

    return app;
}
const app = initializeApp();
module.exports = app;