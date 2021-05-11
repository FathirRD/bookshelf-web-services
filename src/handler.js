const { nanoid } = require('nanoid');
const bookshelf = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name) {
    if (readPage <= pageCount) {
      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
      };

      bookshelf.push(newBook);

      const books = bookshelf.filter((b) => b.id === id);
      const isSuccess = books.length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
            // book,
          },
        });
        response.code(201);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const params = request.query;

  if (params) {
    if (params.name) {
      const keywords = params.name;
      const lowKey = keywords.toLowerCase();
      const books = bookshelf.filter((b) => b.name.toLowerCase().indexOf(lowKey) > -1).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = books.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: `Menampilkan hasil untuk buku dengan nama ${keywords}`,
          data: {
            books,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'success',
        message: `Buku dengan nama ${keywords} tidak ditemukan`,
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }

    if (params.reading) {
      const keywords = Boolean(Number(params.reading));
      const books = bookshelf.filter((b) => b.reading === keywords).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = books.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: keywords === true ? 'Menampilkan hasil untuk buku yang sedang dibaca' : 'Menampilkan hasil untuk buku yang belum dibaca',
          data: {
            books,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'success',
        message: keywords === true ? 'Buku yang sedang dibaca tidak ditemukan' : 'Buku yang belum dibaca tidak ditemukan',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }

    if (params.finished) {
      const keywords = Boolean(Number(params.finished));
      const books = bookshelf.filter((b) => b.finished === keywords).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = books.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: keywords === true ? 'Menampilkan hasil untuk buku yang selesai dibaca' : 'Menampilkan hasil untuk buku yang belum selesai dibaca',
          data: {
            books,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'success',
        message: keywords === true ? 'Buku yang selesai dibaca tidak ditemukan' : 'Buku yang belum selesai dibaca tidak ditemukan',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }
  }

  const books = bookshelf.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookByBookIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByBookIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name) {
    if (readPage <= pageCount) {
      const updatedAt = new Date().toISOString();
      let finished = false;
      if (readPage === pageCount) {
        finished = true;
      }

      const index = bookshelf.findIndex((book) => book.id === bookId);
      const book = bookshelf.filter((b) => b.id === bookId)[0];

      if (index !== -1) {
        bookshelf[index] = {
          ...bookshelf[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          finished,
          updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
          data: {
            book,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

const deleteBookByBookIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByBookIdHandler,
  editBookByBookIdHandler,
  deleteBookByBookIdHandler,
};
