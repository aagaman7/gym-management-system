import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Member") {
      navigate("/signin");
    }
  }, []);

  return <h1>Welcome to the Member Dashboard</h1>;
};

export default MemberDashboard;
