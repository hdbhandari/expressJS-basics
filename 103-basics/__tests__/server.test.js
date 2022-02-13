process.env.NODE_ENV = "test"

import supertest from 'supertest'

const request = supertest(server)
import server from '../server.js'

/* To shut down the server after tests completed */
afterAll(done => {
  server.close()
  done()
})

describe('Posts', () => {
  test('Get all the posts', async () => {
    const res = await request.get('/api/v1/posts')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "success",
      "count": 0,
      "data": {
        "posts": []
      }
    })
  })
  test('Add a post', async () => {
    const res = await request
      .post('/api/v1/posts')
      .send({
        "title": "This is Post's Title",
        "description": "This is post's Description"
      })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "req_body": "savePost called with Body: {\"title\":\"This is Post's Title\",\"description\":\"This is post's Description\"}"
    })
  })
  test('Get Post By ID', async () => {
    const res = await request
      .get('/api/v1/posts/90')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "req_param_id": "Get post with ID of: 90"
    })
  })

  test('Update Post By ID', async () => {
    const res = await request
      .put('/api/v1/posts/90')
      .send({
        "title": "This is Post's Title after update",
        "description": "This is post's Description after update"
      })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "req_param_id": 90,
      "req_body": {
        "title": "This is Post's Title after update",
        "description": "This is post's Description after update"
      }
    })
  })
  test('Delete Post By ID', async () => {
    const res = await request.del('/api/v1/posts/90')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "req_param_id": 90
    })
  })
  test('Get static File', async () => {
    const res = await request.get('/public/sample.png')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('image/png')
  })
  test('Null ID test', async () => {
    const res = await request.get('/api/v1/posts/null')
    expect(res.status).toEqual(404)
    expect(res.type).toEqual(expect.stringContaining('json'))
    expect(res.body).toEqual({
      "status": "fail",
      "message": "Invalid ID"
    })
  })
})