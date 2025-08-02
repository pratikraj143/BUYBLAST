import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Chatpage from "../page/Chatpage";
import chat from "../assets/chat.png";
import logoIMG from "../assets/LogoIMG.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

const HomeHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const [profileImage, setProfileImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Sell Now", path: "/sell" },
    { name: "Feedback", path: "/feedback" },
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
      if (
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(e.target)
      ) {
        setShowChat(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user && user.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.profileImage) {
            setProfileImage(parsedUser.profileImage);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    }
  }, [user]);

  return (
    <motion.header
      className="flex items-center justify-between px-4 py-2 shadow-md bg-white z-50 relative"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <motion.a
          href="/"
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img
            src={logoIMG}
            alt="Logo"
            className="w-22 h-22 rounded-full object-cover"
            whileHover={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          />
        </motion.a>

        <motion.div
          className="flex items-center justify-center gap-1 sm:gap-3"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: [0.95, 1.02, 1],
            opacity: 1,
            y: [0, -4, 0],
          }}
          transition={{
            scale: { duration: 0.4 },
            y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
            opacity: { duration: 0.4 },
          }}
        >
          <motion.h1
            className="text-base font-bold text-blue-900 block sm:hidden"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🛍️ NIT KKR B&S
          </motion.h1>

          <motion.h1
            className="ml-64 hidden sm:block text-lg sm:text-2xl md:text-3xl font-bold text-blue-900 tracking-wide"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🛍️ NIT KKR Buy & Sell
          </motion.h1>
        </motion.div>
      </div>

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-indigo-700 p-2 focus:outline-none"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ rotate: 0 }}
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </motion.svg>
        </button>
      </div>

      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium relative">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `transition duration-200 px-3 py-1 rounded-full ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-700 hover:bg-indigo-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          </motion.div>
        ))}

        <div className="relative" ref={chatDropdownRef}>
          <div
            className="w-10 cursor-pointer"
            onClick={() => setShowChat(!showChat)}
          >
            <motion.img
              src={chat}
              alt="Chat"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="fixed right-4 sm:right-16 top-16 w-[90vw] sm:w-[70vw] md:w-96 max-h-[70vh] sm:max-h-[32rem] bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden"
              >
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-medium text-indigo-700">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                  <Chatpage />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={dropdownRef}>
          <motion.div
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
              }}
            />
          </motion.div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50"
                >
                <div className="flex items-center gap-2 text-black cursor-pointer hover:text-red-800">
                  <FiLogOut className="text-xl text-red-600" />
                  <span className="text-base font-medium">Logout</span>
                </div>
                </button>

                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-40 bg-white bg-opacity-95 flex flex-col pt-16 px-4 pb-6 shadow-lg"
        >
          <button
            className="absolute top-4 right-4 text-indigo-700 text-2xl"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            &#10005;
          </button>
          <nav className="flex flex-col gap-6 mt-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className="text-indigo-700 text-lg font-semibold transition duration-200 rounded-lg hover:bg-indigo-100 px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              className="text-indigo-700 text-lg font-semibold transition duration-200 rounded-lg hover:bg-indigo-100 px-3 py-2"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            ><div className="flex items-center gap-2 text-black cursor-pointer hover:text-red-800">
                  <FiLogOut className="text-xl text-red-600" />
                  <span className="text-base font-medium">Logout</span>
                </div>
            </button>
          </nav>
        </div>
      )}
    </motion.header>
  );
};

export default HomeHeader;
