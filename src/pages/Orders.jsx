import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiTruck, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get(`/orders/user/${user._id}`);
      let ordersData = response.data;
      // Convert all numeric fields to numbers
      ordersData = ordersData.map(order => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        originalTotalPrice: Number(order.originalTotalPrice),
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        deliveryCharge: Number(order.deliveryCharge || 250),
        items: order.items.map(item => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity)
        }))
      }));
      setOrders(ordersData);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FiClock className="text-yellow-500" />;
      case "Preparing":
        return <FiClock className="text-blue-500" />;
      case "Out for Delivery":
        return <FiTruck className="text-purple-500" />;
      case "Delivered":
        return <FiCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20";
      case "Preparing":
        return "text-blue-500 bg-blue-100 dark:bg-blue-500/20";
      case "Out for Delivery":
        return "text-purple-500 bg-purple-100 dark:bg-purple-500/20";
      case "Delivered":
        return "text-green-500 bg-green-100 dark:bg-green-500/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white">
          Loading...
        </h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white mb-2">
            No orders yet
          </h2>
          <p className="text-warmGray-600 dark:text-warmGray-400">
            Your order history will appear here
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white">
          My Orders
        </h1>
      </motion.div>

      <div className="space-y-4">
        {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg p-5 border border-warmGray-100 dark:border-warmGray-800"
            >
              {/* Order ID */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-warmGray-600 dark:text-warmGray-400">
                  Order ID:
                </span>
                <span className="text-sm font-mono text-primary-600 dark:text-primary-400">
                  {order.orderNumber || order._id}
                </span>
              </div>
              
              {order.isFirstOrder && (
                <div className="bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 rounded-xl p-2 mb-4">
                  <p className="text-green-700 dark:text-green-300 font-semibold text-xs flex items-center gap-2">
                    🎉 First order - 20% off applied! Saved Rs. {order.discount}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  {order.subtotal && (
                    <div className="text-warmGray-500 dark:text-warmGray-400 text-sm">
                      Subtotal: Rs. {order.subtotal}
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="text-green-600 dark:text-green-400 text-sm">
                      Discount: - Rs. {order.discount}
                    </div>
                  )}
                  {order.deliveryCharge && (
                    <div className="text-warmGray-500 dark:text-warmGray-400 text-sm">
                      Delivery: Rs. {order.deliveryCharge}
                    </div>
                  )}
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                    Rs. {order.totalPrice}
                  </span>
                </div>
              </div>

              <div className="border-t border-warmGray-200 dark:border-warmGray-700 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-warmGray-600 dark:text-warmGray-400 mb-2">
                  Items:
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => {
                    const qty = Number(item.quantity) || Number(item.qty) || 1;
                    const price = Number(item.price) || 0;
                    const itemTotal = price * qty;
                    return (
                      <div
                        key={i}
                        className="flex justify-between text-warmGray-600 dark:text-warmGray-400 text-sm"
                      >
                        <span>
                          {qty}x {item.name}
                        </span>
                        <span>Rs. {itemTotal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <p className="text-warmGray-500 dark:text-warmGray-400 text-sm mb-2">
                {new Date(order.orderTime).toLocaleString()}
              </p>
              <p className="text-warmGray-500 dark:text-warmGray-400 text-sm">
                {order.address}
              </p>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
