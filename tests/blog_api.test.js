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

test('missing like defaults to 0', async () => {
    const blog = {
        title: 'test blog',
        author: 'test author',
        url: 'testUrl',
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)

    const res = await api.get('/api/blogs')
    expect(res.body.pop().likes).toBe(0)
})

test('missing title or url sends bad request', async () => {
    const blog = {
        author: 'test author',
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
})

describe('deletion of a blog', () => {
    test('succeeds with 204 if valid id', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(blogs.length - 1)
        expect(blogsAfter.map(b => b.title)).not.toContain(blogToDelete.title)
    })
    
    test('fails with 404 if blog does not exist', async () => {
        const id = await helper.nonExistingId()
        await api
            .delete(`/api/blogs/${id}`)
            .expect(404)
        
        const blogs = await helper.blogsInDb()

        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })
})

describe('updating a note', () => {
    test('suceeds with 200 if valid id', async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]
        const updatedBlog = {
            title: blog.title,
            url: blog.url,
            likes: 9000,
            author: blog.author
        }
        await api
            .put(`/api/blogs/${blog.id}`)
            .send(updatedBlog)
            .expect(200)

        const updatedBlogs = await helper.blogsInDb()
        expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
        expect(updatedBlogs.map(b => b.likes)).toContain(9000)
    })
    test('fails with 404 if blog does not exist', async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]
        const updatedBlog = {
            title: blog.title,
            url: blog.url,
            likes: 9000,
            author: blog.author
        }
        const id = await helper.nonExistingId()
        await api
            .put(`/api/blogs/${id}`)
            .send(updatedBlog)
            .expect(404)

        const updatedBlogs = await helper.blogsInDb()
        expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
        expect(updatedBlogs.map(b => b.likes)).not.toContain(9000)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})