const mongoose = require("mongoose");
const Product = require("./Product");

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    rate: {
        type: Number,
        min: [1, "rate must be between 1 and 5"],
        max: [5, "rate must be between 1 and 5"],
        required: [true, 'rate is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to user']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, "review must belong to product"],
    }

}, { timestamps: true })


reviewSchema.statics.calcAverageRateAndNumber = async function (productId) {
    const result = await this.aggregate(
        [
            { $match: { product: productId } },
            {
                $group: {
                    _id: 'product',
                    ratingsAverage: { $avg: '$rate' },
                    ratingsNumber: { $sum: 1 }
                }
            }
        ]);

    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].ratingsAverage,
            ratingsNumber: result[0].ratingsNumber
        })
    }
    else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsNumber: 0
        })

    }
}





reviewSchema.post(['save', 'remove'], async function () {
    await this.constructor.calcAverageRateAndNumber(this.product);
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: ['name', 'profileImg'] });
    next();
})

module.exports = mongoose.model('Review', reviewSchema);