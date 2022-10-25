const request = require("supertest")
const app = require("../server");
const db = require('../config/database')
const category = require('../models/Category');
const mongoose = require('mongoose');

let id;
afterAll(async () => {
    mongoose.disconnect();
    await category.deleteMany();
})

describe("post /categories", () => {
    it("should save new category in database", async () => {
        const category = {
            name: "computers"
        };
        const res = await request(app).post('/api/v1/categories').send(category);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }));
        id = res.body.data._id;
    })

    it("empty name", async () => {
        const category = {
            name: ""
        };
        const res = await request(app).post('/api/v1/categories').send(category);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }));
    })


});


describe('get /categories', () => {
    // get all categories
    it('get all categories', async () => {
        const res = await request(app).get('/api/v1/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))

    })


});
describe('get /categories/:id', () => {
    // get all categories
    it('get specific category', async () => {
        const res = await request(app).get(`/api/v1/categories/${id}`);
        expect(res.statusCode).toEqual(200);

        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))
    })
});

describe('put /categories/:id', () => {
    it('update the specific category', async () => {
        const category = {
            name: "laptops"
        };
        const res = await request(app).put(`/api/v1/categories/${id}`).send(category);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            data: expect.any(Object)
        }));
    })

})
describe('delete /categories/:id', () => {
    it('delete the specific category', async () => {
        const res = await request(app).delete(`/api/v1/categories/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ msg: "Category deleted successfully" }));


    })

})

