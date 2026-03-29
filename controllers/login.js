const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { getUserbyEmail } = require('../models/userModel')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const userResult = await getUserbyEmail(email)
  //   console.log(user)
  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' })
  }

  const user = userResult.rows[0]
  // console.log(user)

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(password, user.password_hash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    email: user.email,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({
    ...user,
    token,
  })
})

module.exports = loginRouter
