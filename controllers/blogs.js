const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

//blogs api
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', { blogs: 0 })
    res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
    const user = await User.findOne()
    const blog = new Blog({...req.body, user: user._id})

    try {
        const result = await blog.save()
        res.status(201).json(result)
    }
    catch (exception){
        next(exception)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    try {
        const result = await Blog.findByIdAndDelete(req.params.id)
        if(result)
            res.status(204).json(result)
        else
            res.status(404).json(result)
    }
    catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    try {
        const result = await Blog.findByIdAndUpdate(req.params.id, req.body, { new : true })

        if(result)
            res.status(200).json(result)
        else
            res.status(404).json(result)
    }
    catch (exception) {
        next(exception)
    }
})



module.exports = blogsRouter

