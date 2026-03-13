

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import widgetsReducer from "./widgetsSlice";


export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    widgets: widgetsReducer,
  },
});

