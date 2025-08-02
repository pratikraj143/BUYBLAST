import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Chatpage from '../page/Chatpage';
import chat from '../assets/chat.png';
import logoIMG from '../assets/LogoIMG.png';

const HomeHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const { user } = useSelector(state => state.user);
  
  // State for profile image
  const [profileImage, setProfileImage] = useState('https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Sell Now", path: "/sell" },
    { name: "Feedback", path: "/feedback" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(e.target)) {
        setShowChat(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Effect to update profile image when user data changes
  useEffect(() => {
    // Try to get user data from Redux first
    if (user && user.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      // If not in Redux, try localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.profileImage) {
            setProfileImage(parsedUser.profileImage);
          }
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
  }, [user]);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white z-50 relative">
        {/* Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="/" className="flex items-center">
            <img src={logoIMG} alt="Logo" className="w-22 h-22 rounded-full object-cover" />
          </a>

          <div className="flex items-center gap-1 sm:gap-3 animate-bounce">
            <svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
              <path d="M18.4555 0L0 39.7208H5.6258L24.0813 0H18.4555Z" fill="#1E40AF" />
              <path d="M138.544 0L157 39.7208H151.374L132.919 0H138.544Z" fill="#1E40AF" />
              <circle cx="78.5" cy="20" r="10" fill="#3B82F6" />
            </svg>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900 tracking-wide">
              🛍️ NIT KKR Buy & Sell
            </h1>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-indigo-700 p-2 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation + Chat + Dropdown */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium relative">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `transition duration-200 px-3 py-1 rounded-full ${isActive
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-700 hover:bg-indigo-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Chat Icon Toggle */}
          <div className="relative" ref={chatDropdownRef}>
            <div
              className="w-10 cursor-pointer"
              onClick={() => setShowChat(!showChat)}
            >
              <img src={chat} alt="Chat" />
            </div>

            {/* Chat Dropdown Panel */}
            {showChat && (
              <div
                className="fixed right-4 sm:right-16 top-16 w-[90vw] sm:w-[70vw] md:w-96 max-h-[70vh] sm:max-h-[32rem] bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden"
              >
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-medium text-indigo-700">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                  <Chatpage />
                </div>
              </div>
            )}
          </div>


          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
                }}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-40 bg-white bg-opacity-95 flex flex-col pt-16 px-4 pb-6 shadow-lg"
        >
          <div className="flex flex-col space-y-4 items-center text-base font-medium">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `transition duration-200 px-4 py-2 rounded-full w-full text-center ${isActive
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-700 hover:bg-indigo-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile Chat Button */}
            <button
              onClick={() => {
                setShowChat(!showChat);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-indigo-700 hover:bg-indigo-100 w-full"
            >
              <img src={chat} alt="Chat" className="w-6 h-6" />
              <span>Messages</span>
            </button>

            {/* Mobile Profile Options */}
            <div className="border-t border-gray-200 pt-4 w-full">
              <button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-indigo-700 hover:bg-indigo-100 w-full"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-indigo-700 hover:bg-indigo-100 w-full mt-2"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
