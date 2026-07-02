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
      if (foodData.sizes && foodData.sizes.length > 0) {
        setSelectedSize(foodData.sizes[0]);
      }
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
    const perItemPrice = calculateItemPrice();
    const cartItem = {
      id: food._id,
      name: food.name,
      description: food.description,
      image: food.image,
      category: food.category,
      qty: quantity,
      selectedSize,
      selectedFlavor,
      selectedToppings,
      price: perItemPrice,
    };
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
    navigate("/menu");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-primary-50 dark:bg-warmGray-950">
        <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white">
          Loading...
        </h2>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-primary-50 dark:bg-warmGray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-warmGray-900 dark:text-white mb-2">
            Food not found
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/menu")}
            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary-50 dark:bg-warmGray-950 border-b border-warmGray-200 dark:border-warmGray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-white dark:bg-warmGray-900 shadow-md"
          >
            <FiArrowLeft className="w-6 h-6 text-warmGray-900 dark:text-white" />
          </motion.button>
          <h1 className="text-xl font-bold text-warmGray-900 dark:text-white truncate">
            {food.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={food.image} alt={food.name} className="w-full h-64 md:h-96 object-cover" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-warmGray-900 dark:text-white">
                {food.name}
              </h1>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {food.sizes && food.sizes.length > 0 ? (
                  <>Starting from Rs. {food.sizes[0].price}</>
                ) : (
                  <>Rs. {food.price}</>
                )}
              </p>
              <p className="text-lg text-warmGray-600 dark:text-warmGray-400 leading-relaxed">
                {food.description}
              </p>
            </div>
          </motion.div>

          {/* Right Column: Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Size Selector */}
            {food.sizes && food.sizes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-warmGray-900 dark:text-white flex items-center gap-2">
                  Size <span className="text-red-500 text-sm font-normal">(Required)</span>
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {food.sizes.map((size, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedSize?.name === size.name
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                          : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900 hover:border-primary-300"
                      }`}
                    >
                      <span className="block font-bold text-base text-warmGray-900 dark:text-white">
                        {size.name}
                      </span>
                      <span className="block text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        Rs. {size.price}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavor Selector */}
            {food.flavors && food.flavors.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-warmGray-900 dark:text-white flex items-center gap-2">
                  Flavor <span className="text-red-500 text-sm font-normal">(Required)</span>
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {food.flavors.map((flavor, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedFlavor === flavor
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                          : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900 hover:border-primary-300"
                      }`}
                    >
                      <span className="block font-bold text-base text-warmGray-900 dark:text-white">
                        {flavor}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Toppings Selector */}
            {food.extraToppings && food.extraToppings.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-warmGray-900 dark:text-white flex items-center gap-2">
                  Extra Toppings <span className="text-warmGray-500 text-sm font-normal">(Optional)</span>
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {food.extraToppings.map((topping, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTopping(topping)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedToppings.some(t => t.name === topping.name)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                          : "border-warmGray-200 dark:border-warmGray-700 bg-white dark:bg-warmGray-900 hover:border-primary-300"
                      }`}
                    >
                      <span className="block font-bold text-base text-warmGray-900 dark:text-white">
                        {topping.name}
                      </span>
                      <span className="block text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        +Rs. {topping.price}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-warmGray-900 dark:text-white">
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
            </div>

            {/* Add to Cart */}
            <div className="bg-white dark:bg-warmGray-900 rounded-2xl p-5 shadow-lg border border-warmGray-200 dark:border-warmGray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-warmGray-600 dark:text-warmGray-400 font-semibold">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  Rs. {calculateItemPrice() * quantity}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3"
              >
                <FiShoppingCart className="w-6 h-6" />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
