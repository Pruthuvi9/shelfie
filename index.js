const express = require("express")
const app = express()
const PORT = 3001

let books = [
  {
    title: "The Lord of the Rings",
    authors: ["J. R. R. Tolkien"],
    year: 1945,
    genres: ["classics"],
    status: "Read",
    id: "1",
  },
  {
    title: "The Pragmatic Programmer: Your Journey to Mastery",
    author: ["David Thomas", "Andrew Hunt"],
    year: 1999,
    genres: ["Computer Science"],
    status: "Not started",
    id: "2",
  },
]

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello world!")
})

app.get("/api/books", (req, res) => {
  res.json(books)
})

app.get("/api/books/:id", (req, res) => {
  const id = req.params.id
  const book = books.find((book) => book.id === id)

  if (book) {
    res.json(book)
  } else {
    res.status(404).end()
  }
})

app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id
  books = books.filter((book) => book.id !== id)

  res.status(204).end()
})

app.post("/api/books/", (req, res) => {
  const book = req.body
  console.log(book)
  res.json(book)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
