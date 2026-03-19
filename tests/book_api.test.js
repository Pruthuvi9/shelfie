const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const pool = require('../db')
// const { deleteAllBooks } = require('../models/bookModel')

const api = supertest(app)

const initialBooks = [
  {
    title:
      'Structure and Interpretation of Computer Programs',
    year: 1985,
    status: 'Reading',
    authors: [
      'Gerald Jay Sussman',
      'Hal Abelson',
      'Julie Sussman',
    ],
    genres: ['Computer Science'],
  },
  {
    title:
      'The Pragmatic Programmer: Your Journey to Mastery',
    year: 1999,
    status: 'Not started',
    authors: ['Andrew Hunt', 'David Thomas'],
    genres: ['Computer Science'],
  },
]

beforeEach(async () => {
  await pool.query('DELETE FROM books')
})

test('books are returned as json', async () => {
  await api
    .get('/api/books')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all books are returned', async () => {
  const res = await api.get('/api/books')

  assert.strictEqual(res.body.length, 0)
})

// test('a specific book is within the returned books', async () => {
//   const res = await api.get('/api/books')
//   // console.log(res.body)
//   // console.log(typeof res.body)
//   const contents = res.body.map((e) => e.title)
//   assert(
//     contents.includes(
//       'Structure and Interpretation of Computer Programs',
//     ),
//   )
// })

after(async () => {
  await pool.end()
})
