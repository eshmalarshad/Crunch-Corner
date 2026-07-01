import express from "express";
import { getFoods, getFoodById, createFood, updateFood, deleteFood } from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/", createFood);
router.put("/:id", updateFood);
router.delete("/:id", deleteFood);

export default router;
