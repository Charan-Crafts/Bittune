const albumService = require("../models/album.model")

const songService = require("../models/songs.model")

const cloudinaryService = require("../config/cloudinary.config")

const redisClient = require("../config/redis.config")

// let cachedSongKey = `song:${songId}`

// const albumsCacheKey = "albums:all"

// const albumKey =`album:${albumId}:songs`

const createAlbum = async(req,res)=>{


    const {title,description} = req.body

    // console.log(req.body)

    // console.log(req.user)

    const thumbnail = req.file;

    try {

        await redisClient.del("albums:all");

        // await redisClient.del(`album:${albumId}:songs`);

        // await redisClient.del(`song:${songId}`)

        if(req.user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Forbidden , you don't have permission to perform this action"
            })
        }

       if(!thumbnail || !title || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
       }
        
       const cloudinaryUrl = await cloudinaryService.uploadToCloudinary(thumbnail.path)

       if(!cloudinaryUrl){
        return res.status(500).json({
            success:false,
            message:"Failed to upload thumbnail , please try again"
        })
       }

       const newAlbum = await albumService.create({
        title,description,thumbnail:cloudinaryUrl
       })

       return res.status(201).json({
        success:true,
        message:"Album created successfully",
        data:newAlbum
       })
        
    } catch (error) {
        console.error("Error creating album",error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


const uploadSong = async(req,res)=>{
    const {title , description,albumId} = req.body

    const audio = req.file
    
    try {

        await redisClient.del("albums:all");

        // await redisClient.del(`album:${albumId}:songs`);

        // await redisClient.del(`song:${songId}`)

        if(req.user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"forbidden , you don't have permission to perform this action"
            })
        }

        if(!audio || !title ||  !albumId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const cloudinaryUrl = await cloudinaryService.audioUploadToCloudinary(audio.path)

        console.log("cloudinaryUrl",cloudinaryUrl)

        if(!cloudinaryUrl){
            return res.status(500).json({
                success:false,
                message:"Failed to upload audio , please try again"
            })
        }

        const newSong = await songService.create({
            title,description,audio:cloudinaryUrl,albumId
        })

        console.log("newSong",newSong)

        return res.status(201).json({
            success:true,
            message:"Song uploaded successfully",
            data:newSong
        })
        
    } catch (error) {
        console.error("Error uploading song",error);

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const addThumbnailToSong = async(req,res)=>{

    if(req.user.role !=="admin"){
        return res.status(403).json({
            success:false,
            message:"Forbidden , you don't have permission to perform this action"
        })
    }

    const {songId} = req.body;

    const thumbnail = req.file;

    await redisClient.del("albums:all");

    // await redisClient.del(`album:${albumId}:songs`);

    // await redisClient.del(`song:${songId}`)

    if(!thumbnail || !songId){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    try {

        const cloudinaryUrl = await cloudinaryService.uploadToCloudinary(thumbnail.path);

        if(!cloudinaryUrl){
            return res.status(500).json({
                success:false,
                message:"Failed to upload thumbnail , please try again"
            })
        }

        const updatedSong = await songService.findByIdAndUpdate(songId,{
            thumbnail:cloudinaryUrl
        },{new:true})

        if(!updatedSong){
            return res.staus(404).json({
                success:false,
                message:"Song not found"
            })
        }

        return res.status(200).json({
            success:true,
            messsage:"Thumbnail added to song successfully",
            data:updatedSong
        })
        
    } catch (error) {
        console.error("Error adding thumbnail to song",error);

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteSongById = async(req,res)=>{

    const {songId} = req.params;

    await redisClient.del("albums:all");

        // await redisClient.del(`album:${albumId}:songs`);

        // await redisClient.del(`song:${songId}`)

    if(req.user.role !== "admin"){
        return res.status(403).json({
            success:false,
            message:"Forbidden , you don't have permission to perform this action"
        })
    }

    if(!songId){
        return res.status(400).json({
            success:false,
            message:"Song ID is required"
        })
    }
    try {

        const song = await songService.findById(songId)

        if(!song){
            return res.status(404).json({
                success:false,
                message:"Song not found"
            })
        }

        await songService.findByIdAndDelete(songId);

        return res.status(200).json({
            success:true,
            message:"Song deleted successfully"
        })
        
    } catch (error) {
        
        console.error("Error deleting song",error);

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteAlbumById = async(req,res)=>{

    const {albumId} = req.params;

    if(!albumId){
        return res.status(400).json({
            success:false,
            message:"Album ID is required"
        })
    }

    // await redisClient.del("albums:all");

    //     await redisClient.del(`album:${albumId}:songs`);

    //     await redisClient.del(`song:${songId}`)
    if(req.user.role !=="admin"){
        return res.status(403).json({
            success:false,
            message:"Forbidden , you don't have permission to perform this action"
        })
    }

    try {

        const album = await albumService.findById(albumId)

        if(!album){
            return res.status(404).json({
                success:false,
                message:"Album not found"
            })
        }

        await songService.deleteMany({albumId})

        await albumService.findByIdAndDelete(albumId)
        
        return res.status(200).json({
            success:true,
            message:"Album and associated songs deleted successfully"
        })
    } catch (error) {

        console.error("Error deleting album",error);

        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}
module.exports = {
    createAlbum,
    uploadSong,
    addThumbnailToSong,
    deleteSongById,
    deleteAlbumById
}