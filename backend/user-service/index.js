require("dotenv").config()

const express = require("express")

const app = express()

const port = process.env.PORT ;

// Cors configuration
const corsMiddleware =require("./config/cors.config")

app.use(corsMiddleware)

app.use(express.json())

app.use(express.urlencoded({extended:true}))

const connectDB = require("./config/mongoDB.config")

connectDB()

const authRoutes = require("./routes/auth.routes")

app.use("/api/auth",authRoutes)

app.listen(port,()=>{
    console.log(`${process.env.SERVICE} is running on port ${port}`)
})