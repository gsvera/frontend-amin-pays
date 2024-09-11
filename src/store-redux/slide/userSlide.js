import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  dataUser: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
  },
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIdUser: (state, action) => {
      state.dataUser.idUser = action.payload;
    },
    setDataUser: (state, action) => {
      state.dataUser = action.payload;
    },
  },
});

export const { setToken, setDataUser, setIdUser } = userSlice.actions;

export default userSlice.reducer;
