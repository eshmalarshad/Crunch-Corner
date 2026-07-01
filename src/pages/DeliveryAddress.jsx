import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import API from "../utils/api";

export default function DeliveryAddress() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSettings = location.state?.fromSettings;
  const { user, setUser } = useAuth(); // We'll add setUser to AuthContext for simplicity

  useEffect(() => {
    if (user && user.deliveryAddress) {
      setAddress(user.deliveryAddress.address || "");
      setCity(user.deliveryAddress.city || "");
      setPhone(user.deliveryAddress.phone || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!address || !city || !phone) {
      toast.error("Please fill all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Saving delivery address to API...");
      // Update directly via API instead of updateUser to simplify
      const response = await API.put("/auth/me", { deliveryAddress: { address, city, phone } });
      console.log("Update response:", response.data);

      // Update user state manually
      setUser({
        ...user,
        deliveryAddress: response.data.deliveryAddress
      });

      toast.success("Address saved successfully!");
      
      // Navigate immediately after success
      if (fromSettings) {
        navigate(-1);
      } else {
        navigate("/payment-methods");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(err.response?.data?.msg || "Failed to save address");
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
          Delivery Address
        </h1>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white transition-all duration-200"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-warmGray-700 dark:text-warmGray-400 mb-2 font-semibold">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full p-4 bg-primary-50 dark:bg-warmGray-800 border-2 border-warmGray-200 dark:border-warmGray-700 rounded-xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white transition-all duration-200"
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 mt-6 disabled:opacity-50"
        >
          {loading ? "Saving..." : (fromSettings ? "Save Address" : "Continue to Payment")}
        </motion.button>
      </form>
    </div>
  );
}
