const express = require('express')
var morgan = require('morgan')
const middleware = require('./utils/middleware')
const booksRouter = require('./controllers/books')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()
app.use(express.json())

morgan.token('body', function (req, res) {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = { ...req.body }
    if (sanitizedBody.password)
      sanitizedBody.password = '******'
    if (sanitizedBody.token) sanitizedBody.token = '******'
    return JSON.stringify(sanitizedBody)
  }
  return ''
})

// app.use(morgan('combined', {
//   skip: function (req, res) {
//     return req.url === '/api/login' || req.url === '/api/register';
//   }
// }));

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

app.use('/api/v1/books', booksRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/login', loginRouter)

app.use(middleware.unknownEndpoint)

module.exports = app
