import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLock, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.put("/auth/me", {
        currentPassword: formData.currentPassword,
        password: formData.newPassword
      });
      toast.success("Password changed successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
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
          Change Password
        </h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiLock /> Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Enter current password"
            required
          />
        </div>

        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiLock /> New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold flex items-center gap-2">
            <FiLock /> Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200"
            placeholder="Confirm new password"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiSave className="w-5 h-5" />
          {loading ? "Changing..." : "Change Password"}
        </motion.button>
      </motion.form>
    </div>
  );
}