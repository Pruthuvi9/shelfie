const express = require('express')
const app = express()
const PORT = 3001

const books = [
  {
    title: 'The Lord of the Rings',
    authors: ['J. R. R. Tolkien'],
    year: 1945,
    genres: ['classics'],
  },
  {
    title:
      'The Pragmatic Programmer: Your Journey to Mastery',
    author: ['David Thomas', 'Andrew Hunt'],
    year: 1999,
    genres: ['Computer Science'],
  },
]

app.get('/', (request, response) => {
  response.send('Hello world!')
})

app.get('/api/books', (request, response) => {
  response.json(books)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
