const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// let books = [
//   {
//     title: 'The Lord of the Rings',
//     authors: ['J. R. R. Tolkien'],
//     year: 1945,
//     genres: ['classics'],
//     status: 'Read',
//     id: '1',
//   },
//   {
//     title:
//       'The Pragmatic Programmer: Your Journey to Mastery',
//     author: ['David Thomas', 'Andrew Hunt'],
//     year: 1999,
//     genres: ['Computer Science'],
//     status: 'Not started',
//     id: '2',
//   },
// ]

// const generateId = () => {
//   const maxId =
//     books.length > 0
//       ? Math.max(...books.map((b) => Number(b.id)))
//       : 0

//   return String(maxId + 1)
// }

// const requestLogger = (req, res, next) => {
//   console.log('Method:', req.method)
//   console.log('Path:  ', req.path)
//   console.log('Body:  ', req.body)
//   console.log('---')
//   next()
// }
