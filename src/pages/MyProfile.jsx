import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function MyProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      await updateUser({ name: userData.name.trim() });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white">
          My Profile
        </h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="space-y-4"
      >
        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiUser /> Full Name
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiMail /> Email Address
          </label>
          <input
            type="email"
            value={userData.email}
            disabled
            className="w-full p-4 bg-warmGray-100 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl text-warmGray-500 dark:text-warmGray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiPhone /> Phone Number
          </label>
          <input
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your phone number"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiSave className="w-5 h-5" />
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.form>
    </div>
  );
}