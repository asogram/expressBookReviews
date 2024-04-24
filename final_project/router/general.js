const fs = require('fs/promises');
const express = require('express');
let books = require("./booksdb.js");
const path = require('path');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username === null || username.trim() === "" || password === null || password.trim() === "") {
    return res.status(300).json({ message: "User or password is empty" });
  } else {
    if (isValid(username)) {
      users.push({ "id": users.length, "username": username, "password": password });
      return res.status(200).json({ message: "User is registered" });
    } else {
      return res.status(300).json({ message: "User already exists" });
    }
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => Promise.resolve()
  .then(() => res.json(books))
  .catch(() => res.status(500).json({ message: "Internal server error" })));

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => Promise.resolve(req.params.isbn)
  .then(function (isbn) {
    return Object.keys(books).find((index) => isbn == index);
  })
  .then(function (index) {
    if (index) {
      res.json(books[index]);
    } else {
      res.json({ message: "ISBN not found" });
    }
  })
  .catch(() => res.json({ message: "Internal server error" }))
);

// Get book details based on author
public_users.get('/author/:author', (req, res) => Promise.resolve(req.params.author)
  .then(function (author) {
    return Object.keys(books).find((index) => books[index].author.toLowerCase().includes(author.toLowerCase()));
  })
  .then(function (index) {
    if (index) {
      res.json(books[index]);
    } else {
      res.json({ message: "Author not found" });
    }
  })
  .catch(() => res.json({ message: "Internal server error" }))
);

// Get all books based on title
public_users.get('/title/:title', (req, res) => Promise.resolve(req.params.title)
  .then(function (title) {
    return Object.keys(books).find((index) => books[index].title.toLowerCase().includes(title.toLowerCase()));
  })
  .then(function (index) {
    if (index) {
      res.json(books[index]);
    } else {
      res.json({ message: "Title not found" });
    }
  })
  .catch(() => res.json({ message: "Internal server error" }))
);

//  Get book review
public_users.get('/review/:isbn', (req, res) => Promise.resolve(req.params.isbn)
  .then(function (isbn) {
    return Object.keys(books).find((index) => isbn == index);
  })
  .then(function (index) {
    if (index) {
      res.json(books[index].reviews);
    } else {
      res.json({ message: "ISBN not found" });
    }
  })
  .catch(() => res.json({ message: "Internal server error" }))
);

module.exports.general = public_users;
