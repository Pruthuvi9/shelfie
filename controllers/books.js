const booksRouter = require('express').Router()
// const pool = require('../db')
const { validate } = require('../utils/middleware')
const {
  bookSchema,
} = require('../validators/bookValidator')
const {
  getAllBooks,
  getOneBook,
  createBook,
  deleteBook,
} = require('../models/bookModel')

booksRouter.get('/', async (req, res) => {
  try {
    const books = await getAllBooks()
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

booksRouter.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  const book = await getOneBook(req.params.id)
  if (book) {
    res.json(book)
  } else {
    return res.status(404).json({ error: 'Not found' })
  }
})

booksRouter.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  try {
    const result = await deleteBook(req.params.id)
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Book not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({ error: 'Database error' })
  }
})

booksRouter.post(
  '/',
  validate(bookSchema),
  async (req, res) => {
    // this can be simplified with express 5
    // express automatically calls next middleware when an error is thrown

    try {
      const book = await createBook(req.validatedData)
      // console.log(book)
      res.status(201).json(book)
    } catch (err) {
      console.log('error:', err)
      res.status(500).json({ error: 'Database error' })
    }
  },
)

module.exports = booksRouter
