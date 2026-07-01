
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@crunchandcheese.com",
      password: adminPassword,
      role: "admin"
    });

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      name: "John Doe",
      email: "user@crunchandcheese.com",
      password: userPassword,
      role: "user"
    });

    console.log("\n✅ Seeded successfully!");
    console.log("\n📝 Admin Credentials:");
    console.log("Email: admin@crunchandcheese.com");
    console.log("Password: admin123");
    console.log("\n📝 User Credentials:");
    console.log("Email: user@crunchandcheese.com");
    console.log("Password: user123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
