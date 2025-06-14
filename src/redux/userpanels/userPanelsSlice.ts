import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WebPanel {
  title: string;
  src: string;
}

export interface UserPanelsState {
  isInitialized: boolean;
  panels: string[];
  addedWebpanels: WebPanel[];
}

const initialState: UserPanelsState = {
  isInitialized: false,
  panels: [],
  addedWebpanels: []
};

export const userPanelsSlice = createSlice({
  name: 'userPanels',
  initialState,
  reducers: {
    intializeUserPanels: (state, action: PayloadAction<string[]>) => {
      state.panels = action.payload;
      state.isInitialized = true;
      return state;
    },
    updateRecentWebpanels: (state, action: PayloadAction<WebPanel>) => {
      function isEqualToPayload(item: WebPanel) {
        return item.src === action.payload.src && item.title === action.payload.title;
      }
      const index = state.addedWebpanels.findIndex((item) => isEqualToPayload(item));
      const exists = index !== -1;
      // If item already exists - remove the item, then push to front
      // That way we have an array sorted on recency
      if (exists) {
        state.addedWebpanels.splice(index, 1);
      }
      // Add to front
      state.addedWebpanels.splice(0, 0, action.payload);
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { intializeUserPanels, updateRecentWebpanels } = userPanelsSlice.actions;
export const userPanelsReducer = userPanelsSlice.reducer;
