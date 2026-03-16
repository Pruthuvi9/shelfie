CREATE TABLE IF NOT EXISTS book_genres (
  book_id  INT REFERENCES books(id) ON DELETE CASCADE,
  genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, genre_id)
);