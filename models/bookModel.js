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

module.exports = { getAllBooks, getOneBook }
