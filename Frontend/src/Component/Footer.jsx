import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-5 bg-gradient-to-r from-slate-100 to-blue-100 text-gray-800">
     
      {/* Tagline */}
      <p className="mt-3 text-center text-sm text-gray-600 mb-6 px-6">
        A marketplace for students, by students. Sell smart, buy smarter 💼📱📚
      </p>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 font-medium">
        <a href="#" className="hover:text-blue-600 transition duration-200">
          Brand Guidelines
        </a>
        <span className="h-4 w-px bg-gray-300"></span>
        <a href="#" className="hover:text-blue-600 transition duration-200">
          Privacy Policy
        </a>
        <span className="h-4 w-px bg-gray-300"></span>
        <a href="#" className="hover:text-blue-600 transition duration-200">
          Terms of Service
        </a>
      </div>

      {/* Copyright */}
      <p className="text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} NIT KKR Buy & Sell. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
