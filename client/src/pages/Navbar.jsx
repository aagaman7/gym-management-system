import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi"; // Profile icon import

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50 text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Make the GYMTEAM text a link to the homepage */}
        <Link to="/" className="text-2xl font-bold tracking-widest">
          GYMTEAM
        </Link>
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-lime-500">Home</Link>
          <Link to="/" className="hover:text-lime-500">Blog</Link>
          <Link to="/" className="hover:text-lime-500">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Profile icon replacing the Sign In button with color change on hover */}
          <Link
            to="/signin" // Direct the user to their profile page
            className="flex items-center justify-center w-10 h-10 bg-transparent text-white font-semibold rounded-full hover:text-lime-500 hover:bg-transparent transition"
          >
            <FiUser className="w-6 h-6" />
          </Link>
          <FiMenu className="w-6 h-6 cursor-pointer md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-80 text-white">
          <div className="p-4 space-y-4">
            <Link to="/" className="block hover:text-lime-500">Home</Link>
            <Link to="/blog" className="block hover:text-lime-500">Blog</Link>
            <Link to="/contact" className="block hover:text-lime-500">Contact</Link>
            <Link
              to="/"signin
              className="block text-center px-6 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
