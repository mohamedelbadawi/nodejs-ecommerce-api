const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const factory = require('./handlers');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("you don't have products in your cart"))
    }
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
    });
    // decreasing stock and increase sold
    if (order) {
        const options = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            },
        }))
        await Product.bulkWrite(options, {});
        await cart.delete();
    }
    return res.status(200).json({ status: "success", date: order });

})

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') req.filterObject = { user: req.user._id };
    next();
})

exports.checkOrderUser = asyncHandler(async (req, res, next) => {
    const order = await Order.findOne({ id: req.params.id });
    if (!(req.user._id.toString() === order.user.id.toString())) {
        return next(new ApiError("this order does not belongs to you"));
    }
    next();
})
exports.getAllOrders = factory.getAllModels(Order, 'orders');
exports.getOrder = factory.getModel(Order, 'order');


exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("there is no order with this id"), 404);
    }
    order.paymentStatus = status
    order.paymentStatusUpdatedAt = Date.now();
    order.save();
    return res.status(200).json({ status: "success", data: order });
})

exports.updateDelivery = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("there is no order with this id"), 404);
    }
    order.deliveryStatus = status
    order.deliveredAt = Date.now();
    order.save();
    return res.status(200).json({ status: "success", data: order });
})