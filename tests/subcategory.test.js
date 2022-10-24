const request = require("supertest")
const mongoose = require('mongoose');
const app = require("../server");
const Subcategory = require("../models/Subcategory");
const Category = require('../models/Category')
require('../config/database')

let id;
afterAll(async () => {
    await Subcategory.deleteMany();
    await Category.deleteMany();
    mongoose.disconnect();
})

describe("post /subcategories", () => {
    it("should save new subcategory in database", async () => {

        const category = {
            name: "computers"
        };
        const categoryRes = await request(app).post('/api/v1/categories').send(category);

        const subcategory = {
            name: "hp",
            category: categoryRes.body.data._id
        };
        const res = await request(app).post('/api/v1/subcategories').send(subcategory);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }));
        id = res.body.data._id;
    })
});

describe('get /subcategories', () => {
    // get all categories
    it('get all subcategories', async () => {
        const res = await request(app).get('/api/v1/subcategories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))
    });
});



describe('get /subcategories/:id', () => {
    // get all categories
    it('get specific subcategory', async () => {
        const res = await request(app).get(`/api/v1/subcategories/${id}`);
        expect(res.statusCode).toEqual(200);

        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))
    })
});

describe('put /subcategories/:id', () => {
    it('update the specific subcategory', async () => {
        const subcategory = {
            name: "laptops"
        };
        const res = await request(app).put(`/api/v1/subcategories/${id}`).send(subcategory);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            data: expect.any(Object)
        }));
    })

})
describe('delete /subcategories/:id', () => {
    it('delete the specific subcategory', async () => {
        const res = await request(app).delete(`/api/v1/subcategories/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ msg: "subcategory deleted successfully" }));


    })

})
