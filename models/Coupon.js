const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "coupon name is required"]
    },
    expire: {
        type: Date,
        required: [true, "expire date is required"]
    },
    type: {
        type: String,
        enum: ['fixed', 'percentage']
    },
    discount: {
        type: Number,
        required: [true, "coupon discount percentage is required"]
    },
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;