const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');


const calculateTotalPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += (item.price * item.quantity);
    })
    return totalPrice;
}
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { product, color, quantity } = req.body;
    const productData = await Product.findById(product);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        // create cart
        cart = await Cart.create({ user: req.user._id, cartItems: [{ product: product, color: color, quantity: quantity, price: productData.price }] });
        // return res.status(200).json({ message: "success", data: cart });
    }
    else {
        const productIndex = cart.cartItems.findIndex((item) =>
            item.product.toString() === product && item.color === color
        );
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity = quantity;
            cartItem.price = cart.cartItems[productIndex].price;
            cart.cartItems[productIndex] = cartItem;
        }
        else {
            cart.cartItems.push({ product: product, quantity: quantity, color: color, price: productData.price });
        }
    }

    // total price
    const totalPrice = calculateTotalPrice(cart);

    cart.totalCartPrice = totalPrice;

    await cart.save();
    console.log(cart.totalCartPrice);
    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });

})


exports.removeItemFromCart = asyncHandler(async (req, res) => {
    const { itemId } = req.body;
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { _id: itemId } } }, { new: true });

    const totalPrice = calculateTotalPrice(cart);

    cart.totalCartPrice = totalPrice;
    await cart.save();
    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });

})


exports.getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) {
        return res.status(200).json({ status: 'success', msg: "Your cart is empty" });
    }
    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });

})

exports.clearUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    await cart.delete();
    return res.status(200).json({ status: 'success', msg: "Cart cleared successfully" });
})

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const productIndex = cart.cartItems.findIndex((item) =>
        item._id.toString() === itemId
    );

    if (productIndex > -1) {
        const cartItem = cart.cartItems[productIndex];
        cartItem.quantity = quantity;
        cart.cartItems[productIndex] = cartItem;
    }
    else {
        return next(new ApiError("this item is not in your cart"));
    }
    const totalPrice = calculateTotalPrice(cart);
    cart.totalCartPrice = totalPrice;
    await cart.save();

    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });
})

// calculate the percentage discount
const calculatePercentageDiscount = (cart, coupon) => ((cart.totalCartPrice * coupon.discount) / 100);



exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const coupon = await Coupon.findOne({ name: name });
    if (!coupon) {
        return next(new ApiError("this coupon is invalid", 404));
    }
    if (coupon.type === 'fixed') {
        cart.totalPriceAfterDiscount = (cart.totalCartPrice - coupon.discount).toFixed(2);
        await cart.save();
        return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });
    }

    const discount = calculatePercentageDiscount(cart, coupon);

    cart.totalPriceAfterDiscount = cart.totalCartPrice - discount;
    await cart.save();
    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });
})
exports.cancelDiscount = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("you don't have cart", 404));
    }
    if (cart.totalPriceAfterDiscount) {
        cart.totalPriceAfterDiscount = undefined;
        cart.save();
    }
    else {
        return next(new ApiError("you don't have discount", 404));
    }
    return res.status(200).json({ status: "success", numOfCartItems: cart.cartItems.length, data: cart });

})