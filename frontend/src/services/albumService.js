import albumApi from "../api/adminApi"

import songsApi from "../api/songApi"

export const createAlbum = async(albumData)=>{

    const response = await albumApi.post("/create-album",albumData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response;
}

export const getAllAlbums= async()=>{

    const response = await songsApi.get("/albums")

    return response;
}

export const getAlbumSongsById = async(albumId)=>{

    const response = await songsApi.get("/album/"+albumId)

    return response;
}

export const deleteAlbumById = async(albumId)=>{

    const response = await albumApi.delete("/delete-album/"+albumId)
    
    return response;
}
