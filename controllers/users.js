const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')

//login router
usersRouter.post('/', async (req, res, next) => {
    if(!req.body.password){
        res.status(400).send({error: 'password is required'}).end()
    }
    else if(req.body.password.length < 3){
        res.status(400).send({error: 'password must be min 3 characters long'}).end()
    }
    else {
        try {
            const user = new User({
                username: req.body.username,
                name: req.body.name,
                passwordHash: bcrypt.hashSync(req.body.password,10)
            })

            const result = await user.save()
            res.status(201).json(result)
        }
        catch (exception) {
            next(exception)
        }
    }
})

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    }
    catch (exception){
        next(exception)
    }
})

module.exports = usersRouter