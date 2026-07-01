import { useContext } from "react";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiPhone,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/crunch-corner-welcome-logo.png";

const userMenuItems = [
  { icon: FiShoppingBag, label: "My Orders", path: "/orders" },
  { icon: FiUser, label: "My Profile", path: "/my-profile" },
  { icon: FiMapPin, label: "Delivery Address", path: "/delivery-address", fromSettings: true },
  { icon: FiCreditCard, label: "Payment Methods", path: "/payment-methods", fromSettings: true },
  { icon: FiPhone, label: "Contact Us", path: "/contact-us" },
  { icon: FiHelpCircle, label: "Help & FAQs", path: "/help-faqs" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
];

export default function Profile() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/welcome");
  };

  return (
    <div className="p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-warmGray-900 dark:text-white">
              {user?.displayName || "User"}
            </h1>
            <p className="text-warmGray-600 dark:text-warmGray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <div className="space-y-2">
          {userMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.path && navigate(item.path, { state: { fromSettings: item.fromSettings } })}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-warmGray-900 rounded-2xl shadow-sm border border-warmGray-100 dark:border-warmGray-800 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 bg-primary-100 dark:bg-warmGray-800 rounded-xl">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="font-semibold text-warmGray-900 dark:text-white text-lg">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="border-t-2 border-primary-100 dark:border-warmGray-800 pt-6 mb-8"
      >
        <div className="flex items-center justify-between p-4 bg-white dark:bg-warmGray-900 rounded-2xl border border-warmGray-100 dark:border-warmGray-800 mb-6">
          <span className="font-semibold text-warmGray-900 dark:text-white text-lg">
            Dark Mode
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
              isDarkMode ? "bg-primary-500" : "bg-warmGray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                isDarkMode ? "left-7" : "left-1"
              }`}
            />
          </motion.button>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 p-4 bg-error/10 hover:bg-error/20 text-error rounded-2xl font-semibold text-lg transition-all duration-200"
      >
        <FiLogOut className="w-6 h-6" />
        <span>Log Out</span>
      </motion.button>
    </div>
  );
}
