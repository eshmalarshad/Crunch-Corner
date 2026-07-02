import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize?.name === action.payload.selectedSize?.name &&
          item.selectedFlavor === action.payload.selectedFlavor &&
          JSON.stringify(item.selectedToppings) ===
            JSON.stringify(action.payload.selectedToppings)
      );

      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push({
          ...action.payload,
        });
      }
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);

      if (item) {
        item.qty += 1;
      }
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);

      if (item && item.qty > 1) {
        item.qty -= 1;
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
