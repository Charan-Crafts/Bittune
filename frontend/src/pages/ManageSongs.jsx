import React, { useEffect, useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { getAllAlbums, deleteAlbumById } from '../services/albumService';
import { getAllSongs, deleteSongById } from '../services/songService';

const ManageSongs = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);

  useEffect(() => {
    // Fetch albums and songs on component mount
    fetchAlbumsAndSongs();
  }, []);

  const fetchAlbumsAndSongs = async () => {
    try {
      const albumsResponse = await getAllAlbums();
      const songsResponse = await getAllSongs();
      setAlbums(albumsResponse.data.data || []);
      setSongs(songsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching albums or songs:', error);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await deleteAlbumById(albumId);
        alert('Album deleted successfully');
        fetchAlbumsAndSongs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album');
      }
    }
  };

  const handleDeleteSong = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteSongById(songId);
        alert('Song deleted successfully');
        fetchAlbumsAndSongs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('Failed to delete song');
      }
    }
  };

  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);
    try {
      const response = await getAlbumSongsById(album._id);
      setAlbumSongs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching album songs:', error);
      setAlbumSongs([]);
    }
  };

  const handleDeleteAlbumSong = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteSongById(songId);
        alert('Song deleted successfully');
        handleAlbumClick(selectedAlbum); // Refresh album songs
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('Failed to delete song');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-400 p-8 font-mono">
      <h1 className="text-3xl font-bold text-white mb-6">Manage Songs</h1>

      {/* Albums Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album._id} className="bg-[#181818] p-4 rounded-lg relative group">
              <img
                src={album.thumbnail}
                alt={album.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-white font-bold truncate text-sm mb-2">{album.title}</h3>
              <p className="text-gray-400 text-xs truncate mb-4">{album.description}</p>
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-green-500 p-3 rounded-full text-black hover:scale-105 shadow-xl">
                  <Play size={20} />
                </button>
                <button
                  onClick={() => handleDeleteAlbum(album._id)}
                  className="bg-red-500 p-3 rounded-full text-white hover:scale-105 shadow-xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Songs Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div key={song._id} className="bg-[#181818] p-4 rounded-lg relative group">
              {song.thumbnail ? (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-800 rounded-md mb-4 flex items-center justify-center">
                  <Play size={32} className="text-gray-600" />
                </div>
              )}
              <h3 className="text-white font-bold truncate text-sm mb-2">{song.title}</h3>
              <p className="text-gray-400 text-xs truncate mb-4">{song.description || 'No description'}</p>
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-green-500 p-3 rounded-full text-black hover:scale-105 shadow-xl">
                  <Play size={20} />
                </button>
                <button
                  onClick={() => handleDeleteSong(song._id)}
                  className="bg-red-500 p-3 rounded-full text-white hover:scale-105 shadow-xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Album Songs Section */}
      {selectedAlbum && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Songs in {selectedAlbum.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albumSongs.map((song) => (
              <div key={song._id} className="bg-[#181818] p-4 rounded-lg relative group">
                {song.thumbnail ? (
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 rounded-md mb-4 flex items-center justify-center">
                    <Play size={32} className="text-gray-600" />
                  </div>
                )}
                <h3 className="text-white font-bold truncate text-sm mb-2">{song.title}</h3>
                <p className="text-gray-400 text-xs truncate mb-4">{song.description || 'No description'}</p>
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-green-500 p-3 rounded-full text-black hover:scale-105 shadow-xl">
                    <Play size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAlbumSong(song._id)}
                    className="bg-red-500 p-3 rounded-full text-white hover:scale-105 shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSongs;
