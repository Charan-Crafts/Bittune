import React, { useState, useEffect } from 'react';
import { PlusCircle, Image as ImageIcon, Music2, X } from 'lucide-react';

import {createAlbum as createAlbumService} from "../services/albumService"

import { useAlbumsSongs } from '../context/SongsAlbums.context';

import AlbumCard from '../components/AdminComponents/AlbumCard';

const CreateAlbum = () => {
  const [album, setAlbum] = useState({
    title: "",
    description: "",
    thumbnail: null
  });

  const {albums , setAlbums} = useAlbumsSongs()


  console.log("Albums fromthe create albums",albums)

  
  
  // State for the preview URL
  const [preview, setPreview] = useState(null);

  // Clean up memory when component unmounts or thumbnail changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleOnChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setAlbum({ ...album, [e.target.name]: file });
        setPreview(URL.createObjectURL(file)); // Create preview URL
      }
    } else {
      setAlbum({ ...album, [e.target.name]: e.target.value });
    }
  };

  const removeImage = () => {
    setAlbum({ ...album, thumbnail: null });
    setPreview(null);
  };

  const createAlbumHandler = (e) => {
    e.preventDefault();
    if (!album.title || !album.description || !album.thumbnail) {
      alert("All fields are required");
      return;
    }
    createAlbumService(album)
      .then((res)=>{
        setAlbums([...albums, res.data]);
        setAlbum({
          title: "",
          description: "",
          thumbnail: null
        })
        console.log(res)

      })
      .catch((err)=>{
        console.error(err)
        setAlbum({
          title: "",
          description: "",
          thumbnail: null
        })
        console.log(err)
        alert(err.response.data.error)
      })
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. Form Section */}
      <section className="bg-[#181818] p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <PlusCircle className="text-green-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Create New Album</h2>
        </div>

        <form onSubmit={createAlbumHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side: Inputs */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Album Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Midnight Melodies" 
                onChange={handleOnChange} 
                className="w-full bg-[#242424] border border-transparent focus:border-green-500 focus:outline-none p-3 rounded-lg transition-all text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Description</label>
              <textarea 
                name="description" 
                rows="5"
                placeholder="Tell us about this album..." 
                onChange={handleOnChange} 
                className="w-full bg-[#242424] border border-transparent focus:border-green-500 focus:outline-none p-3 rounded-lg transition-all resize-none text-white"
              />
            </div>
          </div>

          {/* Right Side: File Upload & Preview */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-400">Album Artwork</label>
            
            <div className="relative group border-2 border-dashed border-gray-600 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-500/5 transition-all cursor-pointer bg-[#242424]">
              {preview ? (
                // Image Preview Mode
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                // Upload Placeholder Mode
                <>
                  <input 
                    type="file" 
                    name="thumbnail" 
                    accept="image/*"
                    onChange={handleOnChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <ImageIcon size={48} className="text-gray-500 mb-2 group-hover:text-green-500" />
                  <p className="text-gray-400 text-sm">Upload Cover Art</p>
                  <p className="text-gray-600 text-[10px] mt-1 italic">JPG, PNG (1:1 Aspect Ratio recommended)</p>
                </>
              )}
            </div>
            
            <button 
              type="submit" 
              className="mt-auto w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-full transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/20"
            >
              CREATE ALBUM
            </button>
          </div>
        </form>
      </section>

      {/* 2. List Section (Previously Styled) */}
      <section>
        <div className="flex items-center justify-between mb-6 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Music2 size={22} className="text-green-500" /> Available Albums
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {
            albums.map((alb)=>{
              return <AlbumCard key={alb._id} name={alb.title} desc={alb.description} image={alb.thumbnail} />
            })
          }
        </div>
      </section>
    </div>
  );
}

export default CreateAlbum;