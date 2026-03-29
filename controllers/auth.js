const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('./login')
const registerRouter = require('./register')
const router = require('express').Router()

router.use('/login', loginRouter)
router.use('/register', registerRouter)

module.exports = router
