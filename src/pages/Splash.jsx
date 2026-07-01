import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/crunch-corner-welcome-logo.png";

// Helper function to check if user is admin
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "Admin");
};

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for loading to finish, then navigate
    if (!loading) {
      const timer = setTimeout(() => {
        console.log("Splash: user=", user, "navigating to", user ? (isAdmin(user) ? "/admin" : "/menu") : "/welcome");
        if (user) {
          if (isAdmin(user)) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/menu", { replace: true });
          }
        } else {
          navigate("/welcome", { replace: true });
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-50 dark:bg-warmGray-950 overflow-hidden">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="mb-12"
      >
        <img
          src={logo}
          alt="Crunch Corner Logo"
          className="w-72 md:w-80 lg:w-96 h-auto object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Themed Loading Spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center gap-2"
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-primary-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="w-4 h-4 rounded-full bg-secondary-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-4 h-4 rounded-full bg-primary-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </motion.div>
    </div>
  );
}