const pool = require('../db')

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

module.exports = { initialBooks }
