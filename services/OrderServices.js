const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_KEY);
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
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    // get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("you don't have products in your cart"))
    }
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "egp",
                product_data: {
                    name: req.user.name,
                },
                unit_amount: totalPrice * 100,
            },
            quantity: 1
        },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference: cart._id,
        metadata: req.body.shippingAddress
    });
    console.log(session);
    return res.status(200).json({ status: 'success', data: session });
})

const createOrder = async (session) => {
    const cart = Cart.findById(session.client_reference_id);
    const user = User.findOne({ email: session.customer_email })
    const shippingAddress = session.metadata;
    const totalPrice = session.total_amount;

    const order = await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress: shippingAddress,
        totalOrderPrice: totalPrice,
        paymentStatus: 'paid',
        paymentStatusUpdatedAt: Date.now(),
        paymentMethodType: 'card'
    });

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


}

exports.cardWebHook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);

    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        createOrder(session)
    }
    res.status(200).json({ received: true });
})