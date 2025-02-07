import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Gym Management System</h1>
      </header>
      <main className="flex-1 p-4">
        <h2 className="text-xl font-semibold">Welcome to the Gym!</h2>
        <p className="mt-2">Manage your members, staff, and schedules easily.</p>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © 2025 Gym Management System
      </footer>
    </div>
  );
}

export default App;
