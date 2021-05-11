const { nanoid } = require('nanoid');
const books = require('./books');

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
    finished,
  } = request.payload;

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

      books.push(newBook);

      const book = books.filter((b) => b.id === id);
      const isSuccess = book.length > 0;

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
      const lowKeywords = keywords.toLowerCase();
      const book = books.filter((b) => b.name.toLowerCase().indexOf(lowKeywords) > -1).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = book.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: `Menampilkan hasil untuk buku dengan nama ${keywords}`,
          data: {
            book,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: `Buku dengan nama ${keywords} tidak ditemukan`,
        data: {
          book,
        },
      });
      response.code(404);
      return response;
    }

    if (params.reading) {
      const keywords = Boolean(Number(params.reading));
      const book = books.filter((b) => b.reading === keywords).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = book.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: keywords === true ? 'Menampilkan hasil untuk buku yang sedang dibaca' : 'Menampilkan hasil untuk buku yang belum dibaca',
          data: {
            book,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: keywords === true ? 'Buku yang sedang dibaca tidak ditemukan' : 'Buku yang belum dibaca tidak ditemukan',
        data: {
          book,
        },
      });
      response.code(404);
      return response;
    }

    if (params.finished) {
      const keywords = Boolean(Number(params.finished));
      const book = books.filter((b) => b.finished === keywords).map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
      const isExist = book.length > 0;

      if (isExist) {
        const response = h.response({
          status: 'success',
          message: keywords === true ? 'Menampilkan hasil untuk buku yang selesai dibaca' : 'Menampilkan hasil untuk buku yang belum selesai dibaca',
          data: {
            book,
          },
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: keywords === true ? 'Buku yang selesai dibaca tidak ditemukan' : 'Buku yang belum selesai dibaca tidak ditemukan',
        data: {
          book,
        },
      });
      response.code(404);
      return response;
    }
  }

  const book = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const getBookByBookIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

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
    finished,
  } = request.payload;

  if (name) {
    if (readPage <= pageCount) {
      const updatedAt = new Date().toISOString();
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
          finished,
          updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
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

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
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
