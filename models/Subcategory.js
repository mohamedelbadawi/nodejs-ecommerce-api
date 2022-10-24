const mongoose = require('mongoose');

const Subcategory = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "Subcategory must be unique"],
        minLength: [2, "subcategory name must be longer than 2 chars"],
        maxLength: [32, "subcategory name must be shorter than 32 chars"]
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "You must provide category name"]
    }

}, { timestamps: true });

module.exports = mongoose.model("subCategory", Subcategory);