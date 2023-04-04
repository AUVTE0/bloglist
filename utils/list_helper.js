const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(blog => blog.totalLikes).reduce((accum, current)=> accum+current, 0)
}

module.exports = {
    dummy,
    totalLikes
}