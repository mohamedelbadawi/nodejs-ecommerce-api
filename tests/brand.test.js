const request = require("supertest")
const mongoose = require('mongoose');
const app = require("../server");
const Brand = require('../models/Brand');
require('../config/database')

let id;
afterAll(async () => {
    await Brand.deleteMany({});
    mongoose.disconnect();
})

describe("post /brands", () => {
    it("should save new brand in database", async () => {
        const brand = {
            name: "Adidas"
        };
        const res = await request(app).post('/api/v1/brands').send(brand);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }));
        id = res.body.data._id;
    })

    it("empty name", async () => {
        const brand = {
            name: ""
        };
        const res = await request(app).post('/api/v1/brands').send(brand);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }));
    })


});


describe('get /brands', () => {
    // get all brands
    it('get all brands', async () => {
        const res = await request(app).get('/api/v1/brands');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))

    })


});
describe('get /brands/:id', () => {
    // get all brands
    it('get specific brand', async () => {
        const res = await request(app).get(`/api/v1/brands/${id}`);
        expect(res.statusCode).toEqual(200);

        expect(res.body).toEqual(expect.objectContaining({ data: expect.any(Object) }))
    })
});

describe('put /brands/:id', () => {
    it('update the specific brand', async () => {
        const brand = {
            name: "laptops"
        };
        const res = await request(app).put(`/api/v1/brands/${id}`).send(brand);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            data: expect.any(Object)
        }));
    })

})
describe('delete /brands/:id', () => {
    it('delete the specific brand', async () => {
        const res = await request(app).delete(`/api/v1/brands/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({ msg: "brand deleted successfully" }));


    })

})

