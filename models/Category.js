const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "category name is required"],
        unique: [true, "Category must be unique"],
        minLength: [3, "category name must be longer than 3 chars"],
        maxLength: [32, "category name must be shorter than 32 chars"]

    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String

}, { timestamps: true });
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;