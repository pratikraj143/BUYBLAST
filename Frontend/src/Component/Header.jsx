import React from 'react';
import logoIMG from '../assets/logoIMG.png';
import svg from '../assets/react.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../utils/authUtils';

const Header = () => {
    const { showLogin, showSignup } = useSelector((state) => state.header);
    const { isAuthenticated } = useAuth();
    return (
        <header className="flex items-center justify-between px-4 py-2 relative z-50">
            <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center">
                <img
                    src={logoIMG}
                    alt="Logo"
                    className="w-22 h-22 rounded-full object-cover"
                />
            </Link>
            {/* Logo + Animated Title */}
            <div className="flex items-center gap-5 mt-3 animate-bounce">
                {/* Replace this SVG with your actual logo or image if needed */}
                <svg
                    width="157"
                    height="40"
                    viewBox="0 0 157 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                >
                    <path
                        d="M18.4555 0L0 39.7208H5.6258L24.0813 0H18.4555Z"
                        fill="#1E40AF"
                    />
                    <path
                        d="M138.544 0L157 39.7208H151.374L132.919 0H138.544Z"
                        fill="#1E40AF"
                    />
                    <circle cx="78.5" cy="20" r="10" fill="#3B82F6" />
                </svg>

                <Link to="/" className="text-3xl sm:text-4xl font-bold text-blue-900 tracking-wide">
                    🛍️ NIT KKR Buy & Sell
                </Link>
            </div>

            <div className="hidden md:flex space-x-4">
                {showLogin && (
                    <Link
                        to="/login"
                        className="text-indigo-600 bg-indigo-100 px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                    >
                        Login
                    </Link>
                )}
                {showSignup && (
                    <Link
                        to="/signup"
                        className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        Sign up
                    </Link>
                )}
            </div>
           
        </header>
    );
};

export default Header;