import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import welcomeLogo from "../assets/welcome.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-300 dark:bg-warmGray-950 overflow-hidden p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Welcome Logo */}
        <div className="mb-12">
          <img
            src={welcomeLogo}
            alt="Crunch Corner"
            className="w-64 md:w-72 lg:w-80 h-auto object-contain"
          />
        </div>

        {/* Welcome Text (optional, since logo has text) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10 text-center"
        >
          <p className="text-warmGray-700 dark:text-warmGray-200 text-sm md:text-base font-light">
            Delicious food delivered fast to your doorstep!
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full flex flex-col gap-4"
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 px-8 bg-primary-500 text-white font-bold rounded-full text-lg hover:bg-primary-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-4 px-8 bg-white dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 font-bold rounded-full text-lg hover:bg-warmGray-100 dark:hover:bg-warmGray-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
