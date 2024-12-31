import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      let productItem = state.cartItems.find(
        (product) => product._id === item._id
      );
      if (productItem) {
        productItem.count += 1;
      } else {
        state.cartItems.push({ ...item, count: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    incrementCount(state, action) {
      const item = action.payload;
      let productItem = state.cartItems.find(
        (product) => product._id === item._id
      );
      if (productItem && productItem.count < item.quantity) {
        productItem.count += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      } else {
        alert(`Only ${item.quantity} units of ${item.name} available`);
      }
    },
    decrementCount(state, action) {
      const item = action.payload;
      let productItem = state.cartItems.find(
        (product) => product._id === item._id
      );
      if (productItem) {
        productItem.count -= 1;
        if (productItem.count === 0) {
          state.cartItems = state.cartItems.filter(
            (product) => product._id !== item._id
          );
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
      }
    },
    removeFromCart(state, action) {
      const item = action.payload;
      state.cartItems = state.cartItems.filter(
        (product) => product._id !== item._id
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCartItem(state, action) {
      localStorage.removeItem("cartItems");
      state.cartItems = [];
    },
  },
});
const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  incrementCount,
  decrementCount,
  removeFromCart,
  clearCartItem,
} = cartSlice.actions;
export default cartReducer;
