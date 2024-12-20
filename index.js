const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const userRouter = require("./Routes/userRoutes")
const bookRouter = require("./Routes/bookRouters")
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
require("dotenv").config()
const port = process.env.PORT || 5000

app.use("/api", userRouter)
app.use("/api", bookRouter)

app.listen(port, () => console.log(`Server is running at port ${port}`))