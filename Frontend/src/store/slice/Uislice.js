import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
  },
});

export const {
  openCart,
  closeCart,
  openSearch,
  closeSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
