import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: String,
  customerName: String,
  items: Array,
  subtotal: Number, // Before discount and delivery charges
  discount: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: 250 // Fixed delivery charge
  },
  totalPrice: Number, // Final total (subtotal - discount + delivery charge)
  originalTotalPrice: Number,
  isFirstOrder: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Pending"
  },
  address: String,
  orderTime: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    default: "COD"
  }
});

export default mongoose.model("Order", orderSchema);