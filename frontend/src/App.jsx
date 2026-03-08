import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Home from './pages/Home';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import AdminRoutes from './routes/AdminRoutes';
import Admin from './pages/Admin';
import PublicRoutes from './routes/PublicRoutes';
import PageNotFound from './pages/PageNotFound';
import SpotifyAdminUI from './pages/SpotifyAdmin';
import CreateAlbum from './pages/CreateAlbum';
import ManageSongs from './pages/ManageSongs';
import CreateSong from './pages/CreateSong';

import {getAllAlbums} from "./services/albumService"
import {getAllSongs} from "./services/songService"

import { useAlbumsSongs } from './context/SongsAlbums.context';

const App = () => {

  const {setAlbums, setSongs} = useAlbumsSongs()

  const fetchAlbums = async()=>{

    getAllAlbums()
      .then((response)=>{
        console.log(response)
        setAlbums(response.data.data);
      })
      .catch((error)=>{
        console.log(error)
      })
  }

  const fetchSongs = async()=>{

    getAllSongs()
      .then((response)=>{
        console.log(response)
        setSongs(response.data.data);
      })
      .catch((error)=>{
        console.log(error)
      })
  }

  useEffect(()=>{
    fetchAlbums()
    fetchSongs()
  },[])
  

  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Signup />} />
      </Route>

      {/* User protected Routes */}

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/library" element={<Library />} />
      </Route>

      <Route element={<AdminRoutes />}>
        <Route path="/admin" element={<Admin />}>
          <Route path="albums" element={<CreateAlbum/>}/>
          <Route path="songs" element={<CreateSong/>}/>
          <Route path="manage" element={<ManageSongs/>}/>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound/>}/>
    </Routes>
  );
}

export default App;
