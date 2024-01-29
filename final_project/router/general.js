const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	isbn = req.params.isbn;
  	if (isbn < 1 || !books[isbn]) {
		return res.status(403).json({message: "Invalid ISBN number"});
  	}
  	return res.send(books[isbn]);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	author = req.params.author;
	console.log(`author name passed: ${author}`);
	requestedBook = []
	for (const key in books) {
		if (books[key].author == author) {
			requestedBook.push(books[key]);
		}
	}
	if (requestedBook.length < 1) {
		console.log("empty\n");
	    return res.status(403).json({message: "No book with this author"});
	}
	return res.send({"books": requestedBook});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
