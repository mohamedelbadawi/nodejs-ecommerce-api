const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to user']
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            color: String,
            price: Number,
        },
    ],
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: {
        type: Number,
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'canceled', 'pending'],
        default: 'pending'
    },
    paymentStatusUpdatedAt: {
        type: Date,
    },
    deliveryStatus: {
        type: String,
        enum: ['delivered', 'inprogress', 'canceled'],
        default: 'inprogress'
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String
    },
    deliveredAt: {
        type: Date,

    },
    note: {
        type: String
    }

}, { timestamps: true })

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImg email phone'
    }).populate({
        path: 'cartItems.product',
        select: 'title coverImage'
    })
    next()
})


module.exports = mongoose.model('Order', orderSchema);
