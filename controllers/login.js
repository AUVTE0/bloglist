const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res, next) => {

    try {
        const {username, password} = req.body
        
        const user = await User.findOne({'username': username})
        if(!user)
            return res.status(401).json({error: 'user not found'})
        
        const pwCorrect = password? 
            await bcrypt.compare(password, user.passwordHash)
            :false

        if(!pwCorrect)
            return res.status(401).json({error: 'wrong password'})

        const userForToken = {
            username: user.username,
            id: user._id
        }
        
        const token = jwt.sign(userForToken, process.env.SECRET)
        // console.log(token)
        res.status(200)
            .send({token, username: user.username, name: user.name})

    }
    catch(exception){
        next(exception)
    }
})


module.exports = loginRouter