const express = require("express")
const Router = express.Router()
const jwt = require("jsonwebtoken")
const controller = require("../controllers/bookController.js")
require("dotenv").config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//Authorization for Verifying User
const authorization = require("../authorization")

//Get All Borrow Request
Router.get("/borrow_requests", authorization, controller.getAllBorrowRequest)

//Approve Borrow Request
Router.put("/borrow_requests/:id/approve", authorization, controller.approveBorrowRequest)

//Deny Borrow Request
Router.put("/borrow_requests/:id/deny", authorization, controller.denyBorrowRequest)

//Get All Borrow History
Router.get("/users/:id/history", authorization, controller.getAllBorrowersHistory)

//Admin Login
Router.post("/admin-login", controller.adminLogin)

//Get Single Borrow Request
Router.get("/single-borrow-request/:id", authorization, controller.getSingleBorrowRequest)

module.exports = Router