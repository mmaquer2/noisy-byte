import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Menu, LogOut, House, Disc3 } from 'lucide-react';

const NavHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); 

  const locations = {
    home: "/dashboard",
    soundboard: "/soundboard",
    settings: "/profile",
    logout: "/logout"
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false); // Close dropdown after navigation
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="relative w-full bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
      {/* Logo Section */}
      <div className="flex items-center">
        <svg
          viewBox="0 0 50 50"
          className="h-8 w-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 5 L45 15 L45 35 L25 45 L5 35 L5 15 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M25 15 L35 20 L35 30 L25 35 L15 30 L15 20 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="25" cy="25" r="3" fill="white" />
        </svg>
        <span className="ml-2 text-white font-bold text-xl">Noisy Byte</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex items-center space-x-4">
        <button 
          className="p-2 text-white hover:bg-zinc-800 rounded-full transition-colors"
          onClick={() => handleNavigation(locations.settings)}
        >
          <Settings className="h-5 w-5" />
        </button>

        <div className="relative">
          <button 
            className="p-2 text-white hover:bg-zinc-800 rounded-full transition-colors"
            onClick={toggleDropdown}
          >
            <Menu className="h-5 w-5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-zinc-800 rounded-md shadow-xl">
              <button 
                onClick={() => handleNavigation(locations.home)}
                className="w-full px-4 py-2 text-left text-white hover:bg-zinc-700 transition-colors flex items-center"
              >
                <House className="h-4 w-4 mr-2" />
                Home
              </button>
              <button 
                onClick={() => handleNavigation(locations.soundboard)}
                className="w-full px-4 py-2 text-left text-white hover:bg-zinc-700 transition-colors flex items-center"
              >
                <Disc3 className="h-4 w-4 mr-2" />
                Soundboard
              </button>
              <div className="my-1 border-t border-zinc-700" />
              <button 
                onClick={() => handleNavigation(locations.logout)}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-700 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavHeader;