const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    thumbnail:{
        type:String
    },
    audio:{
        type:String
    },
    albumId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Album"
    }
},{timestamps:true})

const song = mongoose.model("Song",songSchema)

module.exports = song;