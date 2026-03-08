const cloudinary = require('cloudinary').v2;

const fs = require("fs")

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (filePath)=>{

    try {

        const result = await cloudinary.uploader.upload(filePath,{
            folder:"spotify-clone-albums"
        })

        fs.unlinkSync(filePath)

        // console.log("Cloudinary upload result:", result);

        return result.secure_url;

        
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
}

const audioUploadToCloudinary = async(filePath)=>{
    try {

        const result = await cloudinary.uploader.upload(filePath,{
            folder:"spotify-clone-audios",
            resource_type:"video"
        })

        fs.unlinkSync(filePath)

        return result.secure_url;
        
    } catch (error) {
        console.error("Error uploading audio to Cloudinary:", error);
        return null
    }
}



module.exports = {
    uploadToCloudinary,
    audioUploadToCloudinary
}