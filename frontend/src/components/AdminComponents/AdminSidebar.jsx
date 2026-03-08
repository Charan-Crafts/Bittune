import React from 'react';
import { NavLink } from 'react-router-dom'; // Using NavLink for automatic active styling
import { LayoutGrid, Music, ListMusic, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    {
      name: "Albums",
      path: "/admin/albums",
      icon: <LayoutGrid size={20} />
    },
    {
      name: "Songs",
      path: "/admin/songs",
      icon: <Music size={20} />
    },
    {
      name: "Manage Songs",
      path: "/admin/manage",
      icon: <ListMusic size={20} />
    }
  ];

  return (
    <div className="h-full bg-black flex flex-col p-4 border-r border-white/5">
      {/* Admin Logo Section */}
      <div className="flex items-center gap-2 px-2 mb-10 text-green-500">
        <ShieldCheck size={28} />
        <h1 className="text-xl font-black tracking-tighter text-white">
          ADMIN<span className="text-green-500 text-[10px] ml-1 uppercase tracking-widest">Panel</span>
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-md font-bold transition-all duration-200 group ${
                isActive 
                ? "bg-[#282828] text-white" 
                : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              }`
            }
          >
            {/* The icon gets colored green when the link is active */}
            <span className="group-[.active]:text-green-500">
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Bottom Action */}
      <div className="mt-auto px-2">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-white">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;