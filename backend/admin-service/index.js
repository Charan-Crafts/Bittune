require('dotenv').config()

const express = require("express")

const app = express()

const port = process.env.PORT 

// Database connection

const connectDB = require("./config/mongoDB.config")

connectDB()

// Redis connection 

const redisClient = require("./config/redis.config")

redisClient.connect().then(()=>{
    console.log("Connected to Redis successfully");
})

const corsMiddleware = require("./config/cors.config")

app.use(corsMiddleware)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


const adminRoutes = require("./routes/admin.routes")

app.use("/api/admin",adminRoutes)


app.listen(port,()=>{
console.log(`${process.env.SERVICE} is running at port ${port}`);
})