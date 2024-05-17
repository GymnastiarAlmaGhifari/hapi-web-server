const { nanoid } = require("nanoid");
const books = require("./books");

/*========
  POST Handler
  /books handler
=========*/
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const response = (status, message, code, data) => h.response({ status, message, data }).code(code);

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (!name || name === "") {
    return response("fail", "Gagal menambahkan buku. Mohon isi nama buku", 400);
  }

  if (readPage > pageCount) {
    return response("fail", "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount", 400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  if (books.filter((book) => book.id === id).length > 0) {
    return response("success", "Buku berhasil ditambahkan", 201, { bookId: id });
  }

  return response("error", "Buku gagal ditambah", 500);
};

/*========
  GET Handler
  /books handler
=========*/
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const response = (status, message, code, data) => h.response({ status, message, data }).code(code);
  const BookReading = reading === "1";
  const BookFinished = finished === "1";
  let booksQuery = books;

  if (name !== undefined) {
    booksQuery = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    booksQuery = books.filter((book) => book.reading === BookReading);
  }

  if (finished !== undefined) {
    booksQuery = books.filter((book) => book.finished === BookFinished);
  }

  return response("success", "Buku berhasil ditemukan", 200, {
    books: booksQuery.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  });
};

/*========
  // GET Handler 
  /books/{bookId}
=========*/

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const response = (status, message, code, data) => h.response({ status, message, data }).code(code);

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return response("success", "Buku ditemukan", 200, { book });
  }

  return response("fail", "Buku tidak ditemukan", 404);
};

/*========
//  PUT Handler
 /books/{bookId}
=========*/
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const response = (status, message, code, data) => h.response({ status, message, data }).code(code);

  if (!name || name === "") {
    return response("fail", "Gagal memperbarui buku. Mohon isi nama buku", 400);
  }

  if (readPage > pageCount) {
    return response("fail", "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount", 400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return response("success", "Buku berhasil diperbarui", 200, { bookId });
  }

  return response("fail", "Gagal memperbarui buku. Id tidak ditemukan", 404);
};
/*========
  DELETE Handler
  /books/{bookId} 
=========*/
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const response = (status, message, code, data) => h.response({ status, message, data }).code(code);

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return response("success", "Buku berhasil dihapus", 200, { bookId });
  }
  return response("fail", "Buku gagal dihapus. Id tidak ditemukan", 404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
