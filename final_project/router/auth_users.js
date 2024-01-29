const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return false;
	}
	return true;
}

const authenticatedUser = (username,password)=>{
	// check if there is a valid user with the same username and password
	validusers = users.filter(user => {
		return (user.username === username && user.password === password);
	})
	if (validusers.length > 0) return true;
	return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	// check if username and password passed in request body
	if (password && password) {
		// check username and password against stored user info
		if (authenticatedUser(username, password)) {
			// save user credentials for the session as JWT
			let accessToken = jwt.sign({
				data: username
			}, 'access', {expiresIn: 60 * 60});
			req.session.authorization = { accessToken, username }
			return res.status(200).send({message: "User successfully logged in"});
		} else {
			return res.status(208).json({message: "Invalid login. check your username and password"});
		}
	}
	return res.status(404).json({message: "Error logging in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const user = req.session.authorization.username;
	const isbn = req.params.isbn;
	const review = req.query.review;
	let book = books[isbn];

	if (!book) {
		return res.status(404).json({message: "Invalid book ISBN"});
	}
	book["reviews"][user] = review;
	return res.send({message: "review added"});
});

// remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const user = req.session.authorization.username;
	const isbn = req.params.isbn;
	const review = req.query.review;
	let book = books[isbn];

	if (!book) {
		return res.status(404).json({message: "Invalid book ISBN"});
	}
	delete book["reviews"][user];
	return res.send({message: "review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
