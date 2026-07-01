import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

export default function FoodCard({ food, onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-warmGray-900 rounded-2xl shadow-lg overflow-hidden border border-warmGray-100 dark:border-warmGray-800 flex gap-4 p-4"
    >
      <img
        src={food.image}
        alt={food.name}
        className="w-28 h-28 rounded-xl object-cover shadow-md"
      />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-warmGray-900 dark:text-white">
            {food.name}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
            ${food.price.toFixed(2)}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 shadow-md"
        >
          <FiShoppingCart />
          Add
        </motion.button>
      </div>
    </motion.div>
  );
}