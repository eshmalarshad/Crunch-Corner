import { useContext } from "react";
import { motion } from "framer-motion";
import {
  FiGlobe,
  FiLock,
  FiTrash2,
  FiArrowLeft,
  FiChevronRight,
} from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const settingsSections = [
  {
    title: "Preferences",
    items: [
      { icon: FiGlobe, label: "Language", path: null },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: FiLock, label: "Change Password", path: "/change-password" },
      { icon: FiTrash2, label: "Delete Account", isDanger: true, path: null },
    ],
  },
];

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, user, updateUser } = useAuth();
  const darkMode = theme === "dark";
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      toast.success("Account deleted successfully");
      logout();
      navigate("/welcome");
    }
  };

  const handleItemClick = (item) => {
    if (item.isDanger) {
      handleDeleteAccount();
    } else if (item.path) {
      navigate(item.path);
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
          Settings
        </h1>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-5 bg-white dark:bg-warmGray-900 rounded-2xl shadow-sm border border-warmGray-100 dark:border-warmGray-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-warmGray-800 rounded-xl">
              🌙
            </div>
            <span className="font-semibold text-warmGray-900 dark:text-white text-lg">
              Dark Mode
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
              darkMode ? "bg-primary-500" : "bg-warmGray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                darkMode ? "left-7" : "left-1"
              }`}
            />
          </motion.button>
        </div>
      </motion.div>

      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + sectionIndex * 0.05 }}
            className="text-sm font-semibold text-warmGray-500 dark:text-warmGray-500 uppercase tracking-wider mb-3 px-1"
          >
            {section.title}
          </motion.h2>
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={`${sectionIndex}-${itemIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + sectionIndex * 0.05 + itemIndex * 0.03 }}
                  onClick={() => handleItemClick(item)}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-4 bg-white dark:bg-warmGray-900 rounded-2xl shadow-sm border border-warmGray-100 dark:border-warmGray-800 flex items-center justify-between ${
                    item.isDanger ? "border-error/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      item.isDanger ? "bg-error/10" : "bg-primary-100 dark:bg-warmGray-800"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        item.isDanger ? "text-error" : "text-primary-600 dark:text-primary-400"
                      }`} />
                    </div>
                    <span className={`font-semibold text-lg ${
                      item.isDanger
                        ? "text-error"
                        : "text-warmGray-900 dark:text-white"
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  {item.path && (
                    <FiChevronRight className="w-5 h-5 text-warmGray-400" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4 border-t border-warmGray-200 dark:border-warmGray-800 text-center"
      >
        <p className="text-warmGray-500 dark:text-warmGray-500 text-sm">
          App Version 1.0.0
        </p>
      </motion.div>
    </div>
  );
}
