import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../utils/authUtils';

const Header = () => {
    const { showLogin, showSignup } = useSelector((state) => state.header);
    const { isAuthenticated } = useAuth();
    return (
        <header className="shadow-md flex items-center justify-between px-4 py-2 relative z-50">
            <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center">
                <img
                    src="https://res.cloudinary.com/dzkprawxw/image/upload/v1754247101/final_logo_z1ncld.png"
                    alt="Logo"
                    className="w-22 h-22 rounded-full object-cover"
                />
            </Link>

            <div className="hidden md:flex space-x-4">
                {showLogin && (
                    <Link
                        to="/login"
                        className="text-shadow-black bg-indigo-100 px-6 py-3 rounded-full  text-sm font-medium hover:bg-indigo-500 hover:text-white transition"
                    >
                        Login
                    </Link>
                )}
                {showSignup && (
                    <Link
                        to="/signup"
                        className="text-shadow-black bg-indigo-100 px-6 py-3 rounded-full text-sm font-medium hover:bg-indigo-500 hover:text-white transition"
                    >
                        Sign up
                    </Link>
                )}
            </div>
           
        </header>
    );
};

export default Header;