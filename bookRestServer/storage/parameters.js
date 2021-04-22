'use strict';
const toArrayInsert = book =>[
    +book.bookID, book.name, book.author, book.type, +book.year
]

const toArrayUpdate = book => [
    book.name, book.author, book.type, +book.year, +book.bookID
]

module.exports={toArrayInsert, toArrayUpdate}