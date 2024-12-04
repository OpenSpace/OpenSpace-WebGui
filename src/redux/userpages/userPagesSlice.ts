import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserPagesState {
  isInitialized: boolean;
  panels: string[];
}

const initialState: UserPagesState = {
  isInitialized: false,
  panels: []
};

export const userPagesSlice = createSlice({
  name: 'userPages',
  initialState,
  reducers: {
    // Use `PayloadAction` to declare the contents of `action.payload`
    intializeUserPages: (state, action: PayloadAction<UserPagesState>) => {
      state.panels = action.payload.panels;
      state.isInitialized = true;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { intializeUserPages } = userPagesSlice.actions;
export const userPagesReducer = userPagesSlice.reducer;
