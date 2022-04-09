import supertest from 'supertest'
import mongoose from 'mongoose'
const request = supertest(server)
import { server } from '../src/server.js'
import { jest } from '@jest/globals'

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
  jest.spyOn(console, 'log').mockImplementation(() => { })
  jest.spyOn(console, 'warn').mockImplementation(() => { })

})

describe('Server and DB Connection Status', () => {
  test('Check if NODE_ENV value set to: test', async () => {
    expect(process.env.NODE_ENV).toBe('test')
  })
  test('Check if connected to correct test DB', async () => {
    expect(mongoose.connection._connectionString).toBe('mongodb://localhost:27017/104-basics-tests')
  })
})

describe('Posts', () => {
  /* Before starting the testing, add sample products to test DB */
  test('Adding 50 sample products to the DB', async () => {
    const res = await request
      .post('/api/v1/products/util/addMultipleProducts')
    expect(res.status).toEqual(201)
    expect(res.type).toEqual(expect.stringContaining('json'))
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

  test('Get all the Products', async () => {
    const res = await request.get('/api/v1/products')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    // expect(res.body.results).toBe(50)
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