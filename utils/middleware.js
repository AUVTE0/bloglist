const logger = require('./logger')

const requestLogger = (req, res, next) => {

    logger.info(req.headers)
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path )
    logger.info('Body: ', req.body)
    logger.info('---')
    next()
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError'){
        return res.status(400).send({ error: 'malformed id'})
    }
    if (error.name === 'ValidationError'){
        return res.status(400).send({ error: 'missing property or incorrect type'})
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    logger.info('request made with unknown endpoint')
    res.status(400).send({error: 'unknown endpoint'})
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint
}