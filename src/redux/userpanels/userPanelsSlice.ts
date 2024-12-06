import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserPanelsState {
  isInitialized: boolean;
  panels: string[];
}

const initialState: UserPanelsState = {
  isInitialized: false,
  panels: []
};

export const userPanelsSlice = createSlice({
  name: 'userPanels',
  initialState,
  reducers: {
    intializeUserPanels: (state, action: PayloadAction<UserPanelsState>) => {
      state.panels = action.payload.panels;
      state.isInitialized = true;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { intializeUserPanels } = userPanelsSlice.actions;
export const userPanelsReducer = userPanelsSlice.reducer;
