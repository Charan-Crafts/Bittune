import React from 'react';
import { Play } from 'lucide-react';

const AlbumCard = ({ key, image, name, desc }) => {
  return (
    <div className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 group cursor-pointer w-full max-w-[200px]">
      {/* Image Container */}
      <div className="relative mb-4 shadow-lg shadow-black/50" key={key}>
        <img 
          src={image || "https://via.placeholder.com/150"} 
          alt={name} 
          className="w-full aspect-square object-cover rounded-md"
        />
        
        {/* Play Button - Slides up on hover */}
        <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-[#1ed760] p-3 rounded-full text-black hover:scale-105 shadow-xl shadow-black/20">
            <Play size={24} fill="black" />
          </button>
        </div>
      </div>

      {/* Description / Text */}
      <div className="space-y-1">
        <h3 className="text-white font-bold truncate text-base">
          {name || "Untitled Album"}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 leading-tight">
          {desc || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default AlbumCard;