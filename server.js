const express = require('express');
const app = new express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}
app.use(express.json());

const categoryRoutes = require('./routes/categoryRoutes');
// db connection
const dbConnection = require('./config/database');
// routes
app.use('/api/v1/categories', categoryRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});