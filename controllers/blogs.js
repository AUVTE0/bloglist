const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

//blogs api
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', { blogs: 0 })
    res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res, next) => {
    
    try {
        // const decodedToken = jwt.verify(req.token, process.env.SECRET)
        
        // if(!decodedToken.id)
        //     return res.status(401).json({error: 'invalid token'})
        
        // const user = await User.findById(decodedToken.id)
        const user = req.user
        const blog = new Blog({...req.body, user: user._id})
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.status(201).json(savedBlog)
    }
    catch (exception){
        next(exception)
    }
})

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
    try {
        // const decodedToken = jwt.verify(req.token, process.env.SECRET)

        // const user = await User.findById(decodedToken.id)
        const user = req.user
        const blog = await Blog.findById(req.params.id)
        
        if(!blog)
            return res.status(404).json({error: 'not found'})
        if(blog.user !== user.id)
            return res.status(401).json({error: 'unauthorized deletion of blog'})
        const result = await Blog.findByIdAndDelete(req.params.id)
        
        if(result)
            res.status(204).json(result)
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
            return res.status(404).json(result)
    }
    catch (exception) {
        next(exception)
    }
})



module.exports = blogsRouter

