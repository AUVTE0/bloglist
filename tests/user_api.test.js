const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const promiseArray = helper.initialUsers.map(u => (new User(u)).save())
    await Promise.all(promiseArray)
})

describe('get users', () => {
    test('return json objects', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('removes password', async () => {
        const res = await api.get('/api/users')
        expect(res.body[0].passwordHash).not.toBeDefined()
    })

    test('populates blogs', async () => {
        await Blog.deleteMany()
        const newBlog = {
            title: 'test blog',
            author: 'test author',
            url: 'testUrl',
            likes: 5
        }
        await api.post('/api/blogs')
            .send(newBlog)
        const res = await api.get('/api/users')
        console.log(res.body[0])
        expect(res.body[0].blogs[0].title).toBeDefined()
    })
})

describe('creating new user', () => {
    test('with valid parameters return 201 code', async () => {
        const user = {
            username: 'username',
            name: 'name',
            password: 'password',
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(201)
    
        const res = await api.get('/api/users')
        expect(res.body).toHaveLength(helper.initialUsers.length + 1)
        expect(res.body.map(b => b.username)).toContain('username')
    })

    test('with existing username returns 400 code', async () => {
        const users = await helper.usersInDb()
        const user = {
            username: users.pop().username,
            name: 'name',
            password: 'password',
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    
        const res = await api.get('/api/users')
        expect(res.body).toHaveLength(helper.initialUsers.length )
    })
    test('with missing password returns 400', async () => {
        const user = {
            username: 'username',
            name: 'name',
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    
        const res = await api.get('/api/users')
        expect(res.body).toHaveLength(helper.initialUsers.length )
    })
    test('with missing username returns 400', async () => {
        const user = {
            name: 'name',
            password: 'password'
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    
        const res = await api.get('/api/users')
        expect(res.body).toHaveLength(helper.initialUsers.length )
    })
    test('with password too short returns 400', async () => {
        const user = {
            name: 'name',
            username: 'username',
            password: 'pa'
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    
        const res = await api.get('/api/users')
        expect(res.body).toHaveLength(helper.initialUsers.length )
    })
})

// describe('deletion of a blog', () => {
//     test('succeeds with 204 if valid id', async () => {
//         const blogs = await helper.blogsInDb()
//         const blogToDelete = blogs[0]

//         await api
//             .delete(`/api/blogs/${blogToDelete.id}`)
//             .expect(204)

//         const blogsAfter = await helper.blogsInDb()

//         expect(blogsAfter).toHaveLength(blogs.length - 1)
//         expect(blogsAfter.map(b => b.title)).not.toContain(blogToDelete.title)
//     })
    
//     test('fails with 404 if blog does not exist', async () => {
//         const id = await helper.nonExistingId()
//         await api
//             .delete(`/api/blogs/${id}`)
//             .expect(404)
        
//         const blogs = await helper.blogsInDb()

//         expect(blogs).toHaveLength(helper.initialBlogs.length)
//     })
// })

// describe('updating a note', () => {
//     test('suceeds with 200 if valid id', async () => {
//         const blogs = await helper.blogsInDb()
//         const blog = blogs[0]
//         const updatedBlog = {
//             title: blog.title,
//             url: blog.url,
//             likes: 9000,
//             author: blog.author
//         }
//         await api
//             .put(`/api/blogs/${blog.id}`)
//             .send(updatedBlog)
//             .expect(200)

//         const updatedBlogs = await helper.blogsInDb()
//         expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
//         expect(updatedBlogs.map(b => b.likes)).toContain(9000)
//     })
//     test('fails with 404 if blog does not exist', async () => {
//         const blogs = await helper.blogsInDb()
//         const blog = blogs[0]
//         const updatedBlog = {
//             title: blog.title,
//             url: blog.url,
//             likes: 9000,
//             author: blog.author
//         }
//         const id = await helper.nonExistingId()
//         await api
//             .put(`/api/blogs/${id}`)
//             .send(updatedBlog)
//             .expect(404)

//         const updatedBlogs = await helper.blogsInDb()
//         expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
//         expect(updatedBlogs.map(b => b.likes)).not.toContain(9000)
//     })
// })

afterAll(async () => {
    await mongoose.connection.close()
})