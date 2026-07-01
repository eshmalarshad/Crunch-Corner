import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiPlusCircle, FiMinusCircle, FiUser } from "react-icons/fi";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function AdminCategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryForFood, setSelectedCategoryForFood] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [foodFormData, setFoodFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
    sizes: [],
    flavors: [],
    extraToppings: [],
  });
  const [originalBasePrice, setOriginalBasePrice] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [foodLoading, setFoodLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, formData);
        toast.success("Category updated successfully");
      } else {
        await API.post("/categories", formData);
        toast.success("Category created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await API.delete(`/categories/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete category");
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingCategory(null);
  };

  const handleAddFood = (category) => {
    setSelectedCategoryForFood(category);
    setFoodFormData({
      name: "",
      description: "",
      price: "",
      category: category._id,
      image: "",
      available: true,
      sizes: [],
      flavors: [],
      extraToppings: [],
    });
    setOriginalBasePrice("");
    setImagePreview("");
    setShowFoodModal(true);
  };

  const handleFoodImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    setFoodLoading(true);
    try {
      const dataToSend = {
        ...foodFormData,
        price: foodFormData.price === "" ? 0 : Number(foodFormData.price),
        sizes: foodFormData.sizes.map(size => ({
          ...size,
          price: size.price === "" ? 0 : Number(size.price)
        })),
        extraToppings: foodFormData.extraToppings.map(topping => ({
          ...topping,
          price: topping.price === "" ? 0 : Number(topping.price)
        })),
      };

      await API.post("/foods", dataToSend);
      toast.success("Food added successfully");
      setShowFoodModal(false);
      resetFoodForm();
    } catch (err) {
      console.error("Error saving food:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to save food");
    } finally {
      setFoodLoading(false);
    }
  };

  const resetFoodForm = () => {
    setOriginalBasePrice("");
    setFoodFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      available: true,
      sizes: [],
      flavors: [],
      extraToppings: [],
    });
    setImagePreview("");
    setSelectedCategoryForFood(null);
  };

  const addSize = () => {
    setFoodFormData(prev => {
      if (prev.sizes.length === 0 && prev.price) {
        setOriginalBasePrice(prev.price);
      }
      return {
        ...prev,
        sizes: [...prev.sizes, { name: "", price: "" }],
        price: "",
      };
    });
  };

  const removeSize = (index) => {
    setFoodFormData(prev => {
      const newSizes = prev.sizes.filter((_, idx) => idx !== index);
      const newPrice = newSizes.length === 0 ? originalBasePrice : prev.price;
      return { ...prev, sizes: newSizes, price: newPrice };
    });
  };

  const updateSize = (index, field, value) => {
    setFoodFormData(prev => {
      const newSizes = prev.sizes.map((size, idx) => {
        if (idx === index) {
          return { ...size, [field]: value };
        }
        return size;
      });
      return { ...prev, sizes: newSizes };
    });
  };

  const addFlavor = () => {
    setFoodFormData(prev => ({
      ...prev,
      flavors: [...prev.flavors, ""],
    }));
  };

  const removeFlavor = (index) => {
    setFoodFormData(prev => {
      const newFlavors = prev.flavors.filter((_, idx) => idx !== index);
      return { ...prev, flavors: newFlavors };
    });
  };

  const updateFlavor = (index, value) => {
    setFoodFormData(prev => {
      const newFlavors = prev.flavors.map((flavor, idx) => {
        if (idx === index) {
          return value;
        }
        return flavor;
      });
      return { ...prev, flavors: newFlavors };
    });
  };

  const addTopping = () => {
    setFoodFormData(prev => ({
      ...prev,
      extraToppings: [...prev.extraToppings, { name: "", price: "" }],
    }));
  };

  const removeTopping = (index) => {
    setFoodFormData(prev => {
      const newToppings = prev.extraToppings.filter((_, idx) => idx !== index);
      return { ...prev, extraToppings: newToppings };
    });
  };

  const updateTopping = (index, field, value) => {
    setFoodFormData(prev => {
      const newToppings = prev.extraToppings.map((topping, idx) => {
        if (idx === index) {
          return { ...topping, [field]: value };
        }
        return topping;
      });
      return { ...prev, extraToppings: newToppings };
    });
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              Category Management
            </h1>
          </div>
          <Link
            to="/admin/profile"
            className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
          >
            <FiUser className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-warmGray-900 rounded-xl p-6 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-warmGray-900 dark:text-white">
                  {category.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddFood(category)}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                    title="Add Food"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleAddFood(category)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
              >
                Add Food Item
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-warmGray-900 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-6">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-sm font-semibold">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-warmGray-200 dark:bg-warmGray-700 text-warmGray-900 dark:text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Food Modal */}
        {showFoodModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-3 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-warmGray-900 rounded-xl p-3 sm:p-4 w-full max-w-md sm:max-w-lg my-2 sm:my-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6">
                Add Food to {selectedCategoryForFood?.name}
              </h2>
              <form onSubmit={handleFoodSubmit} className="space-y-3">
                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    value={foodFormData.name}
                    onChange={(e) =>
                      setFoodFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Description
                  </label>
                  <textarea
                    value={foodFormData.description}
                    onChange={(e) =>
                      setFoodFormData(prev => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-sm"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Base Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={foodFormData.price}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setFoodFormData(prev => ({ ...prev, price: newPrice }));
                      if (foodFormData.sizes.length === 0) {
                        setOriginalBasePrice(newPrice);
                      }
                    }}
                    disabled={foodFormData.sizes.length > 0}
                    className={`w-full p-2 border rounded-lg focus:outline-none text-sm ${
                      foodFormData.sizes.length > 0
                        ? "bg-warmGray-100 dark:bg-warmGray-800 border-warmGray-300 dark:border-warmGray-700 text-warmGray-500 dark:text-warmGray-500 cursor-not-allowed"
                        : "bg-primary-50 dark:bg-warmGray-800 border-warmGray-200 dark:border-warmGray-700 text-warmGray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500"
                    }`}
                    required
                  />
                  {foodFormData.sizes.length > 0 && (
                    <p className="text-xs text-warmGray-500 mt-1">
                      Base price is disabled because sizes are added
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Food Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFoodImageChange}
                    className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-sm"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-warmGray-600 dark:text-warmGray-400 text-xs font-semibold">
                      Sizes (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addSize}
                      className="text-primary-600 dark:text-primary-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiPlusCircle className="w-3 h-3" /> Add Size
                    </button>
                  </div>
                  {foodFormData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-warmGray-500 dark:text-warmGray-400 mb-1">
                          Size Name
                        </label>
                        <input
                          type="text"
                          value={size.name}
                          onChange={(e) =>
                            updateSize(index, "name", e.target.value)
                          }
                          className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-xs"
                          placeholder="Small, Medium, etc."
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-warmGray-500 dark:text-warmGray-400 mb-1">
                          Price (Rs.)
                        </label>
                        <input
                          type="number"
                          value={size.price}
                          onChange={(e) =>
                            updateSize(index, "price", e.target.value)
                          }
                          className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-xs"
                          placeholder="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <FiMinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-warmGray-600 dark:text-warmGray-400 text-xs font-semibold">
                      Flavors (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addFlavor}
                      className="text-primary-600 dark:text-primary-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiPlusCircle className="w-3 h-3" /> Add Flavor
                    </button>
                  </div>
                  {foodFormData.flavors.map((flavor, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-warmGray-500 dark:text-warmGray-400 mb-1">
                          Flavor Name
                        </label>
                        <input
                          type="text"
                          value={flavor}
                          onChange={(e) =>
                            updateFlavor(index, e.target.value)
                          }
                          className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-xs"
                          placeholder="Margherita, Pepperoni, etc."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFlavor(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <FiMinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-warmGray-600 dark:text-warmGray-400 text-xs font-semibold">
                      Extra Toppings (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addTopping}
                      className="text-primary-600 dark:text-primary-400 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiPlusCircle className="w-3 h-3" /> Add Topping
                    </button>
                  </div>
                  {foodFormData.extraToppings.map((topping, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-warmGray-500 dark:text-warmGray-400 mb-1">
                          Topping Name
                        </label>
                        <input
                          type="text"
                          value={topping.name}
                          onChange={(e) =>
                            updateTopping(index, "name", e.target.value)
                          }
                          className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-xs"
                          placeholder="Cheese, Olives, etc."
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-warmGray-500 dark:text-warmGray-400 mb-1">
                          Extra Price (Rs.)
                        </label>
                        <input
                          type="number"
                          value={topping.price}
                          onChange={(e) =>
                            updateTopping(index, "price", e.target.value)
                          }
                          className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-xs"
                          placeholder="20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTopping(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <FiMinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="foodAvailable"
                    checked={foodFormData.available}
                    onChange={(e) =>
                      setFoodFormData(prev => ({ ...prev, available: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="foodAvailable"
                    className="text-warmGray-600 dark:text-warmGray-400 text-sm"
                  >
                    Available
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFoodModal(false)}
                    className="flex-1 bg-warmGray-200 dark:bg-warmGray-700 text-warmGray-900 dark:text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={foodLoading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 text-sm"
                  >
                    {foodLoading ? "Saving..." : "Save Food"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-40"
      >
        <FiPlus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
