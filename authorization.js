const jwt = require("jsonwebtoken")
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
//Authorization for Verifying User
const authorization = async (req,res, next) =>{
    try{
        const jwtToken = req['headers'].authorization.split(" ")[1]
        if(jwtToken === undefined){
            res.status(401).json({
                message: "Unauthorized"
            })
        }else{
            jwt.verify(jwtToken, JWT_SECRET_KEY, (error, payload)=>{
                if(error){
                    res.status(401).json({
                        message: "unauthorized"
                    })
                }else{
                    req.payload = payload
                    next()
                }
            })
        }
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = authorization