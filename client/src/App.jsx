import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Membership from './pages/Membership';
import MembershipDetails from './pages/MembershipDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
// import Checkout from './pages/Checkout';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import NotFound from './pages/NotFound';
// import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
// import './assets/styles/main.css';

// Private route component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="min-h-screen pt-16">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership-details/:id" element={<MembershipDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/checkout" element={<Checkout />} /> */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;