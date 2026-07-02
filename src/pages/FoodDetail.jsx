import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      const response = await API.get(`/foods/${id}`);
      let foodData = response.data;
      // Convert all price fields to numbers
      foodData.price = Number(foodData.price);
      if (foodData.sizes) {
        foodData.sizes = foodData.sizes.map(size => ({
          ...size,
          price: Number(size.price)
        }));
      }
      if (foodData.extraToppings) {
        foodData.extraToppings = foodData.extraToppings.map(topping => ({
          ...topping,
          price: Number(topping.price)
        }));
      }

      if (!foodData.available) {
        toast.error("This item is currently unavailable");
        navigate("/menu");
        return;
      }
      setFood(foodData);
      // Set default size if available
      if (foodData.sizes && foodData.sizes.length > 0) {
        setSelectedSize(foodData.sizes[0]);
      }
      // Set default flavor if available
      if (foodData.flavors && foodData.flavors.length > 0) {
        setSelectedFlavor(foodData.flavors[0]);
      }
    } catch (err) {
      toast.error("Failed to fetch food details");
    } finally {
      setLoading(false);
    }
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev =>
      prev.some(t => t.name === topping.name)
        ? prev.filter(t => t.name !== topping.name)
        : [...prev, topping]
    );
  };

  const calculateItemPrice = () => {
    let total = 0;

    if (food.sizes && food.sizes.length > 0 && selectedSize) {
      total = Number(selectedSize.price);
    } else {
      total = Number(food.price);
    }

    selectedToppings.forEach((topping) => {
      total += Number(topping.price);
    });

    return total;
  };

 const handleAddToCart = () => {
  const cartItem = {
    ...food,
    id: food._id,
    qty: quantity,
    selectedSize,
    selectedFlavor,
    selectedToppings,
    price: calculateItemPrice(),
  };

  dispatch(addToCart(cartItem));

  toast.success("Added to cart!");
  navigate("/menu");
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white">
          Loading...
        </h2>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white mb-2">
            Food not found
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950 pb-32">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-primary-50/80 dark:bg-warmGray-950/80 backdrop-blur-sm p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 bg-white dark:bg-warmGray-900 rounded-full shadow-md"
        >
          <FiArrowLeft className="text-warmGray-900 dark:text-white w-6 h-6" />
        </motion.button>
      </div>

      {/* Food Image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mb-6"
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-72 object-cover"
          />
        </div>
      </motion.div>

      {/* Food Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 mb-6"
      >
        <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white mb-2">
          {food.name}
        </h1>
        <p className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-4">
          {food.sizes && food.sizes.length > 0 ? (
            <>
              Starting from Rs. {food.sizes[0].price}
            </>
          ) : (
            <>Rs. {food.price}</>
          )}
        </p>
        <p className="text-warmGray-600 dark:text-warmGray-400 leading-relaxed">
          {food.description}
        </p>
      </motion.div>

      {/* Size Selector */}
      {food.sizes && food.sizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mb-6"
        >
          <h2 className="text-xl font-bold text-warmGray-900 dark:text-white mb-4">
            Size <span className="text-red-500 text-sm font-normal">(Required)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {food.sizes.map((size, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(size)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${selectedSize?.name === size.name
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900"
                  }`}
              >
                <span className="block font-bold text-warmGray-900 dark:text-white">
                  {size.name}
                </span>
                <span className="block text-primary-600 dark:text-primary-400 text-sm font-semibold">
                  Rs. {size.price}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Flavor Selector */}
      {food.flavors && food.flavors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="px-4 mb-6"
        >
          <h2 className="text-xl font-bold text-warmGray-900 dark:text-white mb-4">
            Flavor <span className="text-red-500 text-sm font-normal">(Required)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {food.flavors.map((flavor, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFlavor(flavor)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${selectedFlavor === flavor
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900"
                  }`}
              >
                <span className="block font-bold text-warmGray-900 dark:text-white">
                  {flavor}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Extra Toppings Selector */}
      {food.extraToppings && food.extraToppings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 mb-6"
        >
          <h2 className="text-xl font-bold text-warmGray-900 dark:text-white mb-4">
            Extra Toppings <span className="text-warmGray-500 text-sm font-normal">(Optional)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {food.extraToppings.map((topping, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopping(topping)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${selectedToppings.some(t => t.name === topping.name)
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900"
                  }`}
              >
                <span className="block font-bold text-warmGray-900 dark:text-white">
                  {topping.name}
                </span>
                <span className="block text-primary-600 dark:text-primary-400 text-sm font-semibold">
                  +Rs. {topping.price}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quantity Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="px-4 mb-8"
      >
        <h2 className="text-xl font-bold text-warmGray-900 dark:text-white mb-4">
          Quantity
        </h2>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="w-12 h-12 bg-primary-100 dark:bg-warmGray-800 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-md"
          >
            <FiMinus className="w-5 h-5" />
          </motion.button>
          <span className="text-2xl font-bold text-warmGray-900 dark:text-white w-12 text-center">
            {quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(prev => prev + 1)}
            className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md"
          >
            <FiPlus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Add to Cart Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-warmGray-900 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <FiShoppingCart className="w-6 h-6" />
          Add to Cart - Rs. {calculateItemPrice() * quantity}
        </motion.button>
      </motion.div>
    </div>
  );
}
