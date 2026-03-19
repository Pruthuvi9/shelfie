const { z } = require('zod')

const userSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(1, 'Password is required'),
})

module.exports = { userSchema }
