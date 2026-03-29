const pool = require('../db')

const getAllBooks = async () => {
  const result = await pool.query(`
      SELECT
        books.id,
        books.title,
        books.year,
        books.status,
        ARRAY_AGG(DISTINCT authors.name) AS authors,
        ARRAY_AGG(DISTINCT genres.name) AS genres
      FROM books
      LEFT JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN authors ON book_authors.author_id = authors.id
      LEFT JOIN book_genres ON books.id = book_genres.book_id
      LEFT JOIN genres ON book_genres.genre_id = genres.id
      GROUP BY books.id
    `)
  return result.rows
}

const getOneBook = async (id) => {
  const result = await pool.query(
    `SELECT
        books.id,
        books.title,
        books.year,
        books.status,
        ARRAY_AGG(DISTINCT authors.name) AS authors,
        ARRAY_AGG(DISTINCT genres.name) AS genres
      FROM books 
      LEFT JOIN book_authors ON books.id = book_authors.book_id
      LEFT JOIN authors ON book_authors.author_id = authors.id
      LEFT JOIN book_genres ON books.id = book_genres.book_id
      LEFT JOIN genres ON book_genres.genre_id = genres.id
      WHERE books.id = $1
      GROUP BY books.id
      `,
    [id],
  )
  return result.rows[0]
}

const deleteAllBooks = async () => {
  return await pool.query('TRUNCATE TABLE books CASCADE')
}

const createBook = async ({
  authors,
  genres,
  status,
  title,
  year,
  userId,
}) => {
  try {
    await pool.query('BEGIN')
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

    // 4. Add to user_books
    await pool.query(
      'INSERT INTO user_books (user_id, book_id) VALUES ($1, $2)',
      [userId, bookId],
    )

    await pool.query('COMMIT')

    const book = {
      id: bookId,
      authors,
      genres,
      status,
      title,
      year,
    }
    // console.log(book)
    return book
  } catch (error) {
    await pool.query('ROLLBACK')
    throw error
  }
}

const deleteBook = async (id) => {
  const result = await pool.query(
    'DELETE FROM books WHERE id = $1 RETURNING id',
    [id],
  )
  return result
}

module.exports = {
  getAllBooks,
  getOneBook,
  deleteAllBooks,
  createBook,
  deleteBook,
}
