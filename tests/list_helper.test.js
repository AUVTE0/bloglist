const {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes} = require('../utils/list_helper')
const testBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }  
]

test('dummy returns 1', () => {
    const blogs = []
    const result = dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        expect(totalLikes(blogs)).toBe(0)
    })

    test('when list has only one blog equals likes of that', () => {
        const blogs = [ { likes: 5 } ]
        expect(totalLikes(blogs)).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const blogs = testBlogs
        expect(totalLikes(blogs)).toBe(36)
    })
})

describe('favourite blog', () => {
    test('of empty list is null', () => {
        const blogs = []
        expect(favouriteBlog(blogs)).toBe(null)
    })

    test('of a bigger list is returns correct blog', () => {
        const blogs = testBlogs
        const favBlog =       {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        }
        expect(favouriteBlog(blogs)).toEqual(favBlog)
    })
})

describe('most blogs', () => {
    test('of empty list is null', () => {
        const blogs = []
        expect(mostBlogs(blogs)).toBe(null)
    })
    test('of a bigger list is returns correct author and count', () => {
        const blogs = testBlogs
        const count = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(mostBlogs(blogs)).toEqual(count)
    })
})

describe('most likes', () => {
    test('of empty list is null', () => {
        const blogs = []
        expect(mostLikes(blogs)).toBe(null)
    })
    test('of a bigger list is returns correct author and count', () => {
        const blogs = testBlogs
        const sum = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(mostLikes(blogs)).toEqual(sum)
    })
})