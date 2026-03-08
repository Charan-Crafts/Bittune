require("dotenv").config()

const express = require('express')

const app = express()

const port = process.env.PORT

// Cors configuration
const corsMiddleware = require("./config/cors.config")
app.use(corsMiddleware)

app.use(express.json())

app.use(express.urlencoded({extended:true}))

// Redis client
const redisClient = require("./config/redis.config")

redisClient.connect().then(()=>{
    console.log("Connected to Redis successfully");
})

const connectDb = require("./config/mongoDB.config")

connectDb()

const songRoutes = require("./routes/songs.routes")

app.use("/api/songs",songRoutes)

app.listen(port,()=>{
    console.log(`${process.env.SERVICE_NAME} is running at port ${process.env.PORT}`);
})