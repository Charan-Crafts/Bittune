const songService = require("../models/songs.model")

const albumService = require("../models/album.model")

const redisClient = require("../config/redis.config")


const getSongById = async (req, res) => {

    

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    const { songId } = req.params;

    if (!songId) {
        return res.status(400).json({
            success: false,
            message: "Song Id is required"
        })
    }

    try {

        let cachedSongKey = `song:${songId}`

        // Check if song details are present in redis cache or not 

        const cachedSong = await redisClient.get(cachedSongKey)

        if(cachedSong){
            return res.status(200).json({
                success:true,
                message:"Song fetched successfully from cache",
                data:JSON.parse(cachedSong)
            })
        }

        const song = await songService.findById(songId).populate("albumId")

        if (!song) {
            return res.status(404).json({
                success: false,
                message: "Song not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Song fetched successfully",
            data: song
        })

    } catch (error) {
        console.error("Error in getSongById controller", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAlbums = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {

        const albumsCacheKey = "albums:all"

        // Check if albums are present in redis cache or not

        const cachedAlbums = await redisClient.get(albumsCacheKey)

        if(cachedAlbums){
            return res.status(200).json({
                success:true,
                message:"Albums fetched successfully from cache",
                data:JSON.parse(cachedAlbums)
            })
        }

        const albums = await albumService.find()

        return res.status(200).json({
            success: true,
            message: "Albums fetched successfully",
            data: albums
        }
        )


    } catch (error) {
        console.error("Error in getAlbums controller", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getSongsByAlbumId = async(req,res)=>{

    if(!req.user){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }

    const {albumId} = req.params;

    try {

        const albumKey =`album:${albumId}:songs`

        const cachedSongs = await redisClient.get(albumKey)

        if(cachedSongs){
            return res.status(200).json({
                success:true,
                message:"Songs fetched successfully from cache",
                data:JSON.parse(cachedSongs)
            })
        }

        const songs = await songService.find({albumId})

        return res.status(200).json({
            success:true,
            message:"Songs fetched successfully",
            data:songs
        })
        
    } catch (error) {
        console.error("Error in getSongsByAlbumId controller", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllSongs = async(req,res)=>{

    try {

        const songs = await songService.find().populate("albumId")

        return res.status(200).json({
            success:true,
            message:"Songs fetched successfully",
            data:songs
        })
        
    } catch (error) {
        console.error("Error in getAllSongs controller", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
module.exports = {
    getSongById,
    getAlbums,
    getSongsByAlbumId,
    getAllSongs
}