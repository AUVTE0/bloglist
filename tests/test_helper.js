const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
        _id: '642ee5c23c4be312be5e0b58',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: '642edaa592261ff47293eca9'
    },
    {
        _id: '642ee5c23c4be312be5e0b59',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        user: '642edaa592261ff47293ecac'
    },
    {
        _id: '642ee5c23c4be312be5e0b5a',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        user: '642edaa592261ff47293ecac'
    },
    {
        _id: '642ee5c23c4be312be5e0b5b',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        user: '642edaa592261ff47293ecaf'
    },
    {
        _id: '642ee5c23c4be312be5e0b5c',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        user: '642edaa592261ff47293ecaf'
    },
    {
        _id: '642ee5c23c4be312be5e0b5d',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        user: '642edaa592261ff47293ecaf'
    }  
]

const initialUsers = [
    {
        _id: '642edaa592261ff47293eca9',
        username: 'mickey',
        name: 'Michael Chan',
        password: 'password1',
        passwordHash: '$2b$10$tl4.M1QjSkvawxMB5iG70u5ZVzfBPr0Ds51IC4L/m/KBE7MlMBVfW',
        blogs: ['642ee5c23c4be312be5e0b58']
    },
    {
        _id: '642edaa592261ff47293ecac',
        username: 'edster',
        name: 'Edsger W. Dijkstra',
        password: 'password2',
        passwordHash: '$2b$10$MBN6509MotuUjAn/5K2zW.OAhYhXa8O3W1bKDCuWcZIBzsRRcDZFS',
        blogs: ['642ee5c23c4be312be5e0b59','642ee5c23c4be312be5e0b5a']
    },
    {
        _id: '642edaa592261ff47293ecaf',
        username: 'rmartin',
        name: 'Robert C. Martin',
        password: 'password3',
        passwordHash: '$2b$10$PCHsp.13r6Y092.3XKcWseWZPWQCminUULm9ZuGhnrT67fR2x2UxO',
        blogs: ['642ee5c23c4be312be5e0b5b','642ee5c23c4be312be5e0b5c','642ee5c23c4be312be5e0b5d']
    }
]


const saveInitialUsers = async(users) => await Promise.all(users.map(u => new User(u).save()))

const saveInitialBlogs = async(blogs) => await Promise.all(blogs.map(b => new Blog(b).save()))


const blogsInDb = async() => {
    const blogs = await Blog.find({})
    return blogs
}

const usersInDb = async() => {
    const users = await User.find({})
    return users
}


const nonExistingId = async() => {
    const blog = new Blog({
        title: 'toDelete',
        author: 'toDelete',
        url: 'toDelete',
        likes: 0
    })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const createValidToken = async () => {
    const user = await User.findOne({})
    const userForToken = {
        username: user.username,
        id: user._id
    }
    
    return jwt.sign(userForToken, process.env.SECRET)
}

const createInvalidToken = () => {
    const userForToken = {
        username: 'nonExistingUser',
        id: '642edaa592261ff47293ecaf'
    }
    
    return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb,
    nonExistingId,
    saveInitialBlogs,
    saveInitialUsers,
    createValidToken,
    createInvalidToken
}