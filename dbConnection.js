const mysql = require("mysql2")
require("dotenv").config()
const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
// console.log(HOST,USER,PASSWORD,DATABASE)
const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
})
db.connect((error) => {
    if (error) {
        console.log("Error connecting to db", error.stack)
        return
    } else {
        console.log("Connected to db at id", db.threadId)
    }
})
module.exports = db