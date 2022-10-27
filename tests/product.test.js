/* eslint-disable no-undef */
const request = require("supertest")
const mongoose = require('mongoose');
const app = require("../server");
const Product = require('../models/Product');
const Category = require("../models/Category");
require('../config/database')

let id;
afterAll(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
    mongoose.disconnect();
})

describe("post /products", () => {
    it("create a new product", async () => {
        const category = {
            name: "data"
        };
        const categoryRes = await request(app).post('/api/v1/categories').send(category);

        const product = {
            "title": "Fjallraven - Foldsack No",
            "slug": "fjallraven-foldsack-no.",
            "quantity": 10,
            "sold": 25,
            "price": 109.95,
            "priceAfterDiscount": 100,
            "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            "category": categoryRes.body.data._id,
            "coverImage": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            "ratingsAverage": 4.3,
            "ratingsNumber": 20
        };
        const res = await request(app).post('/api/v1/products').send(product);
        id = res.body.data._id;
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }));
    })

    it("empty data", async () => {
        const product = {
            "title": "",
            "slug": "",
            "quantity": "",
            "sold": "",
            "price": "",
            "priceAfterDiscount": "",
            "description": "",
            "category": "",
            "coverImage": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            "ratingsAverage": 4.3,
            "ratingsNumber": 20
        };
        const res = await request(app).post('/api/v1/categories').send(product);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }));
    })


});


describe('get /products', () => {
    // get all categories
    it('get all products', async () => {
        const res = await request(app).get('/api/v1/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))

    })


});
describe('get /products/:id', () => {
    // get all categories
    it('get specific category', async () => {
        const res = await request(app).get(`/api/v1/products/${id}`);
        expect(res.statusCode).toEqual(200);

        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))
    })
});


describe('put /product/:id', () => {

    it('update the specific product', async () => {
        const category = {
            name: "Laptops"
        };
        const categoryRes = await request(app).post('/api/v1/categories').send(category);

        const product = {
            "title": "updated-Fjallraven - Foldsack No",
            "slug": "fjallraven-foldsack-no.",
            "quantity": 10,
            "sold": 25,
            "price": 109.95,
            "priceAfterDiscount": 100,
            "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            "category": categoryRes.body.data._id,
            "imageCover": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            "ratingsAverage": 4.3,
            "ratingsNumber": 20
        };
        const res = await request(app).put(`/api/v1/products/${id}`).send(product);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            data: expect.any(Object)
        }));
    })

})
describe('delete /product/:id', () => {
    it('delete the specific product', async () => {
        const res = await request(app).delete(`/api/v1/products/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ msg: "Product deleted successfully" }));


    })

})

