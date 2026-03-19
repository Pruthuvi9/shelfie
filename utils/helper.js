let books = [
  {
    title: 'The Lord of the Rings',
    authors: ['J. R. R. Tolkien'],
    year: 1945,
    genres: ['classics'],
    status: 'Read',
  },
  {
    title:
      'The Pragmatic Programmer: Your Journey to Mastery',
    authors: ['David Thomas', 'Andrew Hunt'],
    year: 1999,
    genres: ['Computer Science'],
    status: 'Not started',
  },
  {
    title:
      'Clean Code: A Handbook of Agile Software Craftsmanship',
    year: 2008,
    status: 'Not started',
    authors: ['Robert C. Martin'],
    genres: ['Computer Science'],
  },
]

const generateId = () => {
  const maxId =
    books.length > 0
      ? Math.max(...books.map((b) => Number(b.id)))
      : 0

  return String(maxId + 1)
}

module.exports = {
  generateId,
}
