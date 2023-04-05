const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const promiseArray = helper.initialBlogs.map(b => (new Blog(b)).save())
    await Promise.all(promiseArray)
})


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs UID property is named id', async () => {
    const blogs = await helper.blogsInDb()

    expect(blogs[0].id).toBeDefined()
})

test('blog is created successfully', async () => {
    const blog = {
        title: 'test blog',
        author: 'test author',
        url: 'testUrl',
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)

    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(res.body.map(b => b.title)).toContain('test blog')
})

afterAll(async () => {
    await mongoose.connection.close()
})