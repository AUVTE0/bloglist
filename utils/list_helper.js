const _ = require('lodash')

const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) => {
    return _.sumBy(blogs, b => b.likes)
    // return blogs.map(blog => blog.likes).reduce((accum, current)=> accum+current, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.length === 0? null
        :_.maxBy(blogs, b => b.likes)
}

const mostBlogs = (blogs) => {
    const countBlogs = _.countBy(blogs, 'author')
    const maxCount = _.max(_.values(countBlogs))
    return blogs.length === 0? null
        :{
            'author': _.findKey(countBlogs, count => count === maxCount),
            'blogs': maxCount
        }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}