import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../utils/api";
import { FiCoffee, FiClipboard, FiDollarSign, FiClock, FiTruck, FiCheckCircle, FiShoppingBag, FiFolder, FiLogOut, FiUser, FiSettings, FiArrowLeft } from "react-icons/fi";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/orders/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: <FiClock className="text-2xl" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: <FiClipboard className="text-2xl" />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400" },
    { label: "Total Revenue", value: `Rs ${stats?.totalRevenue || 0}`, icon: <FiDollarSign className="text-2xl" />, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" },
    { label: "Total Foods", value: stats?.totalFoods || 0, icon: <FiCoffee className="text-2xl" />, color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400" },
  ];

  const orderStatusCards = [
    { label: "Pending", value: stats?.pendingOrders || 0, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400" },
    { label: "Preparing", value: stats?.preparingOrders || 0, color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" },
    { label: "Out for Delivery", value: stats?.outForDeliveryOrders || 0, color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400" },
    { label: "Delivered", value: stats?.deliveredOrders || 0, color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/admin/profile"
              className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
            >
              <FiUser className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                Admin
              </h1>
              <p className="text-warmGray-600 dark:text-warmGray-400 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative group">
              <button
                onClick={() => navigate("/menu")}
                className="p-2 md:p-3 bg-white dark:bg-warmGray-800 hover:bg-warmGray-100 dark:hover:bg-warmGray-700 text-primary-600 dark:text-primary-400 rounded-lg transition-all duration-200"
                title="View User Menu"
              >
                <FiShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-warmGray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                View User Menu
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => navigate("/admin/settings")}
                className="p-2 md:p-3 bg-white dark:bg-warmGray-800 hover:bg-warmGray-100 dark:hover:bg-warmGray-700 text-primary-600 dark:text-primary-400 rounded-lg transition-all duration-200"
                title="Settings"
              >
                <FiSettings className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-warmGray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Settings
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={logout}
                className="p-2 md:p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-warmGray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Logout
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-xl font-semibold text-warmGray-600 dark:text-warmGray-400">
              Loading stats...
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions (Top on Mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-warmGray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                    <FiFolder className="text-xl md:text-2xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-warmGray-900 dark:text-white">
                    Category Management
                  </h2>
                </div>
                <p className="text-warmGray-600 dark:text-warmGray-400 mb-4 md:mb-6 text-sm md:text-base">
                  Create and manage categories.
                </p>
                <Link
                  to="/admin/categories"
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-colors font-semibold text-base md:text-lg"
                >
                  Manage Categories
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-warmGray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                    <FiCoffee className="text-xl md:text-2xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-warmGray-900 dark:text-white">
                    Food Management
                  </h2>
                </div>
                <p className="text-warmGray-600 dark:text-warmGray-400 mb-4 md:mb-6 text-sm md:text-base">
                  Add, edit, delete, and manage food items.
                </p>
                <Link
                  to="/admin/foods"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-colors font-semibold text-base md:text-lg"
                >
                  Manage Foods
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-warmGray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400">
                    <FiClipboard className="text-xl md:text-2xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-warmGray-900 dark:text-white">
                    Order Management
                  </h2>
                </div>
                <p className="text-warmGray-600 dark:text-warmGray-400 mb-4 md:mb-6 text-sm md:text-base">
                  View all orders and update statuses.
                </p>
                <Link
                  to="/admin/orders"
                  className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-colors font-semibold text-base md:text-lg"
                >
                  Manage Orders
                </Link>
              </motion.div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {statCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (0.05 * index) }}
                  className="bg-white dark:bg-warmGray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
                >
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className={`p-2 md:p-3 rounded-xl ${card.color}`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-warmGray-900 dark:text-white">
                    {card.value}
                  </h3>
                  <p className="text-warmGray-600 dark:text-warmGray-400 mt-1 text-sm">
                    {card.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Order Status Overview */}
            <div className="bg-white dark:bg-warmGray-900 rounded-2xl p-4 md:p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800 mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-warmGray-900 dark:text-white mb-4 md:mb-6">
                Order Status Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {orderStatusCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (0.05 * index) }}
                    className="rounded-xl p-4 md:p-5 border border-warmGray-100 dark:border-warmGray-800"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-warmGray-900 dark:text-white">
                        {card.label}
                      </h3>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${card.color}`}>
                        {card.label === "Pending" && <FiClock className="text-lg md:text-xl" />}
                        {card.label === "Preparing" && <FiCoffee className="text-lg md:text-xl" />}
                        {card.label === "Out for Delivery" && <FiTruck className="text-lg md:text-xl" />}
                        {card.label === "Delivered" && <FiCheckCircle className="text-lg md:text-xl" />}
                      </div>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-warmGray-900 dark:text-white mt-2 md:mt-3">
                      {card.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
