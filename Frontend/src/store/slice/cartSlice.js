import { createSlice } from "@reduxjs/toolkit";

const storageKey = "commercehub-guest-cart";
function savedItems() { try { const items = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(items) ? items : []; } catch { return []; } }
function persist(items) { localStorage.setItem(storageKey, JSON.stringify(items)); }

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: savedItems() },
  reducers: {
    addItem: (state, action) => { const incoming = action.payload; const existing = state.items.find((item) => item.id === incoming.id); if (existing) existing.quantity += incoming.quantity || 1; else state.items.push({ ...incoming, quantity: incoming.quantity || 1 }); persist(state.items); },
    setQuantity: (state, action) => { const item = state.items.find((entry) => entry.id === action.payload.id); if (item) item.quantity = Math.max(1, action.payload.quantity); persist(state.items); },
    removeItem: (state, action) => { state.items = state.items.filter((item) => item.id !== action.payload); persist(state.items); },
  },
});

export const { addItem, setQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
