import { createSlice } from "@reduxjs/toolkit";

const bouquetsSlice = createSlice({
  name: "bouquets",
  initialState: {
    list: [], 
  },
  reducers: {
    setBouquets: (state, action) => {
      state.list = action.payload; 
    },
    toggleLike: (state, action) => {
      if (!state.list) return;
      const bouquet = state.list.find(b => b.id === action.payload);
      if (bouquet) bouquet.liked = !bouquet.liked;
    },
  },
});

export const { setBouquets, toggleLike } = bouquetsSlice.actions;
export default bouquetsSlice.reducer;
