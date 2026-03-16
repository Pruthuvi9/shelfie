const express = require('express')
const pool = require('./db')
const middleware = require('./utils/middleware')
const {
  getAllBooks,
  getOneBook,
} = require('./models/bookModel')
const { getAllUsers } = require('./models/userModel')

const app = express()
app.use(express.json())

app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/api/books', async (req, res) => {
  try {
    const books = await getAllBooks()
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params
    const book = await getOneBook(id)
    if (!book)
      return res.status(404).json({ error: 'Not found' })
    res.json(book)
  } catch (err) {
    console.log('error: ', err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.post('/api/books/', async (req, res) => {
  try {
    await pool.query('BEGIN')

    const { authors, genres, status, title, year } =
      req.body
    const bookResult = await pool.query(
      `INSERT INTO books (title, year, status) VALUES ($1, $2, $3) RETURNING id`,
      [title, year, status],
    )
    const bookId = bookResult.rows[0].id

    // 2. Insert author and link it
    for (const authorName of authors) {
      const authorResult = await pool.query(
        `INSERT INTO authors (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [authorName],
      )
      await pool.query(
        `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`,
        [bookId, authorResult.rows[0].id],
      )
    }

    // 3. Same for genre
    for (const genreName of genres) {
      const genreResult = await pool.query(
        `INSERT INTO genres (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [genreName],
      )
      await pool.query(
        `INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)`,
        [bookId, genreResult.rows[0].id],
      )
    }

    await pool.query('COMMIT')
    res.status(201).json({
      id: bookId,
      title,
      authors,
      genres,
      year,
      status,
    })
  } catch (err) {
    await pool.query('ROLLBACK')
    console.log('error:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

app.use(middleware.unknownEndpoint)

module.exports = app
