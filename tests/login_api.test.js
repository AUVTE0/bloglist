const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany()
    await Blog.deleteMany()
    await helper.saveInitialUsers(helper.initialUsers)
    await helper.saveInitialBlogs(helper.initialBlogs)
})

describe('user login', () => {
    test('with correct credentials returns 200 with token, username and name', async ()=>{
        const user = helper.initialUsers[0]
        const res = await api.post('/api/login')
            .send({username: user.username, password: user.password})
            .expect(200)

        expect(res.body.token).toBeDefined()
        expect(res.body.username).toBe(user.username)
        expect(res.body.name).toBe(user.name)
    })
    test('with incorrect username returns 401', async ()=>{
        const user = helper.initialUsers[0]
        await api.post('/api/login')
            .send({username: 'wrongUsername', password: user.password})
            .expect(401)

    })
    test('with incorrect password returns 401', async ()=>{
        const user = helper.initialUsers[0]
        api.post('/api/login')
            .send({username: user.username, password: 'wrongPw'})
            .expect(401)
    })

})

