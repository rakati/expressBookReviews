const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	// check if username and password passed in the request body if so
	// register the user with password
	if (username && password) {
		if (isValid(username)) {
			users.push({"username": username, "password": password});
			return res.status(200).json({message: "User successfully registered. Now you can login"});
		} else {
			return res.status(404).json({message: "User already exist!"});
		}
	}
	// user not provided his info username and password
	return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
	let strres = await JSON.stringify(books, null, 4);
  return res.send(strres);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
	try {
		let isbn = req.params.isbn;
		if (isbn in books)
			res.send(books[isbn]);
		else {
			throw new Error ("Invalid Book ISBN");
		}
	} catch (err) {
		res.status(403).json({message: err.message});
	}
	return res;
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	author = req.params.author;
	requestedBook = []
	for (const key in books) {
		if (books[key].author === author) {
			requestedBook.push(books[key]);
		}
	}
	if (requestedBook.length < 1) {
	    return res.status(403).json({message: "No book with this author"});
	}
	return res.send({"books": requestedBook});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	title = req.params.title;
	requestedBook = null;
	for (const key in books) {
		if (books[key].title === title) {
			requestedBook = books[key];
			break;
		}
	}
	if (requestedBook === null) {
	    return res.status(403).json({message: "No book with this title"});
	}
	return res.send(requestedBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	isbn = req.params.isbn;
	if (isbn < 1 || !books[isbn]) {
	  return res.status(403).json({message: "Invalid ISBN number"});
	}
	return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
