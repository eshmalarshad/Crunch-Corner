import Order from "../models/Order.js";
import Food from "../models/Food.js";

// Generate short order number
const generateOrderNumber = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let orderNumber;
  let isUnique = false;

  while (!isUnique) {
    orderNumber = '';
    for (let i = 0; i < 6; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check if order number exists
    const existing = await Order.findOne({ orderNumber });
    if (!existing) {
      isUnique = true;
    }
  }
  return orderNumber;
};

export const getOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    
    // Generate orderNumber for orders that don't have one
    for (let order of orders) {
      if (!order.orderNumber) {
        const orderNumber = await generateOrderNumber();
        order = await Order.findByIdAndUpdate(
          order._id,
          { orderNumber },
          { returnDocument: 'after' }
        );
      }
    }
    
    // Fetch updated orders
    orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    let orders = await Order.find({ userId: req.params.userId });
    
    // Generate orderNumber for orders that don't have one
    for (let order of orders) {
      if (!order.orderNumber) {
        const orderNumber = await generateOrderNumber();
        order = await Order.findByIdAndUpdate(
          order._id,
          { orderNumber },
          { returnDocument: 'after' }
        );
      }
    }
    
    // Fetch updated orders
    orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    console.log("=== createOrder CALLED ===");
    console.log("Request body:", req.body);
    
    const { userId, customerName, items, totalPrice, address, paymentMethod } = req.body;
    const DELIVERY_CHARGE = 250; // Fixed delivery charge
    
    // Generate unique order number
    const orderNumber = await generateOrderNumber();
    console.log("Generated order number:", orderNumber);
    
    // Process items to ensure numeric fields are numbers
    const processedItems = items.map(item => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    }));
    console.log("Processed items:", processedItems);
    
    // Check if it's the user's first order
    const existingOrders = await Order.countDocuments({ userId });
    const isFirstOrder = existingOrders === 0;
    
    // Calculate discount (20% off for first order)
    const subtotal = Number(totalPrice) || 0;
    let discount = 0;
    if (isFirstOrder) {
      discount = subtotal * 0.2; // 20% discount
    }
    const finalTotalPrice = (subtotal - discount) + DELIVERY_CHARGE;
    
    console.log("Subtotal:", subtotal);
    console.log("Discount:", discount);
    console.log("Delivery Charge:", DELIVERY_CHARGE);
    console.log("Final Total:", finalTotalPrice);
    
    console.log("Creating order in DB...");
    const order = await Order.create({
      orderNumber,
      userId,
      customerName,
      items: processedItems,
      subtotal: subtotal,
      discount: discount,
      deliveryCharge: DELIVERY_CHARGE,
      totalPrice: finalTotalPrice,
      originalTotalPrice: subtotal,
      isFirstOrder: isFirstOrder,
      address,
      paymentMethod
    });
    console.log("Order created successfully:", order);
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalOrders, pendingOrders, preparingOrders, outForDeliveryOrders, deliveredOrders, totalFoods, todayOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Preparing" }),
      Order.countDocuments({ status: "Out for Delivery" }),
      Order.countDocuments({ status: "Delivered" }),
      Food.countDocuments(),
      Order.countDocuments({
        orderTime: {
          $gte: today,
          $lt: tomorrow
        }
      })
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      totalFoods,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
