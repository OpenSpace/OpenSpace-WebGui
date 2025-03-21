import { createSlice } from '@reduxjs/toolkit';

import { getProfile } from './profileMiddleware';

export interface ProfileState {
  uiPanelVisibility: {
    [key: string]: boolean;
  };
  markNodes: string[];
}

const initialState: ProfileState = {
  uiPanelVisibility: {},
  markNodes: []
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state = action.payload;
      console.log(state);
      return state;
    });
  }
});

export const profileReducer = profileSlice.reducer;
