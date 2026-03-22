const {
  test,
  after,
  beforeEach,
  before,
  describe,
} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const pool = require('../db')
const {
  createBook,
  getAllBooks,
} = require('../models/bookModel')
const helper = require('./test_helper')
// const { deleteAllBooks } = require('../models/bookModel')

const api = supertest(app)

beforeEach(async () => {
  await pool.query('DELETE FROM books')
  // await pool.query('TRUNCATE TABLE books CASCADE')

  try {
    // helper.initialBooks.forEach(async (book) => {
    //   await createBook({ ...book })
    //   console.log('saved book')
    // })

    for (let book of helper.initialBooks) {
      await createBook({ ...book })
      // console.log('saved book')
    }
    // await createBook({ ...helper.initialBooks[0] })

    // await createBook({ ...helper.initialBooks[1] })
    // console.log('created book 2')
    // console.log('saved test data to db')
  } catch (err) {
    console.log('error:', err)
  }
})

test('books are returned as json', async () => {
  await api
    .get('/api/v1/books')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all books are returned', async () => {
  const res = await api.get('/api/v1/books')

  assert.strictEqual(res.body.length, 2)
})

test('a specific book is within the returned books', async () => {
  const res = await api.get('/api/v1/books')
  // console.log(res.body)
  // console.log(typeof res.body)
  const contents = res.body.map((e) => e.title)
  assert(
    contents.includes(
      'Structure and Interpretation of Computer Programs',
    ),
  )
})

describe.only('viewing a specific book', () => {
  test('succeeds with a valid id', async () => {
    const booksAtStart = await getAllBooks()
    const bookToView = booksAtStart[0]

    const result = await api.get(
      `/api/v1/books/${bookToView.id}`,
    )

    assert.deepStrictEqual(result.body, bookToView)
  })

  // test('fails with a status code 404 if book does not exist', async () => {

  // })
})

test('a valid book can be added', async () => {
  const newBook = {
    authors: ['Martin Kleppmann'],
    genres: ['Software Engineering', 'Computer Science'],
    status: 'Not started',
    title:
      'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    year: '2017',
  }

  await api
    .post('/api/v1/books')
    .send(newBook)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const booksAtEnd = await getAllBooks()
  assert.strictEqual(
    booksAtEnd.length,
    helper.initialBooks.length + 1,
  )
})

test('a book without a title is not added', async () => {
  const newBook = {
    authors: ['Martin Kleppmann'],
    genres: ['Software Engineering', 'Computer Science'],
    status: 'Not started',
    year: '2017',
  }

  await api.post('/api/v1/books').send(newBook).expect(400)

  const booksAtEnd = await getAllBooks()
  assert.strictEqual(
    booksAtEnd.length,
    helper.initialBooks.length,
  )
})

after(async () => {
  await pool.end()
})
