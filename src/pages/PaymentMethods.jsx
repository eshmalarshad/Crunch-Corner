import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import toast from "react-hot-toast";

const DELIVERY_CHARGE = 250;

export default function PaymentMethods() {
  const [loading, setLoading] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [checkingFirstOrder, setCheckingFirstOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSettings = location.state?.fromSettings;
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const qty = Number(item.qty) || 1;
    return sum + (itemPrice * qty);
  }, 0);

  const discount = isFirstOrder ? subtotal * 0.2 : 0;
  const finalTotal = (subtotal - discount) + DELIVERY_CHARGE;

  useEffect(() => {
    const checkFirstOrder = async () => {
      if (user) {
        setCheckingFirstOrder(true);
        try {
          const response = await API.get(`/orders/user/${user._id}`);
          setIsFirstOrder(response.data.length === 0);
        } catch (err) {
          console.error("Failed to check first order status");
        } finally {
          setCheckingFirstOrder(false);
        }
      }
    };
    checkFirstOrder();
  }, [user]);

  const handlePlaceOrder = async () => {
    console.log("Current user object:", user);
    console.log("Delivery address from user:", user?.deliveryAddress);
    
    const deliveryAddress = user?.deliveryAddress;
    if (!deliveryAddress?.address || !deliveryAddress?.city || !deliveryAddress?.phone) {
      toast.error("Please enter delivery address");
      navigate("/delivery-address");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        customerName: user.name || user.displayName,
        items: cartItems.map((item) => {
          const price = Number(item.price) || 0;
          const qty = Number(item.qty) || 1;
          return {
            id: item.id,
            name: item.name,
            price: price,
            qty: qty,
            quantity: qty, // send both for compatibility
            image: item.image,
            selectedSize: item.selectedSize,
            selectedFlavor: item.selectedFlavor,
            selectedToppings: item.selectedToppings
          };
        }),
        totalPrice: Number(subtotal), // Send subtotal to backend (discount and delivery calculated there)
        address: `${deliveryAddress.address}, ${deliveryAddress.city} - ${deliveryAddress.phone}`,
        paymentMethod: "Cash on Delivery",
      };
      
      console.log("Placing order with data:", orderData);
      
      const response = await API.post("/orders", orderData);
      console.log("Order response:", response.data);

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error(err.response?.data?.msg || "Failed to place order");
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
          Payment Methods
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg p-5 border border-primary-500 dark:border-primary-500 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center text-2xl">
            <FiDollarSign className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-bold text-warmGray-900 dark:text-white text-lg">
              Cash on Delivery
            </h3>
            <p className="text-warmGray-600 dark:text-warmGray-400 text-sm">
              Pay when you receive your order
            </p>
          </div>
        </div>
      </motion.div>

      {!fromSettings && (
        <>
          <div className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg p-5 border border-warmGray-200 dark:border-warmGray-800 mb-6">
            {isFirstOrder && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 rounded-xl p-3 mb-4"
          >
            <p className="text-green-700 dark:text-green-300 font-semibold text-sm flex items-center gap-2">
              🎉 Congratulations! You get 20% off on your first order!
            </p>
          </motion.div>
        )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-warmGray-600 dark:text-warmGray-400">
                  Subtotal
                </span>
                <span className="text-warmGray-800 dark:text-warmGray-200">
                  Rs. {subtotal}
                </span>
              </div>
              
              {isFirstOrder && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-green-600 dark:text-green-400"
                >
                  <span>Discount (20%)</span>
                  <span>- Rs. {discount.toFixed(0)}</span>
                </motion.div>
              )}
              
              <div className="flex justify-between items-center text-warmGray-700 dark:text-warmGray-400">
                <span>Delivery Charge</span>
                <span>Rs. {DELIVERY_CHARGE}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-warmGray-200 dark:border-warmGray-700">
                <span className="text-warmGray-700 dark:text-warmGray-400 text-lg font-semibold">
                  Total Amount
                </span>
                <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                  Rs. {finalTotal.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </>
      )}
    </div>
  );
}
