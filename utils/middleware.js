const { z } = require('zod')
// const logger = require('./logger')

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const err = z.flattenError(result.error).fieldErrors
    // console.log(err)
    return res.status(400).json({
      errors: err,
    })
  }
  req.validatedData = result.data // attach clean data to the request
  next()
}

const getTokenFrom = (req, res, next) => {
  const authorization = req.get('authorization')
  if (
    authorization &&
    authorization.startsWith('Bearer ')
  ) {
    req.token = authorization.replace('Bearer ', '')
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  validate,
  getTokenFrom,
}
