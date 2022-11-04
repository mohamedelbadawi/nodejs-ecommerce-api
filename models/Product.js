const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "product name is required"],
        unique: [true, "product must be unique"],
        minLength: [3, "product name must be longer than 3 chars"],
        maxLength: [200, "product name must be shorter than 32 chars"]

    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    coverImage: { type: String, required: [true, "cover image is required"] },
    images: [String],
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minLength: [20, "description must me at least 20 chars"]
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [100000, "Price is too much "],

    },
    priceAfterDiscount: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    colors: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must be belong to a category']
    },
    subcategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory'
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingsAverage: {
        type: Number,
        min: [1, "Rating must above or equal 1"],
        max: [5, "can't be more than 5"]
    },
    ratingsNumber: {
        type: Number,
        default: 0
    }


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

});

productSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    next();
})

productSchema.post(['init', 'save'], (document) => {
    if (document.coverImage) {
        const imageUrl = `${process.env.BASE_URL}/products/${document.coverImage}`;
        document.coverImage = imageUrl;
    }
    if (document.images) {
        const images = [];
        document.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            images.push(imageUrl);
            document.images = images;
        })
    }
})



productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
})




const Product = mongoose.model('Product', productSchema);

module.exports = Product;