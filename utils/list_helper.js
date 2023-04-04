const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((accum, current)=> accum+current, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.length === 0? null
        :blogs.sort((a, b) => a.likes > b.likes)[0]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}