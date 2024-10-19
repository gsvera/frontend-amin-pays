import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCustomer: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    celPhone: null,
    celPhoneWhatsapp: false,
    phoneOffice: null,
    phoneOfficeWhatsapp: false,
    description: null,
    createdUser: null,
    updatedUser: null,
    codeCompany: null,
    createdAt: null,
    updatedAt: null,
  },
};

export const customerSlice = createSlice({
  name: "customerSlice",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.dataCustomer = action.payload;
    },
    cleanSelection: (state, action) => {
      state.dataCustomer = initialState;
    },
  },
});

export const { setCustomer, cleanSelection } = customerSlice.actions;

export default customerSlice.reducer;
