import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  phone: { type: String, default: "" }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  firebaseUid: String, // Store Firebase UID
  role: {
    type: String,
    default: "user" // user or admin
  },
  theme: {
    type: String,
    default: "light" // light or dark
  },
  deliveryAddress: {
    type: addressSchema,
    default: () => ({ address: "", city: "", phone: "" })
  }
});

export default mongoose.model("User", userSchema);