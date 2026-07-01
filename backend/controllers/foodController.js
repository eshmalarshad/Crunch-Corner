import Food from "../models/Food.js";

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("category");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("category");
    res.json(food);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      available,
      sizes,
      flavors,
      extraToppings,
    } = req.body;
    
    // Convert all price fields to numbers
    const processedSizes = sizes?.map(size => ({
      ...size,
      price: Number(size.price) || 0
    }));
    
    const processedToppings = extraToppings?.map(topping => ({
      ...topping,
      price: Number(topping.price) || 0
    }));
    
    const food = await Food.create({
      name,
      description,
      price: Number(price) || 0,
      category,
      image,
      available,
      sizes: processedSizes,
      flavors,
      extraToppings: processedToppings,
    });
    const savedFood = await Food.findById(food._id).populate("category");
    res.json(savedFood);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      available,
      sizes,
      flavors,
      extraToppings,
    } = req.body;
    
    // Convert all price fields to numbers
    const processedSizes = sizes?.map(size => ({
      ...size,
      price: Number(size.price) || 0
    }));
    
    const processedToppings = extraToppings?.map(topping => ({
      ...topping,
      price: Number(topping.price) || 0
    }));
    
    const food = await Food.findByIdAndUpdate(
      req.params.id, 
      {
        name,
        description,
        price: Number(price) || 0,
        category,
        image,
        available,
        sizes: processedSizes,
        flavors,
        extraToppings: processedToppings,
      },
      { returnDocument: 'after' }
    ).populate("category");
    res.json(food);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ msg: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
