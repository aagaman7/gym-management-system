import React from "react";
import Navbar from "./Navbar";

const Homepage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-center"
        style={{ backgroundImage: 'url("/path-to-hero-image.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            WORK WITH <span className="text-lime-500">PROFESSIONALS</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8">
            Reach your fitness goals with the best coaches and programs.
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition">
              JOIN NOW
            </button>
            <button className="px-8 py-3 border-2 border-lime-500 text-lime-500 font-semibold rounded-lg hover:bg-lime-500 hover:text-black transition">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* Gym Passes Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">OUR GYM PASSES</h2>
        <div className="flex justify-center space-x-6">
          <div className="bg-gray-800 p-6 rounded-lg w-72">
            <h3 className="text-2xl font-semibold">CROSSFIT</h3>
            <p className="text-4xl font-bold">120$<span className="text-lg">/mo</span></p>
            <button className="mt-4 px-6 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-600 transition">
              PURCHASE NOW
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg w-72">
            <h3 className="text-2xl font-semibold">OPEN GYM</h3>
            <p className="text-4xl font-bold">109$<span className="text-lg">/mo</span></p>
            <button className="mt-4 px-6 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-600 transition">
              PURCHASE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">REVIEWS FROM CLIENTS</h2>
        <div className="bg-gray-800 p-6 rounded-lg max-w-xl mx-auto">
          <p className="text-lime-500 font-semibold">"Great gym with excellent trainers!"</p>
          <p className="text-sm mt-2">- Albert Flores</p>
        </div>
      </div>

      {/* Blog & News Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">BLOG & NEWS</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold">New Zone</h3>
            <p className="text-sm mt-2">Discover our latest gym upgrades.</p>
            <button className="mt-4 px-6 py-2 text-lime-500 border border-lime-500 rounded-lg hover:bg-lime-500 hover:text-black transition">
              READ MORE
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <p className="text-sm mt-2">Stay updated with our fitness events.</p>
            <button className="mt-4 px-6 py-2 text-lime-500 border border-lime-500 rounded-lg hover:bg-lime-500 hover:text-black transition">
              READ MORE
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; 2025 GYMTEAM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
