const generateId = () => {
  const maxId =
    books.length > 0
      ? Math.max(...books.map((b) => Number(b.id)))
      : 0

  return String(maxId + 1)
}

module.exports = {
  generateId,
}
