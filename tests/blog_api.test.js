const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { JsonWebTokenError } = require('jsonwebtoken')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany()
    await helper.saveInitialBlogs(helper.initialBlogs)
    await helper.saveInitialUsers(helper.initialUsers)
})

describe('get blogs', () => {
    test('return json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('UID property is named id', async () => {
        const res = await api.get('/api/blogs')
        expect(res.body[0].id).toBeDefined()
    })

    test('populates user field correctly', async () => {
        const res = await api.get('/api/blogs')
        expect(res.body[0].user.username).toBeDefined()
    })
})

describe('creating new blog', () => {
    test('with invalid token returns 401', async() => {
        const token = 'invalidToken'
        const blog = {
            title: 'test blog',
            author: 'test author',
            url: 'testUrl',
            likes: 5
        }
        await api
            .post('/api/blogs')
            .set('Authorization',`Bearer ${token}`)
            .send(blog)
            .expect(401)
        const blogs = await helper.blogsInDb()
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })
    test('with valid token and  params returns 201 and assigns user', async () => {
        await Blog.deleteMany()
        const token = await helper.createValidToken()
        const blog = {
            title: 'test blog',
            author: 'test author',
            url: 'testUrl',
            likes: 5
        }
        await api
            .post('/api/blogs')
            .set('Authorization',`Bearer ${token}`)
            .send(blog)
            .expect(201)
    
        const res = await api.get('/api/blogs')
        expect(res.body).toHaveLength(1)
        expect(res.body.map(b => b.title)).toContain('test blog')
        expect(res.body[0].user.username).toBeDefined()
        console.log(res.body[0].user.username)
    })
    
    test('with missing like defaults to 0', async () => {
        Blog.deleteMany()
        const token = await helper.createValidToken()
        const blog = {
            title: 'test blog',
            author: 'test author',
            url: 'testUrl',
        }
        await api
            .post('/api/blogs')
            .set('Authorization',`Bearer ${token}`)
            .send(blog)
            .expect(201)
    
        const res = await api.get('/api/blogs')
        expect(res.body.pop().likes).toBe(0)
    })
    
    test('with missing title or url sends bad request', async () => {
        const token = await helper.createValidToken()
        const blog = {
            author: 'test author',
            likes: 5
        }
        await api
            .post('/api/blogs')
            .set('Authorization',`Bearer ${token}`)
            .send(blog)
            .expect(400)
    })
})


describe('deletion of a blog', () => {
    jest.setTimeout(30000)
    test('by different user fails with 401', async () => {
        const blogToDelete = helper.initialBlogs[0]
        const diffUser = helper.initialUsers[1]
        const token = helper.createToken(diffUser)

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .set('Authorization',`Bearer ${token}`)
            .expect(401)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(helper.initialBlogs.length)
        expect(blogsAfter.map(b => b.title)).toContain(blogToDelete.title)
    })
    test('succeeds with 204 if valid id and token', async () => {
        const blogToDelete = helper.initialBlogs[0]
        const user = helper.initialUsers[0]
        const token = helper.createToken(user)

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .set('Authorization',`Bearer ${token}`)
            .expect(204)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1)
        expect(blogsAfter.map(b => b.title)).not.toContain(blogToDelete.title)
    })
    
    test('fails with 404 if blog does not exist', async () => {
        const id = await helper.nonExistingId()
        const user = helper.initialUsers[0]
        const token = helper.createToken(user)

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization',`Bearer ${token}`)
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