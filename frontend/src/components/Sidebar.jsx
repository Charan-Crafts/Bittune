import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react'; // Install lucide-react or use SVG

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-2 h-full w-full">
      
      {/* Top Navigation Box */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 text-gray-400 hover:text-white transition duration-300 cursor-pointer px-2">
          <Home size={24} />
          <span className="font-bold">Home</span>
        </div>
      </div>

      {/* Library Box */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="p-4 flex items-center justify-between text-gray-400">
          <div className="flex items-center gap-2 hover:text-white transition cursor-pointer">
            <Library size={24} />
            <span className="font-bold">Your Library</span>
          </div>
          <Plus size={20} className="hover:text-white cursor-pointer" />
        </div>

        {/* Library Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          
          {/* Liked Songs Playlist */}
          <div className="flex items-center gap-3 p-2 hover:bg-[#1A1A1A] rounded-md cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-700 to-blue-300 flex items-center justify-center rounded-sm shadow-lg">
              <Heart size={20} fill="white" className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">Liked Songs</span>
              <span className="text-xs text-gray-400">Playlist • 142 songs</span>
            </div>
          </div>

          {/* Sample Playlists */}
          

        </div>
      </div>
    </div>
  );
}

export default Sidebar;