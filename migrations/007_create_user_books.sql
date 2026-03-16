CREATE TABLE IF NOT EXISTS user_books (
  user_id   INT REFERENCES users(id) ON DELETE CASCADE,
  book_id   INT REFERENCES books(id) ON DELETE CASCADE,
  status    TEXT NOT NULL DEFAULT 'Not started',
  PRIMARY KEY (user_id, book_id)
);