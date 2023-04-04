const {dummy, totalLikes} = require('../utils/list_helper')

test('dummy returns 1', () => {
    const blogs = []
    const result = dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () =>{
    test('of empty list is zero', () => {
        const blogs = []
        expect(totalLikes(blogs)).toBe(0)
    })

    test('when list has only one blog equals likes of that', () => {
        const blogs = [ { totalLikes: 5 } ]
        expect(totalLikes(blogs)).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const blogs = [ 
            { totalLikes: 1 },
            { totalLikes: 3 },
            { totalLikes: 5 },
        ]
        expect(totalLikes(blogs)).toBe(9)
    })
})