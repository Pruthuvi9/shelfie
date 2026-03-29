const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
  userSchema,
} = require('../validators/userValidator')
const { validate } = require('../utils/middleware')
const { createUser } = require('../models/userModel')
const registerRouter = require('express').Router()

registerRouter.post(
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
        email,
        name,
        passwordHash,
      })
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

module.exports = registerRouter
