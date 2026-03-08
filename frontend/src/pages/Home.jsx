import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import UserNavbar from '../components/UserNavbar';
import { useAlbumsSongs } from '../context/SongsAlbums.context';
import { getAlbumSongsById, getAllAlbums } from '../services/albumService';
import { getAllSongs } from '../services/songService';

const Home = () => {
  const { albums, songs } = useAlbumsSongs();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // Fetch albums and songs dynamically
    getAllAlbums();
    getAllSongs();
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsLoading(true);
    getAlbumSongsById(album._id)
      .then((res) => {
        setAlbumSongs(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        setAlbumSongs([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const playSong = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (currentSong?._id === song._id && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    // Fade out then switch
    if (audioRef.current && currentSong) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.1);
        } else {
          clearInterval(fadeOut);
          audio.volume = 1;
          setCurrentSong(song);
          setIsPlaying(true);
        }
      }, 30);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      audio.src = currentSong.audio;
      audio.volume = 0;
      audio.play();
      // Fade in
      const fadeIn = setInterval(() => {
        if (audio.volume < 0.95) {
          audio.volume = Math.min(1, audio.volume + 0.1);
        } else {
          audio.volume = 1;
          clearInterval(fadeIn);
        }
      }, 30);
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  };

  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    // Main Container
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      
      {/* Top Section: Sidebar + Main Content */}
      <div className="flex flex-1 h-[calc(100vh-90px)] overflow-hidden p-2 gap-2">
        
        {/* Sidebar */}
        <div className="w-64 hidden md:flex flex-col gap-2">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#121212] rounded-lg overflow-y-auto custom-scrollbar relative">
          
          {/* Use UserNavbar as the Sticky Header */}
          <UserNavbar />

          <div className="p-6 pt-2">
            <h1 className="text-3xl font-bold mb-6">Good morning</h1>

            {/* Album Detail View (shown on double-click) */}
            {selectedAlbum && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img src={selectedAlbum.thumbnail} alt={selectedAlbum.title} className="w-16 h-16 rounded-md object-cover shadow-lg" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedAlbum.title}</h2>
                      <p className="text-sm text-gray-400">{selectedAlbum.description}</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedAlbum(null); setAlbumSongs([]); }} className="text-gray-400 hover:text-white transition p-2">
                    <X size={20} />
                  </button>
                </div>

                {albumSongs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No songs in this album yet.</p>
                ) : (
                  <div className="bg-[#181818] rounded-lg overflow-hidden">
                    {albumSongs.map((song, idx) => (
                      <div
                        key={song._id}
                        onClick={() => playSong(song)}
                        className={`flex items-center gap-4 px-4 py-3 hover:bg-[#282828] cursor-pointer transition group ${currentSong?._id === song._id ? "bg-[#282828]" : ""}`}
                      >
                        <span className="text-sm text-gray-400 w-6 text-right group-hover:hidden">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-white w-6 text-right hidden group-hover:block">
                          {currentSong?._id === song._id && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </span>
                        {song.thumbnail ? (
                          <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                            <Play size={14} className="text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium truncate ${currentSong?._id === song._id ? "text-green-500" : "text-white"}`}>{song.title}</h4>
                          <p className="text-xs text-gray-400 truncate">{selectedAlbum.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-400">Loading...</p>
              </div>
            )}

            {/* Row 1: Albums */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer">Albums</h2>
              <span className="text-sm font-bold text-gray-400 hover:underline cursor-pointer">Show all</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar mb-8">
              {albums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => handleAlbumClick(album)}
                  className="flex-shrink-0 w-[180px] bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-300 group cursor-pointer"
                >
                  <div className="relative mb-4 shadow-lg shadow-black/50">
                    <img
                      src={album.thumbnail}
                      alt={album.title}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-green-500 p-3 rounded-full text-black hover:scale-105 shadow-xl">
                        <Play size={20} fill="black" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-bold truncate text-sm">{album.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-1">{album.description}</p>
                </div>
              ))}
            </div>

            {/* Row 2: Songs */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer">Songs</h2>
              <span className="text-sm font-bold text-gray-400 hover:underline cursor-pointer">Show all</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {songs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => playSong(song)}
                  className="flex-shrink-0 w-[180px] bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-300 group cursor-pointer"
                >
                  <div className="relative mb-4 shadow-lg shadow-black/50">
                    {song.thumbnail ? (
                      <img src={song.thumbnail} alt={song.title} className="w-full aspect-square object-cover rounded-md" />
                    ) : (
                      <div className="w-full aspect-square bg-gray-800 rounded-md flex items-center justify-center">
                        <Play size={32} className="text-gray-600" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-green-500 p-3 rounded-full text-black hover:scale-105 shadow-xl">
                        {currentSong?._id === song._id && isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
                      </button>
                    </div>
                  </div>
                  <h3 className={`font-bold truncate text-sm ${currentSong?._id === song._id ? "text-green-500" : "text-white"}`}>{song.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-1">{song.description || "Song"}</p>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Music Player Bar */}
      <footer className="h-[90px] bg-black border-t border-white/10 px-4 flex items-center justify-between z-50">
        {/* Left: Song Info */}
        <div className="flex items-center w-[30%] min-w-[180px]">
          {currentSong?.thumbnail ? (
            <img src={currentSong.thumbnail} alt={currentSong.title} className="w-14 h-14 rounded-md mr-4 flex-shrink-0 shadow-lg object-cover" />
          ) : (
            <div className="w-14 h-14 bg-gray-800 rounded-md mr-4 flex-shrink-0 shadow-lg"></div>
          )}
          <div className="truncate">
            <h4 className="text-sm font-semibold hover:underline cursor-pointer truncate">{currentSong?.title || "No song playing"}</h4>
            <p className="text-xs text-gray-400 truncate">{currentSong?.description || ""}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center max-w-[40%] w-full">
            <div className="flex items-center gap-6 mb-2">
                <button onClick={togglePlay} className="bg-white p-2 rounded-full text-black hover:scale-105 transition active:scale-95">
                  {isPlaying ? (
                    <Pause className="w-6 h-6" fill="currentColor" />
                  ) : (
                    <Play className="w-6 h-6" fill="currentColor" />
                  )}
                </button>
            </div>
            <div className="w-full flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{formatTime(currentTime)}</span>
                <div onClick={handleProgressClick} className="h-1 flex-1 bg-gray-600 rounded-full relative group cursor-pointer">
                    <div className="h-full bg-white group-hover:bg-green-500 rounded-full relative" style={{ width: `${progress}%` }}>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl"></div>
                    </div>
                </div>
                <span className="text-[10px] text-gray-400">{formatTime(duration)}</span>
            </div>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center justify-end w-[30%] gap-3 text-gray-400">
          <svg className="w-5 h-5 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer"
          />
        </div>
      </footer>
    </div>
  );
}

export default Home;