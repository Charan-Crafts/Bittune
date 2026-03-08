const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    }
},{timestamps:true})

const Album = mongoose.model("Album",albumSchema)

module.exports = Album;