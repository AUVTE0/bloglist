const blogsRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
    const blog = new Blog(req.body)
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
        const result = await blog.findByIdAndDelete(req.params.id)
        if(result)
            res.status(204).json(result)
        res.status(404).json(result)
    }
    catch (exception) {
        next(exception)
    }
})
module.exports = blogsRouter