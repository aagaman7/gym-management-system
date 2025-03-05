import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import SignIn from './pages/Signin';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected Routes for Member */}
        <Route element={<ProtectedRoute allowedRoles={["Member"]} />}>
          <Route path="member-dashboard" element={<MemberDashboard />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
