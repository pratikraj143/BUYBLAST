import React from 'react';
import { useAuth } from '../utils/authUtils';

const TestRoute = () => {
    const { isAuthenticated, token, user } = useAuth();
    
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Test Route</h1>
                <div className="space-y-2">
                    <p><strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
                    <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
                    <p><strong>User:</strong> {user ? JSON.stringify(user) : '❌ No user data'}</p>
                    <p><strong>Current URL:</strong> {window.location.href}</p>
                </div>
                <div className="mt-4 space-y-2">
                    <a href="/" className="block text-blue-600 hover:underline">Go to Home (/)</a>
                    <a href="/login" className="block text-blue-600 hover:underline">Go to Login</a>
                    <a href="/home" className="block text-blue-600 hover:underline">Go to Protected Home</a>
                </div>
            </div>
        </div>
    );
};

export default TestRoute; 