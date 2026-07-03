import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { increaseQty, decreaseQty, removeItem, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../utils/api";

const DELIVERY_CHARGE = 250;

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => {
  return sum + Number(item.price) * Number(item.qty);
}, 0);

  const discount = isFirstOrder ? subtotal * 0.2 : 0;
  const finalTotal = (subtotal - discount) + DELIVERY_CHARGE;

  useEffect(() => {
    const checkFirstOrder = async () => {
      if (user) {
        setLoading(true);
        try {
          const response = await API.get(`/orders/user/${user._id}`);
          setIsFirstOrder(response.data.length === 0);
        } catch (err) {
          console.error("Failed to check first order status");
        } finally {
          setLoading(false);
        }
      }
    };
    checkFirstOrder();
  }, [user]);

  const handleCheckout = () => {
    navigate("/delivery-address");
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-warmGray-600 dark:text-warmGray-400 mb-8">
            Add some delicious food to your cart!
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/menu")}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg"
          >
            Browse Menu
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-40 md:px-0">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-warmGray-900 dark:text-white">
          Your Cart
        </h1>
      </motion.div>

      {/* CART ITEMS */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg p-4 md:p-6 border border-warmGray-100 dark:border-warmGray-800"
          >
            <div className="flex gap-4 md:gap-6">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-md"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-warmGray-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  
                  {/* Customization Details */}
                  <div className="text-sm text-warmGray-600 dark:text-warmGray-400 mb-2 space-y-1">
                    {item.selectedSize && (
                      <p><span className="font-semibold">Size:</span> {item.selectedSize.name} (Rs. {item.selectedSize.price})</p>
                    )}
                    {item.selectedFlavor && (
                      <p><span className="font-semibold">Flavor:</span> {item.selectedFlavor}</p>
                    )}
                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                      <p>
                        <span className="font-semibold">Extras:</span>{" "}
                        {item.selectedToppings.map(t => `${t.name} (+Rs. ${t.price})`).join(", ")}
                      </p>
                    )}
                  </div>

                  <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg md:text-xl">
                    Rs. {Number(item.price) * Number(item.qty)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-primary-100 dark:bg-warmGray-800 rounded-full p-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-warmGray-900 rounded-full text-warmGray-700 dark:text-white shadow-sm"
                    >
                      <FiMinus size={18} className="md:w-5 md:h-5" />
                    </motion.button>
                    <span className="font-bold text-xl md:text-2xl text-warmGray-900 dark:text-white w-10 md:w-12 text-center">
                      {item.qty}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary-500 text-white rounded-full shadow-sm"
                    >
                      <FiPlus size={18} className="md:w-5 md:h-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-warmGray-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <FiTrash2 size={24} className="md:w-7 md:h-7" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHECKOUT */}
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-auto md:relative md:bottom-auto bg-white dark:bg-warmGray-900 rounded-2xl shadow-xl border border-warmGray-100 dark:border-warmGray-800 p-5 md:p-7">
        {isFirstOrder && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 rounded-xl p-3 md:p-4 mb-4"
          >
            <p className="text-green-700 dark:text-green-300 font-semibold text-sm md:text-base flex items-center gap-2">
              🎉 Congratulations! You get 20% off on your first order!
            </p>
          </motion.div>
        )}
        
        <div className="space-y-2 mb-4 md:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-warmGray-600 dark:text-warmGray-400 text-base md:text-lg">
              Subtotal
            </span>
            <span className="text-warmGray-800 dark:text-warmGray-200 text-lg md:text-xl">
              Rs. {subtotal}
            </span>
          </div>
          
          {isFirstOrder && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center text-green-600 dark:text-green-400"
            >
              <span className="text-base md:text-lg">Discount (20%)</span>
              <span className="text-lg md:text-xl">- Rs. {discount.toFixed(0)}</span>
            </motion.div>
          )}
          
          <div className="flex justify-between items-center text-warmGray-700 dark:text-warmGray-400">
            <span className="text-base md:text-lg">Delivery Charge</span>
            <span className="text-lg md:text-xl">Rs. {DELIVERY_CHARGE}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-warmGray-200 dark:border-warmGray-700">
            <span className="text-warmGray-700 dark:text-warmGray-400 text-xl md:text-2xl font-semibold">
              Total
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-primary-600 dark:text-primary-400">
              Rs. {finalTotal.toFixed(0)}
            </span>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCheckout}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 md:py-5 rounded-xl shadow-lg transition-all duration-200 text-lg md:text-xl"
        >
          Place Order
        </motion.button>
      </div>
    </div>
  );
}
