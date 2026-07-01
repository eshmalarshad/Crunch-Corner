import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import API from "../utils/api";
import toast from "react-hot-toast";

const statuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

export default function AdminOrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");
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
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Preparing":
        return "bg-blue-100 text-blue-600";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              Order Management
            </h1>
          </div>
          <Link
            to="/admin/profile"
            className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
          >
            <FiUser className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-warmGray-900 rounded-xl p-6 shadow-lg border border-primary-100 dark:border-warmGray-800"
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
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {order.customerName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
                    <strong>Order Time:</strong>{" "}
                    {new Date(order.orderTime).toLocaleString()}
                  </p>
                  <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  {order.subtotal && (
                    <p className="text-warmGray-500 dark:text-warmGray-400 text-sm">
                      Subtotal: Rs. {order.subtotal}
                    </p>
                  )}
                  {order.discount > 0 && (
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      Discount: - Rs. {order.discount}
                    </p>
                  )}
                  {order.deliveryCharge && (
                    <p className="text-warmGray-500 dark:text-warmGray-400 text-sm">
                      Delivery: Rs. {order.deliveryCharge}
                    </p>
                  )}
                  <p className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                    Total: Rs. {order.totalPrice}
                  </p>
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

              <div>
                <label className="block text-sm font-semibold text-warmGray-600 dark:text-warmGray-400 mb-2">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full md:w-64 p-3 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
