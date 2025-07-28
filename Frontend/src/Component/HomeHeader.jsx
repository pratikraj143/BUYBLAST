import React, { useState, useRef, useEffect } from 'react';
import logoIMG from '../assets/logoIMG.png';
import { NavLink, useNavigate } from 'react-router-dom';

const HomeHeader = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", path: "/home" },
        { name: "Sell Now", path: "/sell" },
        { name: "Feedback", path: "/feedback" }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token"); // if you are using JWT
        localStorage.removeItem("user");  // if you're storing user info
        // Clear anything else you stored during login
        navigate("/login"); // redirect to login page
    };


    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className=" flex items-center justify-between px-4 py-2 shadow-md bg-white z-50">
            {/* Logo + Animated Title */}
            <div className=" flex items-center gap-4">
                <a href="/" className="flex items-center">
                    <img
                        src={logoIMG}
                        alt="Logo"
                        className="w-22 h-22 rounded-full object-cover"
                    />
                </a>

                <div className="ml-65 flex items-center gap-3 animate-bounce">
                    <svg
                        width="157"
                        height="40"
                        viewBox="0 0 157 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10"
                    >
                        <path d="M18.4555 0L0 39.7208H5.6258L24.0813 0H18.4555Z" fill="#1E40AF" />
                        <path d="M138.544 0L157 39.7208H151.374L132.919 0H138.544Z" fill="#1E40AF" />
                        <circle cx="78.5" cy="20" r="10" fill="#3B82F6" />
                    </svg>

                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-wide">
                        🛍️ NIT KKR Buy & Sell
                    </h1>
                </div>
            </div>

            {/* Navigation + Dropdown */}
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

                {/* Profile Image & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
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
    );
};

export default HomeHeader;
