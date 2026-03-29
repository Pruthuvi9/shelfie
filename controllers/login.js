const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { getUserbyEmail } = require('../models/userModel')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await getUserbyEmail(email)
//   console.log(user)
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

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
    token,
    email: user.email,
    name: user.name,
  })
})

module.exports = loginRouter
