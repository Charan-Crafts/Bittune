import songsApi from "../api/songApi"

import adminApi from "../api/adminApi"

export const createSong = async(data)=>{

    const response = await adminApi.post("/upload-song",data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response;
}

export const getAllSongs = async()=>{

    const response = await songsApi.get("/allsongs")

    return response;
}


export const uploadThumbnailToSong = async(data)=>{

    const response = await adminApi.put("/add-thumbnail",data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response;
}

export const deleteSongById = async(songId)=>{

    const response = await adminApi.delete("/delete-song/"+songId)

    return response;
}