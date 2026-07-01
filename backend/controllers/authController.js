import User from "../models/User.js";
import jwt from "jsonwebtoken";

// New register/login functions that work with Firebase Auth (no password needed for Firebase users)
export const register = async (req, res) => {
  try {
    console.log("=== REGISTER ENDPOINT HIT ===");
    console.log("Request body:", req.body);

    const { name, email, firebaseUid } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    console.log("Existing user found:", user);
    if (user) {
      // Update existing user with new name and firebaseUid, PRESERVE ROLE!
      user = await User.findByIdAndUpdate(
        user._id,
        { name, firebaseUid },
        { returnDocument: 'after' }
      );
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );
      
      // Return updated user
      console.log("Returning updated existing user:", user);
      return res.json({ token, user });
    }

    // Create new user (since it's Firebase auth, no need for password)
    user = await User.create({
      name,
      email,
      firebaseUid, // Store Firebase UID for reference
      role: "user" // Default role for new users
    });

    console.log("New user created:", user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    console.log("=== LOGIN ENDPOINT HIT ===");
    console.log("Request body:", req.body);

    const { email, firebaseUid } = req.body;

    let user = await User.findOne({ email });
    console.log("User found:", user);
    
    if (!user) {
      // If user doesn't exist in MongoDB yet, create them (we can get name from Firebase later)
      console.log("Creating new user...");
      user = await User.create({
        email,
        firebaseUid,
        name: email.split('@')[0], // Default name from email
        role: "user" // Default role for new users
      });
      console.log("New user created:", user);
    } else {
      // Update existing user - preserve the existing role!
      console.log("Updating user...");
      const updateData = { firebaseUid };
      // Don't change role - preserve existing!
      user = await User.findByIdAndUpdate(
        user._id,
        updateData,
        { returnDocument: 'after' }
      );
      console.log("Updated user (role preserved):", user);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed. Please try again." });
  }
};

export const getUser = async (req, res) => {
  try {
    console.log("=== GET USER ENDPOINT HIT ===");
    console.log("User ID from JWT:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");
    console.log("User fetched:", user);

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ msg: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("=== UPDATE USER ENDPOINT HIT ===");
    console.log("User ID from JWT:", req.user.id);
    console.log("Update data:", req.body);

    const { name, theme, deliveryAddress } = req.body;
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (theme !== undefined) updateData.theme = theme;
    if (deliveryAddress !== undefined) updateData.deliveryAddress = deliveryAddress;

    console.log("Final update data:", updateData);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { returnDocument: 'after', new: true }
    ).select("-password");

    console.log("Updated user after save:", user);
    
    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};