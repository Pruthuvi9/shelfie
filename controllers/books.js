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

booksRouter.post(
  '/',
  validate(bookSchema),
  async (req, res) => {
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
