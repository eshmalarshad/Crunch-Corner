import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiSave, 
  FiSettings, 
  FiX, 
  FiHome, 
  FiFolder, 
  FiCoffee, 
  FiPackage 
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
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
      const result = await updateUser({ name: userData.name.trim() });
      if (result.success) {
        toast.success("Profile updated successfully!");
        setShowProfileEdit(false);
      } else {
        toast.error(result.msg || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: "My Profile",
      onClick: () => setShowProfileEdit(true),
      icon: <FiUser className="text-primary-500" />,
    },
    {
      title: "Dashboard",
      to: "/admin",
      icon: <FiHome className="text-primary-500" />,
    },
    {
      title: "Category Management",
      to: "/admin/categories",
      icon: <FiFolder className="text-primary-500" />,
    },
    {
      title: "Food Management",
      to: "/admin/foods",
      icon: <FiCoffee className="text-primary-500" />,
    },
    {
      title: "Order Management",
      to: "/admin/orders",
      icon: <FiPackage className="text-primary-500" />,
    },
    {
      title: "Settings",
      to: "/admin/settings",
      icon: <FiSettings className="text-primary-500" />,
    },
  ];

  return (
    <div className="p-4 pb-32">
      {/* Header */}
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
          Admin Profile
        </h1>
      </motion.div>

      {/* Profile Edit Modal/Section */}
      {showProfileEdit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-warmGray-900 rounded-2xl p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-warmGray-900 dark:text-white">
                Edit Profile
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileEdit(false)}
                className="p-2 rounded-full bg-warmGray-100 dark:bg-warmGray-800 text-warmGray-600 dark:text-warmGray-400 hover:bg-warmGray-200 dark:hover:bg-warmGray-700 transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-warmGray-900 dark:text-white">
                  {user?.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mt-1">
                  Admin
                </span>
              </div>
            </div>

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
        </motion.div>
      )}

      {/* Menu Items */}
      {!showProfileEdit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {menuItems.map((item, index) => (
            item.to ? (
              <Link key={index} to={item.to} className="block">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-white dark:bg-warmGray-900 rounded-xl p-4 flex items-center justify-between shadow-lg border border-warmGray-100 dark:border-warmGray-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-semibold text-warmGray-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-warmGray-400">→</span>
                </motion.button>
              </Link>
            ) : (
              <motion.button
                key={index}
                whileTap={{ scale: 0.97 }}
                onClick={item.onClick}
                className="w-full bg-white dark:bg-warmGray-900 rounded-xl p-4 flex items-center justify-between shadow-lg border border-warmGray-100 dark:border-warmGray-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-warmGray-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                <span className="text-warmGray-400">→</span>
              </motion.button>
            )
          ))}
        </motion.div>
      )}
    </div>
  );
}