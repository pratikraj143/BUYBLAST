import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    SetShowPassword,
    updateLoginForm,
    setToken,
    setAuthenticated,
    setUser,
    resetLoginForm,
    setProfile // <-- imported
} from '../utils/userSlice';
import { hideLoginButton } from '../utils/headerSlice';
import { setCurrentPage } from '../utils/appSlice';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Component/Header.jsx';

function Login() {
    const { showpassword, loginForm } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(hideLoginButton());
        dispatch(setCurrentPage('login'));
    }, [dispatch]);

    const handleChange = (e) => {
        dispatch(updateLoginForm({ [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Login successful');
                console.log("✅ Backend response user:", data.user);

                dispatch(setToken(data.token));
                dispatch(setAuthenticated(true));

                const userData = data.user || { email: loginForm.email };
                dispatch(setUser(userData));

                // 🟡 Update profile slice here
                dispatch(setProfile({
                    name: userData.name || '',
                    email: userData.email || '',
                    branch: userData.branch || '',
                    whatsapp: userData.whatsappNumber || '',
                }));

                dispatch(resetLoginForm());

                setTimeout(() => {
                    navigate('/home');
                }, 100);
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('Server error. Try again later.');
        }
    };

    const toggleShowPassword = () => {
        dispatch(SetShowPassword());
    };

    return (
        <>
            <Header />
            <div className="flex h-[400px] w-6/10 mx-auto my-16 shadow-lg rounded-lg overflow-hidden">
                {/* Left Image Section */}
                <div className="w-full hidden md:inline-block">
                    <img
                        className="h-full w-full object-cover"
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
                        alt="leftSideImage"
                    />
                </div>

                {/* Right Form Section */}
                <div className="w-full flex flex-col items-center justify-center p-4">
                    <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
                        <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                        <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>
                        <p className="text-center text-sm text-gray-600 mt-2 mb-4">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                                Register now
                            </Link>
                        </p>

                        {/* Email Field */}
                        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-4">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                            </svg>
                            <input
                                type="email"
                                name="email"
                                value={loginForm.email}
                                onChange={handleChange}
                                placeholder="Email ID"
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full pl-6 pr-12 gap-2">
                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                            </svg>

                            <input
                                type={showpassword ? 'text' : 'password'}
                                name="password"
                                value={loginForm.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                                required
                            />

                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute right-4 text-xl text-gray-500 hover:text-pink-600 focus:outline-none cursor-pointer transition-colors"
                            >
                                {showpassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
