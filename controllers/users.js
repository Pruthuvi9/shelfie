const usersRouter = require('express').Router()
const pool = require('../db')
const { getAllUsers } = require('../models/userModel')
const { validate } = require('../utils/middleware')
const {
  userSchema,
} = require('../validators/userValidator')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

usersRouter.post(
  '/',
  validate(userSchema),
  async (req, res) => {
    const { email, name, password } = req.validatedData

    try {
      await pool.query('BEGIN')
      const userResult = await pool.query(
        `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id`,
        [email, name, password],
      )

      const userId = userResult.rows[0].id

      await pool.query('COMMIT')
      res.status(201).json({
        id: userId,
        email,
        name,
      })
    } catch (err) {
      await pool.query('ROLLBACK')
      console.log('error:', err)
      res.status(500).json({ error: 'Database error' })
    }
  },
)

module.exports = usersRouter
