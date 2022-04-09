import supertest from 'supertest'
import mongoose from 'mongoose'
const request = supertest(server)
import { server } from '../src/server.js'
import { jest } from '@jest/globals'
import testData from './req/testData.json'
import { error } from "console"

/* To shut down the server after tests completed */
afterAll(done => {
  /* 
    mongoose.connection.close() // will clean the DB as well (NOTE: not tested)
  */
  mongoose.disconnect()
  server.close()
  done()
})

beforeEach(() => {
  /* To disable console.log statements */
  // jest.spyOn(console, 'log').mockImplementation(() => { })
  // jest.spyOn(console, 'warn').mockImplementation(() => { })
})

describe('Server and DB Connection Status', () => {
  test(`Check if NODE_ENV value set to: ${testData.environment}`, async () => {
    expect(process.env.NODE_ENV).toBe(testData.environment)
  })
  test(`Check if connected to correct test DB: ${testData.dbName}`, async () => {
    expect(mongoose.connection._connectionString).toBe(testData.dbUrl)
  })
})

describe('Utility APIs', () => {
  /*
    Note: KEEP THIS TEST AT THE END
    Delete All the products
  */
  test('Before starting tests, clearing DB', async () => {
    const res = await request.del('/api/v1/products/util/deleteAllProducts')
    expect(res.status).toEqual(204)
  })

  /* Before starting the testing, add sample products to test DB */
  test('Creating 50 sample products to the DB', async () => {
    const res = await request
      .post('/api/v1/products/util/addMultipleProducts')
    expect(res.status).toEqual(201)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "success",
      "count": 50
    })
    expect(res.body.count).toBe(50)
  })

  test('Update sample products with slug', async () => {
    const res = await request
      .patch('/api/v1/products/util/addMissingProductSlug')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "success",
      "message": "Total 50 updated"
    })
  })

  test('Update sample products with slug', async () => {
    const res = await request
      .patch('/api/v1/products/util/addMissingProductSlug')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "success",
      "message": "Total 0 updated"
    })
  })

  test('Get all the Products', async () => {
    const res = await request.get('/api/v1/products')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body.results).toBe(50)
  })

  test('Create a Product, trim name', async () => {
    const res = await request.post('/api/v1/products')
      .send({
        "name": "     White eggs        ",
        "type": "dairy",
        "availableQuantity": 90,
        "rating": 0,
        "price": 34.1,
        "description": "Cow's Milk",
        "launchDate": "2022-02-04T06:56:04.731Z",
        "filename": "0.jpg",
        "height": 600,
        "width": 400
      })
    expect(res.status).toEqual(201)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body.status).toBe('success')
    expect(res.body.data.product.name).toBe('White eggs')
  })

  test('Product with same name not allowed', async () => {
    const res = await request.post('/api/v1/products')
      .send({
        "name": "Brown eggs",
        "type": "dairy",
        "availableQuantity": 90,
        "rating": 0,
        "price": 34.1,
        "description": "Cow's Milk",
        "launchDate": "2022-02-04T06:56:04.731Z",
        "filename": "0.jpg",
        "height": 600,
        "width": 400
      })
    expect(res.status).toEqual(400)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "fail",
      "message": "Duplicate field value: 'Brown eggs'. Please use another value!"
    })
  })

  test('Product category is incorrect', async () => {
    const res = await request.post('/api/v1/products')
      .send({
        "name": "Yellow eggs",
        "type": "dairy new",
        "availableQuantity": 90,
        "rating": 0,
        "price": 34.1,
        "description": "Cow's Milk",
        "launchDate": "2022-02-04T06:56:04.731Z",
        "filename": "0.jpg",
        "height": 600,
        "width": 400
      })
    expect(res.status).toEqual(400)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "fail",
      "message": "Product type 'dairy new' is not allowed."
    })
  })

  test('Product name greater than 80 chars', async () => {
    const res = await request.post('/api/v1/products')
      .send({
        "name": "White eggs White eggs White eggs White eggs White eggs White eggs White eggs White eggs",
        "type": "dairy",
        "availableQuantity": 90,
        "rating": 0,
        "price": 34.1,
        "description": "Cow's Milk",
        "launchDate": "2022-02-04T06:56:04.731Z",
        "filename": "0.jpg",
        "height": 600,
        "width": 400
      })
    expect(res.status).toEqual(400)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body.status).toBe('fail')
    expect(res.body.message).toBe("Product type 'dairy1' is not allowed.")
  })

  /*
    Note: KEEP THIS TEST AT THE END
    Delete All the products
  */
  test('Deleting all the Products from the DB', async () => {
    const res = await request.del('/api/v1/products/util/deleteAllProducts')
    expect(res.status).toEqual(204)
  })
})

describe('Create Product Test Cases', () => {
})