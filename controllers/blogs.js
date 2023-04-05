const blogsRouter = require('express').Router()
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