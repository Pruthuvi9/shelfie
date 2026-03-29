const {
  test,
  after,
  beforeEach,
  describe,
  before,
} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const pool = require('../db')
const {
  createBook,
  getAllBooks,
} = require('../models/bookModel')
const {
  getAllUsers,
  deleteAll,
  createUser,
} = require('../models/userModel')
const helper = require('./test_helper')
// const { deleteAllBooks } = require('../models/bookModel')

const api = supertest(app)

describe('when there is initially some books saved', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM books')
    await pool.query('DELETE FROM users')
    // await pool.query('TRUNCATE TABLE books CASCADE')

    let testUser = {
      email: 'test_user@test.com',
      name: 'Test User',
      password: 'mypassword',
    }

    await api.post('/api/v1/auth/register').send(testUser)

    const res = await api.post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    // console.log(res)

    for (let book of helper.initialBooks) {
      await createBook({ ...book, userId: res.body.id })
      // console.log('saved book')
    }
  })

  test.only('books are returned as json', async () => {
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

  describe('viewing a specific book', () => {
    test('succeeds with a valid id', async () => {
      const booksAtStart = await getAllBooks()
      const bookToView = booksAtStart[0]

      const result = await api.get(
        `/api/v1/books/${bookToView.id}`,
      )

      assert.deepStrictEqual(result.body, bookToView)
    })

    test('fails with a status code 404 if book does not exist', async () => {
      const result = await api.get('/api/v1/books/1000')
      assert.strictEqual(result.status, 404)
      assert.strictEqual(result.body.error, 'Not found')
    })

    test('fails with a status code 400 if id is not a number', async () => {
      const result = await api.get(
        '/api/v1/books/not-a-number',
      )
      assert.strictEqual(result.status, 400)
      assert.strictEqual(result.body.error, 'Invalid id')
    })
  })

  describe('deleting a book', () => {
    test('succeeds with a valid id', async () => {
      const booksAtStart = await getAllBooks()
      const bookToDelete = booksAtStart[0]

      await api
        .delete(`/api/v1/books/${bookToDelete.id}`)
        .expect(204)
    })

    test('fails with a status code 404 if book does not exist', async () => {
      const result = await api.delete('/api/v1/books/1000')
      assert.strictEqual(result.status, 404)
      assert.strictEqual(
        result.body.error,
        'Book not found',
      )
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await deleteAll()

    const passwordHash = await bcrypt.hash('sekret', 10)
    await createUser({
      email: 'test@test.com',
      name: 'Test User',
      passwordHash,
    })
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      name: 'Pruthuvi Fernando',
      email: 'pruthuvi@pruthuvi.com',
      password: 'vimukthi',
    }

    await api
      .post('/api/v1/auth/register')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length + 1,
    )

    const emails = usersAtEnd.map((u) => u.email)
    // console.log('emails', emails)
    assert(emails.includes(newUser.email))
  })

  test.only('creation fails with proper statuscode and message if email already taken', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      email: 'test@test.com',
      name: 'New User',
      password: 'salainen',
    }

    const result = await api
      .post('/api/v1/auth/register')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert(
      result.body.error.includes('Email already in use'),
    )

    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length,
    )
  })
})

// describe('when a user is logged in', async () => {
//   await pool.query('DELETE FROM users')

//   let token = null

//   before(async () => {
//     let testUser = {
//       email: 'test_user@test.com',
//       name: 'Test User',
//       password: 'mypassword',
//     }

//     await api.post('/api/v1/auth/register').send(testUser)

//     const res = await api.post('/api/v1/auth/login').send({
//       email: testUser.email,
//       password: testUser.password,
//     })

//     token = res.token
//   })

//   test('a new book can be added', async () => {
//     let
//   })
// })

after(async () => {
  await pool.end()
})
