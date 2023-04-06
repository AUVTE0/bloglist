const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {

    logger.info(req.headers)
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path )
    logger.info('Body: ', req.body)
    logger.info('---')
    next()
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.name, error.message)

    if (error.name === 'CastError'){
        return res.status(400).send({ error: 'malformed id'})
    }
    if (req.path === '/api/users' && error.name === 'ValidationError'){
        return res.status(400).send({ error: `invalid user creation: ${error.message}`})
    }
    if (error.name === 'ValidationError'){
        return res.status(400).send({ error: 'missing property or incorrect type'})
    }
    if (error.name === 'JsonWebTokenError'){
        return res.status(401).send({ error: 'invalid token'})
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    logger.info('request made with unknown endpoint')
    res.status(400).send({error: 'unknown endpoint'})
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')
    
    req['token'] = (auth && auth.startsWith('Bearer '))?
        auth.replace('Bearer ','')
        :null
    next()
}

const userExtractor = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if(!decodedToken.id)
            return res.status(401).json({error: 'invalid token'})
    
        const user = await User.findById(decodedToken.id)
        if(!user)
            return res.status(401).json({error: 'user not found'})
        req['user'] = user
        next()
    }
    catch(exception){
        next(exception)
    }
}
module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}