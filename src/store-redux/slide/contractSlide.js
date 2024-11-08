import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataContract: {
    id: null,
    folio: null,
    lastDateDidPay: null,
    lastPayAmount: null,
    statusContract: null,
  },
};

export const contractSlice = createSlice({
  name: "contractSlice",
  initialState,
  reducers: {
    setContract: (state, action) => {
      state.dataContract = action.payload;
    },
  },
});

export const { setContract } = contractSlice.actions;

export default contractSlice.reducer;
