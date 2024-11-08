import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slide/userSlide";
import customerReducer from "./slide/customerSlide";
import contractReducer from "./slide/contractSlide";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    userSlice: persistedReducer,
    customerSlice: customerReducer,
    contractSlice: contractReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
