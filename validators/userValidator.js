const { z } = require('zod')

const userSchema = z.object({
  email: z
    .email('Invalid email format')
    .min(1, 'Email is required'),
  name: z.string().min(1, 'Name is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

module.exports = { userSchema }
