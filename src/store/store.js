import { configureStore } from "@reduxjs/toolkit";
import { products } from "./reducers.js";

const store = configureStore({
  reducer: { products: products },
});

export default store;