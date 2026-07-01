import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const users = await User.find({});
    console.log("\n📊 All Users in DB:");
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log("  Email:", user.email);
      console.log("  Role:", user.role);
      console.log("  Name:", user.name);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error checking users:", err);
    process.exit(1);
  }
};

checkUsers();