import React, { createContext , useContext ,  useState} from 'react';

const SongsAlbumContext= createContext();



export const SongsAlbumProvider = ( {children})=>{

    const [songs , setSongs] = useState([]);

    const [albums, setAlbums] = useState([]);

    const getNamesOfAlbumWithId = ()=>{
        return albums.map((album)=>{
            return {
                id:album._id,
                name:album.title
            }
        })
    }

    const getNamesOfSongsWithId = ()=>{
        return songs.map((song)=>{
            return {
                id:song._id,
                name:song.title
            }
        })
    }

    return (
        <SongsAlbumContext.Provider value={{songs , setSongs , albums, setAlbums , getNamesOfAlbumWithId, getNamesOfSongsWithId}}>
            {children}
        </SongsAlbumContext.Provider>
    )
}

export const useAlbumsSongs = ()=>{
    return useContext(SongsAlbumContext);
}
