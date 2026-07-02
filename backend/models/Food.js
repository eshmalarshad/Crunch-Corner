import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: String,
  available: {
    type: Boolean,
    default: true
  },
  isDeal: {
    type: Boolean,
    default: false
  },
  sizes: [{
    name: String,
    price: Number,
  }],
  flavors: [String],
  extraToppings: [{
    name: String,
    price: Number,
  }],
});

export default mongoose.model("Food", foodSchema);
