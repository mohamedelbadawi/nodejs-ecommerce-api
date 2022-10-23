const mongoose = require("mongoose");

const dbURL = process.env.DB_CONNECTION;
const connect = mongoose.connect(dbURL, { useNewUrlParser: true }).then(() => {
    console.log(`Database connected successfully`);
}).catch((error) => {
    console.log(`database error ${error}`);
});

module.exports = connect;