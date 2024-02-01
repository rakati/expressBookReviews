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
	try {
		let strres = await new Promise((resolve, reject) => {
			resolve(JSON.stringify(books, null, 4));
		});
		res.send(strres);
	} catch (err) {
		res.status(500).json({message: 'Error retrieving books'});
	}
});

function getBookByISBN(isbn){
	return new Promise ((resolve, reject) => {
		const book = books[isbn];
		if (book) {
			resolve(book);
		} else {
			reject(new Error(`No book with ${isbn} ISBN`));
		}
	})
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
	try {
		const isbn = req.params.isbn;
		if (! /^[0-9]+$/.test(isbn))
			throw new TypeError ("Book ISBN should contain only digits");
		const book = await getBookByISBN(isbn);
		res.send(book);
	} catch (err) {
		res.status(404).json({message: err.message});
	}
 });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
	try {
		const author = req.params.author;
		let requestedBook = []
		for (const key in books) {
			if (books[key].author === author) {
				requestedBook.push(books[key]);
			}
		}
		if (requestedBook.length > 0) {
			res.send({"books": requestedBook});
		} else {
			throw Error("No book with this author");
		}
	} catch (err) {
		res.status(403).json({message: err.message});
	}
});

function getBookByTitle(title) {
	return new Promise((resolve, reject) => {
		for (const key in books) {
			if (books[key].title === title) {
				resolve(books[key]);
			}
		}
		reject(new Error(`No book with title ${title}`));
	});
}
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
	try {
		const title = req.params.title;
		const book = await getBookByTitle(title);
		res.send(book);
	} catch (err) {
		res.status(403).json({message: err.message});
	}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	if (isbn < 1 || !books[isbn]) {
	  return res.status(403).json({message: "Invalid ISBN number"});
	}
	return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
