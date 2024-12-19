const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../dbConnection.js")
require("dotenv").config()
const jwt_secret_key = process.env.JWT_SECRET_KEY

const controller = {
    //Get All Users
    getUsers: (req, res) => {
        const usersQuery = `SELECT * FROM users`
        db.query(usersQuery, (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                res.status(200).json({
                    data: result
                })
            }
        })
    }, getSinglUser: (req, res) => {
        const { id } = req.params
        const usersQuery = `SELECT * FROM users WHERE id=?`
        db.query(usersQuery, [id], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: error.message
                })
            } else {
                res.status(200).json({
                    result:result[0]
                })
            }
        })
    },
    //Register A New User
    registerUser: async (req, res) => {
        const { email, password, role } = req.body
        try {
            const addUserQuery = `INSERT INTO users(id, email, password, role) VALUES (?,?,?,?)`
            const hashedPassword = await bcrypt.hash(password, 10)
            const values = [
                uuidv4(), email, hashedPassword, (role ? role : "user")
            ]
            db.query(addUserQuery, values, (error, result) => {
                if (error) {
                    res.status(409).json({
                        message: error.message
                    })
                } else {
                    res.status(201).json({
                        message: "registration successful"
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    //User  And Librarian Login
    loginUser: (req, res) => {
        const { email, password } = req.body
        try {
            const isUser = `SELECT * FROM users WHERE email=?`
            db.query(isUser, [email], async (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    if (result.length === 0) {
                        res.status(404).json({
                            message: "user not found"
                        })
                    } else {
                        const isPassword = await bcrypt.compare(password, result[0].password)
                        const payload = { email, role: result[0].role, id: result[0].id }
                        // console.log(payload)
                        if (isPassword) {
                            const jwtToken = jwt.sign(payload, jwt_secret_key)
                            res.status(200).json({
                                jwtToken
                            })
                        } else {
                            res.status(401).json({
                                message: "Inavlid password"
                            })
                        }
                    }
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    //Get All Books
    getAllBooks: (req, res) => {
        try {
            const getBooksQuery = `SELECT * FROM books`
            db.query(getBooksQuery, (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    res.status(200).json({
                        result
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    //Send Borrow Request
    postBorrowRequest: (req, res) => {
        const bookId = req.params.id //BookId reciving from pramas
        const { id, role, email } = req.payload //Reciving The user details from (JWT) Payload 
        const { start_date, end_date } = req.body //Reciving The start_date and end_date from request body
        console.log
        if (role === "user") {
            const isBook = `SELECT * FROM books WHERE id=?`
            db.query(isBook, [bookId], (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    if (result.length === 0) {
                        res.status(404).json({
                            message: "book not found"
                        })
                    } else {
                        const isBookBorrowedBefore = `SELECT * FROM borrow_requests WHERE book_id = ? AND user_id=?`
                        const valu = [bookId, id]
                        db.query(isBookBorrowedBefore, valu, (error, result) => {
                            if (error) {
                                res.status(500).json({
                                    message: error.message
                                })
                            } else {
                                if (result.length === 0) {
                                    //Using parameterized query to avoid SQL Injection
                                    const addBorrowRequestQuery = `INSERT INTO borrow_requests
                                                      (id,user_id, book_id, start_date, end_date) 
                                                      VALUES (?,?,?,?,?)`
                                    const values = [
                                        uuidv4(), id, bookId, start_date, end_date
                                    ]
                                    db.query(addBorrowRequestQuery, values, (error, result) => {
                                        if (error) {
                                            res.status(500).json({
                                                message: error.message
                                            })
                                        } else {
                                            res.status(200).json({
                                                message: "Request Successfull"
                                            })
                                        }
                                    })
                                } else {
                                    res.status(405).json({
                                        message: "Book Request is already being verified by Librarian Please Try Again"
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    }, getAllBorrowersHistory: (req, res) => {
        const userId = req.params.id
        const { id, role } = req.payload
        if (role === "user") {
            const getAllBorrowHistoryQuery = `SELECT * FROM borrow_history WHERE user_id=?`
            const value = [id]
            db.query(getAllBorrowHistoryQuery, value, (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    res.status(200).json({
                        message: result
                    })
                }
            })
        } else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    }, getSingleBook: (req, res) => {
        const { id } = req.params
        try {
            const getBooksQuery = `SELECT * FROM books WHERE id=?`
            db.query(getBooksQuery, [id], (error, result) => {
                if (error) {
                    res.status(500).json({
                        message: error.message
                    })
                } else {
                    res.status(200).json({
                        result: result[0]
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
}
module.exports = controller