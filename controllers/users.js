const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const pool = require('../db')
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  getUserbyId,
} = require('../models/userModel')
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

usersRouter.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  try {
    const user = await getUserbyId(req.params.id)
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' }) // 409 Conflict
    }
    res.json(user)
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

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(
      password,
      saltRounds,
    )

    try {
      let newUser = await createUser({
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(
      password,
      saltRounds,
    )

    try {
      let newUser = await createUser({
        email,
        name,
        passwordHash,
        passwordHash,
      })
      res.status(201).json(newUser)
      res.status(201).json(newUser)
    } catch (err) {
      if (err.message === 'Email already in use') {
        return res.status(409).json({ error: err.message }) // 409 Conflict
      }
      if (err.message === 'Email already in use') {
        return res.status(409).json({ error: err.message }) // 409 Conflict
      }
      res.status(500).json({ error: 'Database error' })
    }
  },
)

usersRouter.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  try {
    const result = await deleteUser(req.params.id)
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'User not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({ error: 'Database error' })
  }
})

usersRouter.delete('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  try {
    const result = await deleteUser(req.params.id)
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'User not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({ error: 'Database error' })
  }
})

module.exports = usersRouter
