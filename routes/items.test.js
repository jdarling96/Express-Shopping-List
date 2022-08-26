process.env.NODE_ENV = 'test';
const request = require('supertest')

const app = require('../app')
let items = require('../fakeDb')
const ExpressError = require('../expressError')

let testItems = {name: 'butter', price: 5.0}

beforeEach(() => {
    items.push(testItems)
})

afterEach(() => {
    items.length = 0
})

describe('GET /items', () => {
    test('GET all items in our shopping list', async () => { 
        const res = await request(app).get('/items')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({items: [testItems]})
        })
       
})

describe('GET /items/:name', () => {
    test('GET item by name', async () => {
        const res = await request(app).get(`/items/${testItems.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({name: testItems.name, price: testItems.price})
        
    })
    test('Respond with 404 if name is invalid', async () => {
        const res = await request(app).get('/items/chocolate')
        expect(res.statusCode).toBe(404)
        expect(res.body).not.toEqual({name: testItems.name, price: testItems.price})

    })
})

describe('POST /items', () => {
    test('POST new item to list', async () => {
        const res = await request(app).post('/items').send({"name":"chicken", "price": 10.0})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({added: {name: 'chicken', price: 10}})
    })
    test('Respond with a 400 name is missing', async () => {
        const res = await request(app).post('/items').send({})
        expect(res.statusCode).toBe(400)
        expect(res.body).not.toEqual({added: {}})
    })
})

describe('PATCH /items/:name', () => {
    test('PATCH item in list', async () => {
        const res = await request(app).patch(`/items/${testItems.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated : {name: testItems.name, price: testItems.price}})
    })
    test('PATCH item in list', async () => {
        const res = await request(app).patch('/items/chocolate')
        expect(res.statusCode).toBe(404)
        expect(res.body).not.toEqual({updated : {name: testItems.name, price: testItems.price}})
    })
})

describe('DELETE /items/:name', () => {
    test('DELETE item in list', async () => {
        const res = await request(app).delete(`/items/${testItems.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: 'Deleted'})
    })
    test('PATCH item in list', async () => {
        const res = await request(app).delete('/items/chocolate')
        expect(res.statusCode).toBe(404)
        expect(res.body).not.toEqual({message: 'Deleted'})
    })
})