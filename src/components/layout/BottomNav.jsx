import { FiHome, FiShoppingCart, FiHeart, FiFileText, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/menu", icon: FiHome, label: "Home" },
    { path: "/cart", icon: FiShoppingCart, label: "Cart" },
    { path: "/orders", icon: FiFileText, label: "Orders" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white dark:bg-warmGray-900 border-t border-warmGray-200 dark:border-warmGray-800 flex justify-around py-3 px-2 shadow-lg">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-warmGray-600 dark:text-warmGray-400 hover:bg-primary-100 dark:hover:bg-warmGray-800"
              }`}
            >
              <Icon size={20} />
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-warmGray-600 dark:text-warmGray-400"
              }`}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}