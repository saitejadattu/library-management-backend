const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Router = express.Router()
const controller = require("../controllers/userController.js")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authorization = require("../authorization")

//Get All Users
Router.get("/", controller.getUsers)

//Register A New User
Router.post("/register", controller.registerUser)

//User  And Librarian Login
Router.post("/login", controller.loginUser)

//Get All Books
Router.get("/books", controller.getAllBooks)

//Send Borrow Request
Router.post("/borrow_request/:id",authorization, controller.postBorrowRequest)

//Get All Borrow History
Router.get("/users/:id/history", authorization, controller.getAllBorrowersHistory)

//Get Single Book
Router.get("/book-request/:id", authorization, controller.getSingleBook)

//Get single User
Router.get("/user/:id", authorization, controller.getSinglUser)

module.exports = Router
