const pool = require('../db')

const getAllUsers = async () => {
  const result = await pool.query('SELECT email, name FROM users')
  return result.rows
}

module.exports = { getAllUsers }
