/* eslint-disable new-cap */
/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors')
const dotenv = require('dotenv');
const compression = require('compression')
const ApiError = require('./utils/ApiError');

dotenv.config();
const initializeApp = () => {
    const app = new express();
    if (process.env.NODE_ENV === "development") {
        app.use(morgan('dev'));
    }
    app.use(express.json());
    const categoryRoutes = require('./routes/categoryRoutes');
    const productRoutes = require('./routes/productRoute');
    const subcategoryRoutes = require('./routes/subcategoryRoutes');
    const brandRoutes = require('./routes/brandRoutes');
    const userRoutes = require('./routes/userRoutes');
    const authRoutes = require('./routes/authRoutes');
    const reviewRoutes = require('./routes/reviewRoutes');
    app.use('/api/v1/wishlist', wishlistRoutes);
    app.use('/api/v1/addresses', addressesRoutes);
    app.use('/api/v1/coupons', couponRoutes);
    app.use('/api/v1/cart', cartRoutes);
    app.use('/api/v1/orders', orderRoutes);

    app.use(cors());
    app.options('*', cors());

    app.use(compression())
    // middleware
    app.use('/', express.static(path.join(__dirname, 'uploads')))
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