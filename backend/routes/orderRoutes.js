import express from "express";
import { getOrders, getOrdersByUserId, createOrder, updateOrderStatus, getDashboardStats } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/stats", getDashboardStats);
router.get("/user/:userId", getOrdersByUserId);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);

export default router;
