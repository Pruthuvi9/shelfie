const { z } = require('zod')

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z
    .array(z.string().min(1))
    .min(1, 'At least one author is required'),
  genres: z
    .array(z.string().min(1))
    .min(1, 'At least one genre is required'),
  year: z.coerce
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear()),
  status: z.enum(['Read', 'Reading', 'Not started']),
})

module.exports = { bookSchema }
