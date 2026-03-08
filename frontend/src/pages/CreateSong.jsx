import React, { useState } from 'react';
import { Headset, Music, Plus, Image as ImageIcon, Search } from 'lucide-react';
import { createSong, uploadThumbnailToSong } from "../services/songService";
import { useAlbumsSongs } from '../context/SongsAlbums.context';

const CreateSong = () => {
  const [song, setSong] = useState({
    title: "",
    description: "",
    albumId: "",
    audio: null
  });

  const [uploadThumbnail, setUploadThumbnail] = useState({
    thumbnail: null,
    songId: ""
  });

  const { albums, getNamesOfAlbumWithId, getNamesOfSongsWithId } = useAlbumsSongs();
  const albumList = getNamesOfAlbumWithId() || [];
  const songList = getNamesOfSongsWithId() || [];

  const handleOnChange = (e) => {
    if (e.target.type === "file") {
      setSong({ ...song, [e.target.name]: e.target.files[0] });
    } else {
      setSong({ ...song, [e.target.name]: e.target.value });
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.type === "file") {
      setUploadThumbnail({ ...uploadThumbnail, thumbnail: e.target.files[0] });
    } else {
      setUploadThumbnail({ ...uploadThumbnail, [e.target.name]: e.target.value });
    }
  };

  const handleSongCreation = (e) => {
    e.preventDefault();
    if (!song.title || !song.albumId || !song.audio) {
      alert("All fields are required");
      return;
    }
    createSong(song)
      .then((res) => {
        console.log(res);
        setSong({
          title: "",
          description: "",
          albumId: "",
          audio: null
        });
        alert("Song created successfully");
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Song creation failed");
        setSong({
          title: "",
          description: "",
          albumId: "",
          audio: null})
      })
    
  };

  const handleThumbnailUpload = (e) => {
    e.preventDefault();
    if (!uploadThumbnail.songId || !uploadThumbnail.thumbnail) {
      alert("Please select a song and an image");
      return;
    }
    uploadThumbnailToSong(uploadThumbnail)
      .then((res) => {
        console.log(res);
        alert("Thumbnail updated successfully");
        setUploadThumbnail({ thumbnail: null, songId: "" });
        // Dynamically update the song list
        getNamesOfSongsWithId();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Thumbnail upload failed");
      });
  };

  return (
    <div className="min-h-screen bg-black text-gray-400 p-8 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
          <p className="text-green-500 text-xs tracking-widest uppercase mb-2"> SONG MANAGEMENT</p>
          {/* <h1 className="text-4xl font-bold text-white tracking-tighter uppercase">Upload Songs</h1> */}
        </div>
        {/* <div className="flex gap-8 text-right">
          <div>
            <p className="text-2xl font-bold text-green-500">{albumList.length}</p>
            <p className="text-[10px] uppercase tracking-widest">Albums</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">3</p>
            <p className="text-[10px] uppercase tracking-widest">Songs</p>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Forms */}
        <div className="space-y-12">
          
          {/* Form 1: Upload Song */}
          <form onSubmit={handleSongCreation} className="border border-green-500/30 p-8 rounded-sm bg-[#0a0a0a] relative">
            <div className="absolute -top-3 left-6 bg-black px-2 text-[10px] text-green-500 tracking-widest uppercase">— Upload Song</div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest">Song Title</label>
                <input type="text" name="title" placeholder="e.g. Dark Matter" onChange={handleOnChange} className="bg-[#121212] border border-white/10 p-4 text-white focus:outline-none focus:border-green-500 transition-colors" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest">Album</label>
                <select name="albumId" onChange={handleOnChange} className="bg-[#121212] border border-white/10 p-4 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer">
                  <option value="">Select album...</option>
                  {albumList.map(album => <option key={album.id} value={album.id}>{album.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest">Audio File</label>
                <div className="relative border border-dashed border-white/10 rounded-sm p-10 flex flex-col items-center justify-center group hover:border-green-500/50 transition-colors bg-[#0f0f0f]">
                  <input type="file" name="audio" accept="audio/*" onChange={handleOnChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <Headset size={32} className="mb-3 text-gray-600 group-hover:text-green-500 transition-colors" />
                  <p className="text-sm">
                    {song.audio ? <span className="text-green-500">{song.audio.name}</span> : <>Drop audio or <span className="text-green-500 underline">browse</span></>}
                  </p>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 mt-4 transition-all uppercase tracking-tighter flex items-center justify-center gap-2">
                <Plus size={18} /> Upload Song
              </button>
            </div>
          </form>

          {/* Form 2: Add Song Thumbnail (From your reference image) */}
          <form onSubmit={handleThumbnailUpload} className="border border-green-500/30 p-8 rounded-sm bg-[#0a0a0a] relative">
            <div className="absolute -top-3 left-6 bg-black px-2 text-[10px] text-green-500 tracking-widest uppercase">— Add Song Thumbnail</div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest">Select Song</label>
                <select 
                  name="songId" 
                  value={uploadThumbnail.songId}
                  onChange={handleThumbnailChange}
                  className="bg-[#121212] border border-white/10 p-4 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                >
                  <option value="">Select song...</option>
                  {songList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest">Image File</label>
                <div className="relative border border-dashed border-white/10 rounded-sm p-8 flex flex-col items-center justify-center group hover:border-green-500/50 transition-colors bg-[#0f0f0f]">
                  <input 
                    type="file" 
                    name="thumbnail" 
                    accept="image/*" 
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <ImageIcon size={32} className="mb-3 text-gray-600 group-hover:text-green-500 transition-colors" />
                  <p className="text-sm text-center">
                    {uploadThumbnail.thumbnail ? <span className="text-green-500">{uploadThumbnail.thumbnail.name}</span> : <>Drop image or <span className="text-green-500 underline">browse</span></>}
                  </p>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 transition-all uppercase tracking-tighter flex items-center justify-center gap-2">
                <Plus size={18} /> Update Thumbnail
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Track List Preview */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-[10px] tracking-widest uppercase mb-4">
            {/* <span className="text-green-500">— Track List</span>
            <span>3 Songs</span> */}
          </div>

          <div className="space-y-1">
            {/* <TrackRow number="01" title="Dark Matter" album="Midnight Echoes" duration="3:42" />
            <TrackRow number="02" title="Voltage Dreams" album="Neon Pulse" duration="4:15" />
            <TrackRow number="03" title="Stellar Drift" album="Midnight Echoes" duration="2:58" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// const TrackRow = ({ number, title, album, duration }) => (
//   <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5">
//     <div className="flex items-center gap-6">
//       <span className="text-[10px] text-gray-600 font-mono">{number}</span>
//       <div className="bg-white/5 p-2 rounded-sm group-hover:bg-green-500/20 transition-colors">
//         <Music size={16} className="text-gray-400 group-hover:text-green-500" />
//       </div>
//       <div>
//         <h4 className="text-white text-sm font-bold tracking-tight">{title}</h4>
//         <p className="text-[10px] text-gray-600 uppercase tracking-widest">{album}</p>
//       </div>
//     </div>
//     <span className="text-[10px] text-gray-600 font-mono">{duration}</span>
//   </div>
// );

export default CreateSong;