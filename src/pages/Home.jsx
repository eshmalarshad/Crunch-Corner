import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    } else if (!loading && !user) {
      navigate("/welcome");
    }
  }, [user, loading, navigate]);

  return <div>Loading...</div>;
}