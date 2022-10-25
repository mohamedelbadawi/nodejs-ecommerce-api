const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: [true, "Brand must be unique"],
        minLength: [3, "Brand name must be longer than 3 chars"],
        maxLength: [32, "Brand name must be shorter than 32 chars"]

    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String

}, { timestamps: true });
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;