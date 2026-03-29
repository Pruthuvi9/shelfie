const {
  test,
  after,
  beforeEach,
  before,
  describe,
} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
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
    // await pool.query('TRUNCATE TABLE books CASCADE')

    for (let book of helper.initialBooks) {
      await createBook({ ...book })
      // console.log('saved book')
    }
  })

  test('books are returned as json', async () => {
    await api
      .get('/api/v1/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('books are returned as json', async () => {
    await api
      .get('/api/v1/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all books are returned', async () => {
    const res = await api.get('/api/v1/books')
  test('all books are returned', async () => {
    const res = await api.get('/api/v1/books')

    assert.strictEqual(res.body.length, 2)
  })
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
  describe('viewing a specific book', () => {
    test('succeeds with a valid id', async () => {
      const booksAtStart = await getAllBooks()
      const bookToView = booksAtStart[0]

      const result = await api.get(
        `/api/v1/books/${bookToView.id}`,
      )
      const result = await api.get(
        `/api/v1/books/${bookToView.id}`,
      )

      assert.deepStrictEqual(result.body, bookToView)
    })
      assert.deepStrictEqual(result.body, bookToView)
    })

    test('fails with a status code 404 if book does not exist', async () => {
      const result = await api.get('/api/v1/books/1000')
      assert.strictEqual(result.status, 404)
      assert.strictEqual(result.body.error, 'Not found')
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
    test('fails with a status code 400 if id is not a number', async () => {
      const result = await api.get(
        '/api/v1/books/not-a-number',
      )
      assert.strictEqual(result.status, 400)
      assert.strictEqual(result.body.error, 'Invalid id')
    })
  })

  describe('adding a book', () => {
    test('a valid book can be added', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: 2017,
        title:
          'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
      }
  describe('adding a book', () => {
    test('a valid book can be added', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: 2017,
        title:
          'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
      }

      await api
        .post('/api/v1/books')
        .send(newBook)
        .expect(201)
        .expect('Content-Type', /application\/json/)
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
      assert.strictEqual(
        booksAtEnd[booksAtEnd.length - 1].title,
        newBook.title,
      )
    })
      const booksAtEnd = await getAllBooks()
      assert.strictEqual(
        booksAtEnd.length,
        helper.initialBooks.length + 1,
      )
      assert.strictEqual(
        booksAtEnd[booksAtEnd.length - 1].title,
        newBook.title,
      )
    })

    test('a book without a title is not added', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: '2017',
      }
    test('a book without a title is not added', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: '2017',
      }

      await api
        .post('/api/v1/books')
        .send(newBook)
        .expect(400)
      await api
        .post('/api/v1/books')
        .send(newBook)
        .expect(400)

      const booksAtEnd = await getAllBooks()
      assert.strictEqual(
        booksAtEnd.length,
        helper.initialBooks.length,
      )
    })

    test('fails with a status code 400 if data is invalid', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: 2017,
      }
      await api
        .post('/api/v1/books')
        .send(newBook)
        .expect(400)
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

    test('fails with a status code 400 if id is not a number', async () => {
      const result = await api.delete(
        '/api/v1/books/not-a-number',
      )
      assert.strictEqual(result.status, 400)
      assert.strictEqual(result.body.error, 'Invalid id')
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
      .post('/api/v1/users')
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
      .post('/api/v1/users')
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
      const booksAtEnd = await getAllBooks()
      assert.strictEqual(
        booksAtEnd.length,
        helper.initialBooks.length,
      )
    })

    test('fails with a status code 400 if data is invalid', async () => {
      const newBook = {
        authors: ['Martin Kleppmann'],
        genres: [
          'Software Engineering',
          'Computer Science',
        ],
        status: 'Not started',
        year: 2017,
      }
      await api
        .post('/api/v1/books')
        .send(newBook)
        .expect(400)
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

    test('fails with a status code 400 if id is not a number', async () => {
      const result = await api.delete(
        '/api/v1/books/not-a-number',
      )
      assert.strictEqual(result.status, 400)
      assert.strictEqual(result.body.error, 'Invalid id')
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
      .post('/api/v1/users')
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
      .post('/api/v1/users')
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

after(async () => {
  await pool.end()
})
