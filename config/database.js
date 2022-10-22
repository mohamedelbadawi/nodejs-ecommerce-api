const mongoose = require("mongoose");

const dbURL = process.env.DB_CONNECTION;
mongoose.connect(dbURL, { useNewUrlParser: true }).then(() => {
    console.log(`Database connected successfully`);
}).catch((error) => {
    console.log(`database error ${error}`);
});

module.exports = dbURL;