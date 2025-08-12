import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../utils/appSlice';
import { setProfile, updateProfileImage } from '../utils/userSlice';
import { useAuth } from '../utils/authUtils';
import HomeHeader from '../Component/HomeHeader.jsx';
import axios from 'axios';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { token } = useAuth();
    const { user } = useSelector(store => store.user);
    
    // Initialize state with user data or empty values
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        branch: '',
        whatsapp: '',
        profileImage: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(setCurrentPage('profile'));
        
        // Fetch user profile data
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://buy-and-blast.onrender.com/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data) {
                    setUserData(response.data);
                    // Also update Redux store
                    dispatch(setProfile(response.data));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile data');
                
                // If API fails, try to use data from Redux
                if (user) {
                    setUserData({
                        name: user.name || '',
                        email: user.email || '',
                        branch: user.branch || '',
                        whatsapp: user.whatsapp || '',
                        profileImage: user.profileImage || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        
        // Only fetch profile data once when component mounts
        fetchUserProfile();
    }, [dispatch, token]); // Removed user from dependencies

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Create a local preview immediately for better UX
        const localPreviewUrl = URL.createObjectURL(file);
        const tempImage = new Image();
        
        // Set a temporary local preview
        setUserData(prev => ({ ...prev, profileImage: localPreviewUrl }));
        
        try {
            if (loading) return; // Prevent concurrent uploads
            
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('image', file);
            
            setLoading(true);
            setError('');
            
            console.log('Uploading image to server...');
            // Upload the image to the server
            const response = await axios.post('https://buy-and-blast.onrender.com/api/auth/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Upload response:', response.data);
            if (response.data && response.data.imageUrl) {
                // Update the user data with the Cloudinary URL
                setUserData(prev => ({ ...prev, profileImage: response.data.imageUrl }));
                console.log('Profile image updated with:', response.data.imageUrl);
                
                // Also update Redux store with the new image URL
                dispatch(updateProfileImage(response.data.imageUrl));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
            
            // Revert to previous image if upload fails
            if (user && user.profileImage) {
                setUserData(prev => ({ ...prev, profileImage: user.profileImage }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (loading) return; // Prevent multiple clicks
        
        try {
            console.log('Starting save changes process...');
            console.log('Current userData:', userData);
            
            setLoading(true);
            setError('');
            
            const response = await axios.put('https://buy-and-blast.onrender.com/api/auth/update-profile', {
                whatsapp: userData.whatsapp,
                profileImage: userData.profileImage,
                branch: userData.branch
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Save response:', response.data);
            
            if (response.data) {
                // Update Redux store with the updated user data
                dispatch(setProfile(response.data.user));
                
                // Store user data in localStorage to persist across page refreshes
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            console.log('Save process completed, setting loading to false');
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <HomeHeader />
            <div className="min-h-screen bg-gradient-to-r from-[#f9f9f9] to-[#e0e7ff] flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white/30 backdrop-blur-md shadow-xl rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 transition-all duration-300 border border-gray-200">
                    {/* Profile Image Card */}
                    <div className="relative w-full md:w-auto flex flex-col items-center">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 hover:scale-105 transition-transform duration-300 shadow-xl">
                            <img
                                src={userData.profileImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
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
                            <span className="mt-2 sm:mt-4 inline-block cursor-pointer text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg transition-all duration-300">
                                Change Photo
                            </span>
                        </label>
                    </div>

                    {/* Info Form */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 md:mt-0">
                        <div>
                            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userData.name || ''}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email || ''}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1">Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={userData.branch || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                                placeholder="Enter your branch"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1">WhatsApp No</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={userData.whatsapp || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white shadow-sm"
                                placeholder="Enter your WhatsApp number"
                            />
                        </div>
                        <div className="col-span-2 text-center mt-4">
                            <button
                                onClick={handleSaveChanges}
                                disabled={loading}
                                className={`px-4 sm:px-6 py-1.5 sm:py-2 ${loading ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-green-600 hover:bg-green-700 cursor-pointer transform hover:scale-105'} text-white rounded-full font-medium shadow-md transition-all duration-300 min-w-[120px] sm:min-w-[150px]`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save Changes'}
                            </button>
                            
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
