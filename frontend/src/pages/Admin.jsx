import React from 'react';
import { Outlet } from 'react-router-dom'; // This replaces router-outlet
import AdminSidebar from '../components/AdminComponents/AdminSidebar';

import { useAlbumsSongs } from '../context/SongsAlbums.context';
const Admin = () => {

  const {albums, songs} = useAlbumsSongs();

  console.log("Admin albums:", albums, "songs:", songs)
  return (
    <div className="flex h-screen bg-[#090909] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full border-r border-white/10 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* This renders your sub-pages like Dashboard, Users, etc. */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;