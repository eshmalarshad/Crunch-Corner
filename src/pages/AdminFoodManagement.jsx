import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiPlusCircle, FiMinusCircle, FiUser } from "react-icons/fi";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function AdminFoodManagement() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [originalBasePrice, setOriginalBasePrice] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
    isDeal: false,
    sizes: [],
    flavors: [],
    extraToppings: [],
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchFoods(), fetchCategories()]);
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods");
      setFoods(res.data);
    } catch (err) {
      console.error("Error loading foods:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to load foods");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to load categories");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
        sizes: formData.sizes.map(size => ({
          ...size,
          price: size.price === "" ? 0 : Number(size.price)
        })),
        extraToppings: formData.extraToppings.map(topping => ({
          ...topping,
          price: topping.price === "" ? 0 : Number(topping.price)
        })),
      };

      if (editingFood) {
        await API.put(`/foods/${editingFood._id}`, dataToSend);
        toast.success("Food updated successfully");
      } else {
        await API.post("/foods", dataToSend);
        toast.success("Food added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchFoods();
    } catch (err) {
      console.error("Error saving food:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Failed to save food");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      try {
        await API.delete(`/foods/${id}`);
        toast.success("Food deleted successfully");
        fetchFoods();
      } catch (err) {
        toast.error("Failed to delete food");
      }
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    const hasSizes = food.sizes && food.sizes.length > 0;
    setOriginalBasePrice(hasSizes ? "" : food.price);
    setFormData({
      name: food.name,
      description: food.description,
      price: hasSizes ? "" : food.price,
      category: food.category?._id || food.category,
      image: food.image,
      available: food.available,
      isDeal: food.isDeal || false,
      sizes: (food.sizes || []).map(size => ({
        ...size,
        price: size.price.toString()
      })),
      flavors: food.flavors || [],
      extraToppings: (food.extraToppings || []).map(topping => ({
        ...topping,
        price: topping.price.toString()
      })),
    });
    setImagePreview(food.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setOriginalBasePrice("");
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      available: true,
      isDeal: false,
      sizes: [],
      flavors: [],
      extraToppings: [],
    });
    setImagePreview("");
    setEditingFood(null);
  };

  const addSize = () => {
    setFormData(prev => {
      // Store current base price as original before adding first size
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
    setFormData(prev => {
      const newSizes = prev.sizes.filter((_, idx) => idx !== index);
      const newPrice = newSizes.length === 0 ? originalBasePrice : prev.price;
      return { ...prev, sizes: newSizes, price: newPrice };
    });
  };

  const updateSize = (index, field, value) => {
    setFormData(prev => {
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
    setFormData(prev => ({
      ...prev,
      flavors: [...prev.flavors, ""],
    }));
  };

  const removeFlavor = (index) => {
    setFormData(prev => {
      const newFlavors = prev.flavors.filter((_, idx) => idx !== index);
      return { ...prev, flavors: newFlavors };
    });
  };

  const updateFlavor = (index, value) => {
    setFormData(prev => {
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
    setFormData(prev => ({
      ...prev,
      extraToppings: [...prev.extraToppings, { name: "", price: "" }],
    }));
  };

  const removeTopping = (index) => {
    setFormData(prev => {
      const newToppings = prev.extraToppings.filter((_, idx) => idx !== index);
      return { ...prev, extraToppings: newToppings };
    });
  };

  const updateTopping = (index, field, value) => {
    setFormData(prev => {
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
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-warmGray-900 dark:text-white">
              Food Management
            </h1>
          </div>
          <Link
            to="/admin/profile"
            className="p-2 rounded-full bg-primary-100 dark:bg-warmGray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-warmGray-700 transition-all duration-200"
          >
            <FiUser className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Foods Grouped by Category */}
        <div className="space-y-5">
          {categories.map((category, catIndex) => {
            const categoryFoods = foods.filter(
              (food) => food.category?._id === category._id || food.category === category._id
            );

            if (categoryFoods.length === 0) return null;

            return (
              <div key={category._id}>
                <h2 className="text-lg md:text-xl font-bold text-warmGray-900 dark:text-white mb-3">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryFoods.map((food, index) => (
                    <motion.div
                      key={food._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                      className="bg-white dark:bg-warmGray-900 rounded-xl p-3 md:p-4 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
                    >
                      <img
                        src={food.image || "https://via.placeholder.com/150"}
                        alt={food.name}
                        className="w-full h-28 md:h-32 object-cover rounded-lg mb-2 md:mb-3"
                      />
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-warmGray-900 dark:text-white">
                          {food.name}
                        </h3>
                        <div className="flex gap-1">
                          {food.isDeal && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-600">
                              Deal
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                              food.available
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {food.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                      <p className="text-warmGray-600 dark:text-warmGray-400 text-xs mb-2 line-clamp-1">
                        {food.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {food.sizes && food.sizes.length > 0 ? (
                          food.sizes.map((size, idx) => (
                            <span
                              key={idx}
                              className="text-primary-600 dark:text-primary-400 font-semibold text-xs bg-primary-50 dark:bg-warmGray-800 px-1.5 py-0.5 rounded"
                            >
                              {size.name}: Rs. {size.price}
                            </span>
                          ))
                        ) : (
                          <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                            Rs. {food.price}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(food)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Ungrouped Foods (No Category) */}
          {(() => {
            const ungroupedFoods = foods.filter(
              (food) => !food.category || !food.category._id
            );
            if (ungroupedFoods.length === 0) return null;
            return (
              <div>
                <h2 className="text-lg md:text-xl font-bold text-warmGray-900 dark:text-white mb-3">
                  Ungrouped
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ungroupedFoods.map((food, index) => (
                    <motion.div
                      key={food._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-warmGray-900 rounded-xl p-3 md:p-4 shadow-lg border border-warmGray-100 dark:border-warmGray-800"
                    >
                      <img
                        src={food.image || "https://via.placeholder.com/150"}
                        alt={food.name}
                        className="w-full h-28 md:h-32 object-cover rounded-lg mb-2 md:mb-3"
                      />
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-warmGray-900 dark:text-white">
                          {food.name}
                        </h3>
                        <div className="flex gap-1">
                          {food.isDeal && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-600">
                              Deal
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                              food.available
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {food.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                      <p className="text-warmGray-600 dark:text-warmGray-400 text-xs mb-2 line-clamp-1">
                        {food.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {food.sizes && food.sizes.length > 0 ? (
                          food.sizes.map((size, idx) => (
                            <span
                              key={idx}
                              className="text-primary-600 dark:text-primary-400 font-semibold text-xs bg-primary-50 dark:bg-warmGray-800 px-1.5 py-0.5 rounded"
                            >
                              {size.name}: Rs. {size.price}
                            </span>
                          ))
                        ) : (
                          <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                            Rs. {food.price}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(food)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-3 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-warmGray-900 rounded-xl p-3 sm:p-4 w-full max-w-md sm:max-w-lg my-2 sm:my-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6">
                {editingFood ? "Edit Food" : "Add Food"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, name: e.target.value }))
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
                    value={formData.description}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, description: e.target.value }))
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
                    value={formData.price}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setFormData(prev => ({ ...prev, price: newPrice }));
                      if (formData.sizes.length === 0) {
                        setOriginalBasePrice(newPrice);
                      }
                    }}
                    disabled={formData.sizes.length > 0}
                    className={`w-full p-2 border rounded-lg focus:outline-none text-sm ${
                      formData.sizes.length > 0
                        ? "bg-warmGray-100 dark:bg-warmGray-800 border-warmGray-300 dark:border-warmGray-700 text-warmGray-500 dark:text-warmGray-500 cursor-not-allowed"
                        : "bg-primary-50 dark:bg-warmGray-800 border-warmGray-200 dark:border-warmGray-700 text-warmGray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500"
                    }`}
                    required
                  />
                  {formData.sizes.length > 0 && (
                    <p className="text-xs text-warmGray-500 mt-1">
                      Base price is disabled because sizes are added
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-warmGray-600 dark:text-warmGray-400 mb-1 text-xs font-semibold">
                    Food Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 bg-primary-50 dark:bg-warmGray-800 border border-warmGray-200 dark:border-warmGray-700 rounded-lg focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 text-warmGray-900 dark:text-white text-sm"
                    required={!editingFood}
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
                  {formData.sizes.map((size, index) => (
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
                  {formData.flavors.map((flavor, index) => (
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
                  {formData.extraToppings.map((topping, index) => (
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
                          placeholder="0"
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
                    id="available"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, available: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="available"
                    className="text-warmGray-600 dark:text-warmGray-400 text-sm"
                  >
                    Available
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDeal"
                    checked={formData.isDeal}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, isDeal: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="isDeal"
                    className="text-warmGray-600 dark:text-warmGray-400 text-sm"
                  >
                    Mark as Deal
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-warmGray-200 dark:bg-warmGray-700 text-warmGray-900 dark:text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 text-sm"
                  >
                    {loading ? "Saving..." : "Save"}
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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary-500 hover:bg-primary-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-200 z-40"
      >
        <FiPlus className="w-6 sm:w-8 h-6 sm:h-8" />
      </motion.button>
    </div>
  );
}
