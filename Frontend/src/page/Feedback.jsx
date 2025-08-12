import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../utils/appSlice';
import { addNotification } from '../utils/appSlice';
import HomeHeader from '../Component/HomeHeader';
import { motion } from 'framer-motion';

function Feedback() {
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage('feedback'));
    }, [dispatch]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const rating = form.querySelector('select').value;
        const like = form.querySelector('#like').value;
        const improve = form.querySelector('#improve').value;

        if (!rating || !improve.trim()) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const res = await fetch("https://buy-and-blast.onrender.com/api/feedback/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, rating, like, improve })
            });

            const data = await res.json();
            if (res.ok) {
                setShowPopup(true);
                form.reset();
                dispatch(addNotification({
                    id: Date.now(),
                    type: 'success',
                    message: 'Feedback submitted successfully!'
                }));
                setTimeout(() => setShowPopup(false), 3000);
            } else {
                dispatch(addNotification({
                    id: Date.now(),
                    type: 'error',
                    message: data.message || "Failed to send feedback."
                }));
                alert(data.message || "Failed to send feedback.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };


    return (
        <div>
        <HomeHeader />
        
        <motion.div
            className="min-h-screen px-3 sm:px-4 py-4"
            style={{
                background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 50%, #f3e8ff 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            
            <div className="relative">
                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white max-w-xl mx-auto my-8 p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">We'd Love Your Feedback!</h2>
                    <p className="text-sm text-gray-600">Help us improve your experience by filling out this quick form.</p>

                    <div>
                        <label htmlFor="name" className="font-medium text-gray-700">Your Name (optional)</label>
                        <input id="name" type="text" placeholder="Enter your Name" className="w-full mt-1.5 border border-gray-300 rounded px-3 py-2 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="email" className="font-medium text-gray-700">Email (optional)</label>
                        <input id="email" type="email" placeholder="you@example.com" className="w-full mt-1.5 border border-gray-300 rounded px-3 py-2 outline-none" />
                    </div>

                    <div>
                        <label className="font-medium text-gray-700">How would you rate your overall experience?<span className='text-red-600'> *</span></label>
                        <select required className="w-full mt-1.5 border border-gray-300 rounded px-3 py-2">
                            <option value="">Choose a rating</option>
                            <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                            <option value="4">⭐⭐⭐⭐ - Good</option>
                            <option value="3">⭐⭐⭐ - Average</option>
                            <option value="2">⭐⭐ - Poor</option>
                            <option value="1">⭐ - Very Poor</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="like" className="font-medium text-gray-700">What did you like about our app?</label>
                        <textarea id="like" rows={3} placeholder="e.g. Simple UI, easy listing process..." className="w-full resize-none mt-1.5 border border-gray-300 rounded px-3 py-2 outline-none" />
                    </div>

                    <div>
                        <label htmlFor="improve" className="font-medium text-gray-700">What can we improve?<span className='text-red-600'> *</span></label>
                        <textarea required id="improve" rows={3} placeholder="e.g. Add payment gateway, any changes in UI..." className="w-full resize-none mt-1.5 border border-gray-300 rounded px-3 py-2 outline-none" />
                    </div>

                    <button type="submit" className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded">
                        Submit Feedback
                    </button>
                </form>

                {/* Popup */}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-green-300 max-w-xs">
                            <div className="text-green-500 text-4xl mb-2">✅</div>
                            <h3 className="text-lg font-semibold text-gray-800">Thank you!</h3>
                            <p className="text-sm text-gray-600 mt-1">Your feedback has been submitted successfully.</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
        </div>
    );
}

export default Feedback;
