import React, { useState } from 'react';
import HomeHeader from '../Component/HomeHeader.jsx';

const UserProfile = () => {
    const [profileImage, setProfileImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <HomeHeader />
            <div className="min-h-screen bg-gradient-to-r from-[#f9f9f9] to-[#e0e7ff] flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white/30 backdrop-blur-md shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10 transition-all duration-300 border border-gray-200">

                    {/* Profile Image Card */}
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 hover:scale-105 transition-transform duration-300 shadow-xl">
                            <img
                                src={
                                    profileImage ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border-4 border-white"
                            />
                        </div>
                        <label className="mt-3 block text-center">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <span className="mt-4 inline-block cursor-pointer text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-lg transition-all duration-300">
                                Change Photo
                            </span>
                        </label>
                    </div>

                    {/* Info Form */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                value="prakart"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value="email@gmail.com"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Branch</label>
                            <input
                                type="text"
                                value="mtech"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">WhatsApp No</label>
                            <input
                                type="text"
                                value="xxxxxxxx"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
