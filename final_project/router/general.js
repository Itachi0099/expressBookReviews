const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 1: Get the book list available in the shop (Async/Await)
public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      resolve(books);
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2: Get book details based on ISBN (Promises)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  let promise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  promise
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 3: Get book details based on author (Promises)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  let promise = new Promise((resolve, reject) => {
    let filteredBooks = [];

    for (let key in books) {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    }

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for this author");
    }
  });

  promise
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 4: Get all books based on title (Promises)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  let promise = new Promise((resolve, reject) => {
    let filteredBooks = [];

    for (let key in books) {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    }

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  });

  promise
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

module.exports.general = public_users;
