import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
      navigate("/signin");
    }
  }, []);

  return <h1>Welcome to the Admin Dashboard</h1>;
};

export default AdminDashboard;
