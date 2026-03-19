const express = require('express')
var morgan = require('morgan')
const middleware = require('./utils/middleware')
const booksRouter = require('./controllers/books')
const usersRouter = require('./controllers/users')

const app = express()
app.use(express.json())

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms - :body',
    ),
  )
}
// app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.use('/api/books', booksRouter)

app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
