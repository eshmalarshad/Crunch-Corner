import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { addToCart } from "../redux/cartSlice";
import API from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Menu() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    fetchFoodsAndCategories();
  }, []);

  const fetchFoodsAndCategories = async () => {
    try {
      const [foodResponse, categoryResponse] = await Promise.all([
        API.get("/foods"),
        API.get("/categories")
      ]);
      let availableFoods = foodResponse.data.filter(food => food.available);
      // Convert all price fields to numbers for every food
      availableFoods = availableFoods.map(food => {
        const updatedFood = { ...food };
        updatedFood.price = Number(updatedFood.price);
        if (updatedFood.sizes) {
          updatedFood.sizes = updatedFood.sizes.map(size => ({
            ...size,
            price: Number(size.price)
          }));
        }
        if (updatedFood.extraToppings) {
          updatedFood.extraToppings = updatedFood.extraToppings.map(topping => ({
            ...topping,
            price: Number(topping.price)
          }));
        }
        return updatedFood;
      });
      setFoods(availableFoods);
      setCategories(categoryResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch menu");
    }
  };

  const handleAddToCart = (food) => {
    dispatch(addToCart({ ...food, id: food._id }));
  };

  // Function to get filtered data considering search
  const getFilteredMenuData = () => {
    let filtered = foods;

    if (selectedCategory) {
      filtered = filtered.filter(food => food.category?._id === selectedCategory);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchLower)
      );
    }

    // Group by category
    const grouped = {};
    filtered.forEach(food => {
      const catId = food.category?._id || "Uncategorized";
      if (!grouped[catId]) {
        grouped[catId] = {
          id: catId,
          name: food.category?.name || "Uncategorized",
          items: []
        };
      }
      grouped[catId].items.push(food);
    });

    return Object.values(grouped);
  };

  // Function to get display price for menu items
  const getDisplayPrice = (food) => {
    if (food.sizes && food.sizes.length > 0) {
      // If there are sizes, the first size's price is the base price for that size
      return food.sizes[0].price;
    }
    return food.price;
  };

  const filteredMenuData = getFilteredMenuData();

  return (
    <div className="p-4 pb-20">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        {user?.role === "admin" ? (
          <>
            <h2 className="text-warmGray-600 dark:text-warmGray-400 text-sm font-medium">
              Admin View
            </h2>
            <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white mt-1">
              User Menu
            </h1>
          </>
        ) : (
          <>
            <h2 className="text-warmGray-600 dark:text-warmGray-400 text-sm font-medium">
              Hey {user?.name}
            </h2>
            <h1 className="text-3xl font-extrabold text-warmGray-900 dark:text-white mt-1">
              Ready to order delicious food?
            </h1>
          </>
        )}
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warmGray-500 dark:text-warmGray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search food items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-warmGray-900 border-2 border-warmGray-200 dark:border-warmGray-800 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-warmGray-900 dark:text-white transition-all duration-200 shadow-sm"
          />
        </div>
      </motion.div>

      {/* PROMO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-xl"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">20% OFF On First Order</h3>
            <p className="opacity-90 text-sm">Try our new delicious dish today!</p>
          </div>
          <div className="w-28 h-24 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-5xl">🍕</span>
          </div>
        </div>
      </motion.div>

      {/* CATEGORIES WITH PICTURES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-lg font-bold text-warmGray-900 dark:text-white mb-3">
          Categories
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* All button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 min-w-[100px] ${
              selectedCategory === null
                ? "bg-primary-500 text-white shadow-md"
                : "bg-white dark:bg-warmGray-900 border border-warmGray-200 dark:border-warmGray-800"
            }`}
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-warmGray-800 rounded-full flex items-center justify-center text-2xl">
              🍽️
            </div>
            <span className="font-semibold text-sm">All</span>
          </motion.button>
          {/* Category buttons */}
          {categories.map((cat) => (
            <motion.button
              key={cat._id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 min-w-[100px] ${
                selectedCategory === cat._id
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white dark:bg-warmGray-900 border border-warmGray-200 dark:border-warmGray-800"
              }`}
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-warmGray-800 rounded-full flex items-center justify-center text-2xl">
                🍴
              </div>
              <span className="font-semibold text-sm">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* MENU ITEMS GROUPED BY CATEGORY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        {filteredMenuData.map((categoryData, idx) => (
          <div key={categoryData.id}>
            <h3 className="text-xl font-bold text-warmGray-900 dark:text-white mb-4">
              {categoryData.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categoryData.items.map((food) => {
                const displayPrice = getDisplayPrice(food);
                return (
                  <motion.div
                    key={food._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg overflow-hidden border border-warmGray-100 dark:border-warmGray-800 cursor-pointer"
                    onClick={() => navigate(`/food/${food._id}`)}
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-bold text-base text-warmGray-900 dark:text-white mb-1">
                        {food.name}
                      </h4>
                      {food.sizes && food.sizes.length > 0 && (
                        <span className="text-xs text-warmGray-500 mb-1 block">
                          Starting from
                        </span>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                          Rs. {displayPrice}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}