const app = require("./server");
const morgan=require('morgan');
require('dotenv');
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
module.exports = server;