import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, User, LogOut, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/Auth.context';

const UserNavbar = () => {
  const {logout , user} = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log("Logging out...");
    logout()
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 h-16 bg-[#121212]/90 backdrop-blur-md flex items-center justify-between px-6 z-50">
      
      {/* Left Side: Navigation Arrows & Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 mr-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 bg-black rounded-full text-gray-400 hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => navigate(1)}
            className="p-1 bg-black rounded-full text-gray-400 hover:text-white transition hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Search Bar - Responsive */}
        <div className="relative max-w-md w-full group">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white" 
            size={20} 
          />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            className="w-full bg-[#242424] border border-transparent hover:bg-[#2a2a2a] hover:border-[#333] focus:border-white focus:outline-none rounded-full py-2.5 pl-10 pr-4 text-sm text-white transition-all"
          />
        </div>
      </div>

      {/* Right Side: User Profile & Logout */}
      <div className="relative ml-4">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-black p-1 pr-3 rounded-full hover:scale-105 transition active:scale-95 border border-transparent focus:border-gray-500"
        >
          <div className="w-7 h-7 bg-[#282828] rounded-full flex items-center justify-center">
            <User size={18} className="text-gray-300" />
          </div>
          <span className="text-sm font-bold hidden sm:block">{user?.name || "User Name"}</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#282828] shadow-2xl rounded-md p-1 border border-white/10">
            <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold hover:bg-white/10 rounded-sm transition text-left">
              Account <ExternalLink size={16} />
            </button>
            <button className="w-full px-3 py-2.5 text-sm font-semibold hover:bg-white/10 rounded-sm transition text-left">
              Profile
            </button>
            <div className="h-[1px] bg-white/10 my-1 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold hover:bg-white/10 rounded-sm transition text-left text-red-400"
            >
              Log out <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavbar;