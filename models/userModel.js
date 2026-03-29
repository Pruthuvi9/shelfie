const pool = require('../db')

const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, email, name FROM users',
  )
  return result.rows
}

const deleteAll = async () => {
  return await pool.query('DELETE from users')
}

const createUser = async ({
  email,
  name,
  passwordHash,
}) => {
  try {
    await pool.query('BEGIN')
    const userResults = await pool.query(
      `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [email, name, passwordHash],
    )
    const userId = userResults.rows[0].id
    await pool.query('COMMIT')
    const user = {
      id: userId,
      email,
      name,
    }
    return user
  } catch (error) {
    await pool.query('ROLLBACK')
    if (error.code === '23505') {
      throw new Error('Email already in use', {
        cause: error,
      })
    }
    throw error
  }
}

const deleteUser = async (id) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [id],
  )
  return result
}

const getUserbyEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email],
  )
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    name: result.rows[0].name,
    passwordHash: result.rows[0].password_hash,
  }
}

const getUserbyId = async (id) => {
  const result = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [id],
  )
  return result.rows[0]
}

module.exports = {
  getAllUsers,
  deleteAll,
  createUser,
  deleteUser,
  getUserbyEmail,
  getUserbyId,
}
