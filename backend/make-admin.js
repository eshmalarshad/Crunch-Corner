import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Admin credentials - CHANGE THESE TO YOUR OWN GMAIL!
    const adminEmail = "adminfooddelivery@gmail.com";
    const adminName = "Admin";

    // Check if admin already exists
    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      // If exists, just make sure role is admin
      user = await User.findByIdAndUpdate(
        user._id,
        { role: "admin" },
        { returnDocument: "after" }
      );
      console.log("\n✅ Existing user updated to admin!");
    } else {
      // Create new admin user in MongoDB
      user = await User.create({
        name: adminName,
        email: adminEmail,
        role: "admin"
      });
      console.log("\n✅ Admin user created in MongoDB!");
    }

    console.log("\n📝 Admin Credentials:");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password: Use your Firebase password when you register/login!");
    console.log("\n📋 Steps:");
    console.log("1. Register/login in the app with this Gmail using Firebase");
    console.log("2. You will have admin access!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();