import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Identifier } from '@/types/types';

export interface ProfileState {
  markNodes: Identifier[];
}

const initialState: ProfileState = {
  markNodes: []
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setMarkedNodes: (state, action: PayloadAction<Identifier[]>) => {
      state.markNodes = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { setMarkedNodes } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
