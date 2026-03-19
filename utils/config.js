require('dotenv').config()

const PORT = process.env.PORT
const DATABASE_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URI
    : process.env.NODE_ENV === 'dev'
      ? process.env.DEV_DATABASE_URI
      : process.env.DEV_DATABASE_URI
// const MONGODB_URI = process.env.MONGODB_URI

module.exports = { PORT, DATABASE_URI }
