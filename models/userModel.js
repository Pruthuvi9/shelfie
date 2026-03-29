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
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const userResults = await pool.query(
      `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [email, name, passwordHash],
    )
    const userId = userResults.rows[0].id
    await client.query('COMMIT')
    const user = {
      id: userId,
      email,
      name,
    }
    return user
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') {
      throw new Error('Email already in use', {
        cause: error,
      })
    }
    throw error
  } finally {
    client.release()
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

  return result
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
