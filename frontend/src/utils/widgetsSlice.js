
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // list of widgets for the current user
};

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    // Replace the whole widgets list in a single operation.
    setWidgets(state, action) {
      state.items = action.payload || [];
    },
    // Either adds a new widget or updates an existing one in the list.
    upsertWidget(state, action) {
      const widget = action.payload;
      const idx = state.items.findIndex((w) => w._id === widget._id);
      if (idx >= 0) {
        state.items[idx] = widget;
      } else {
        state.items.unshift(widget);
      }
    },
  },
});

export const { setWidgets, upsertWidget } = widgetsSlice.actions;

export default widgetsSlice.reducer;

