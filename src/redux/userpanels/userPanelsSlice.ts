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
    openWebpanel: (state, action: PayloadAction<WebPanel>) => {
      function isEqualToPayload(item: WebPanel) {
        return item.src === action.payload.src && item.title === action.payload.title;
      }
      if (!state.addedWebpanels.find(isEqualToPayload)) {
        state.addedWebpanels.push(action.payload);
      }
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { intializeUserPanels, openWebpanel } = userPanelsSlice.actions;
export const userPanelsReducer = userPanelsSlice.reducer;
