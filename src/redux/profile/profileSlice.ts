import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Identifier } from '@/types/types';

export interface ProfileState {
  uiPanelVisibility: Record<string, boolean>;
  markNodes: Identifier[];
  name: string | undefined;
}

const initialState: ProfileState = {
  markNodes: [],
  name: undefined,
  uiPanelVisibility: {}
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileState>) => {
      state = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { setProfileData } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
