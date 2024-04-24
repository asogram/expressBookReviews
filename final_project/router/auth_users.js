const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
let users = [];

const isValid = (username) => {
  let result = users.filter((user) => {
    return user.username === username
  });
  if (result.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  for (let user of users) {
    if (
      req.body.username === user.username &&
      req.body.password === user.password
    ) {
      return res.status(200).json({
        id: user.id,
        login: user.username,
        token: jwt.sign({ id: user.id }, tokenKey),
      });
    }
  }
  return res.status(404).json({ message: 'User not found' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (req.user) {
    Object.keys(books).forEach(function (i) {
      if (i == req.params.isbn) {
        let reviews = {};
        Object.keys(books[i].reviews).forEach(function (j) {
          reviews[j] = books[i].reviews[j];
        });
        console.log(req.body);
        reviews[req.user.id] = req.body;
        books[i].reviews = reviews;
        return res.status(200).json(books[i].reviews);
      }
    });
    return res.status(300).json({ message: "ISBN not found" });
  } else {
    return res.status(401).json({ message: 'Not authorized' });
  }
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.user) {
    Object.keys(books).forEach(function (i) {
      if (i == req.params.isbn) {
        let reviews = {};
        Object.keys(books[i].reviews).forEach(function (j) {
          if (req.user.id != j) {
            reviews[j] = books[i].reviews[j];
          }
        });
        books[i].reviews = reviews;
        return res.status(200).json(books[i].reviews);
      }
    });
    return res.status(300).json({ message: "ISBN not found" });
  } else {
    return res.status(401).json({ message: 'Not authorized' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
