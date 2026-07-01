
import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config();

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Clear existing foods
    await Food.deleteMany({});
    console.log("Cleared existing foods");

    // Create sample food items
    const foods = await Food.create([
      {
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with melted cheddar, lettuce, tomato, onion, and special sauce on a brioche bun",
        price: 299,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        available: true
      },
      {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, basil leaves, tomato sauce, and a drizzle of olive oil",
        price: 449,
        category: "Pizzas",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
        available: true
      },
      {
        name: "Chicken Wrap",
        description: "Grilled chicken, fresh veggies, and tzatziki sauce wrapped in a soft tortilla",
        price: 199,
        category: "Wraps",
        image: "https://images.unsplash.com/photo-1626700052529-91596727e269?w=400&q=80",
        available: true
      },
      {
        name: "French Fries",
        description: "Crispy golden french fries, perfectly seasoned with salt and pepper",
        price: 99,
        category: "Sides",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        available: true
      },
      {
        name: "Coke (500ml)",
        description: "Refreshing Coca-Cola in a 500ml bottle",
        price: 59,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        available: true
      },
      {
        name: "Chicken Wings",
        description: "Spicy buffalo-style chicken wings served with celery sticks",
        price: 349,
        category: "Chicken",
        image: "https://images.unsplash.com/photo-1527477396000-c8874c4732856?w=400&q=80",
        available: true
      }
    ]);

    console.log("\n✅ Seeded", foods.length, "food items successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding foods:", err);
    process.exit(1);
  }
};

seedFoods();
