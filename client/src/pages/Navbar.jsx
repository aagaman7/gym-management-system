import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50 text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold tracking-widest">GYMTEAM</div>
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-lime-500">Home</Link>
          <Link to="/blog" className="hover:text-lime-500">Blog</Link>
          <Link to="/contact" className="hover:text-lime-500">Contact</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/signin"
            className="px-6 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition"
          >
            Sign In
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
              to="/signin"
              className="block text-center px-6 py-2 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
