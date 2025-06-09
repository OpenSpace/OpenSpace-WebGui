import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Identifier } from '@/types/types';

export interface ProfileState {
  initalized: boolean;
  uiPanelVisibility: Record<string, boolean>;
  hasStartedBefore: boolean;
  markNodes: Identifier[];
  name: string | undefined;
  author: string | undefined;
  description: string | undefined;
  license: string | undefined;
  url: string | undefined;
  version: string | undefined;
  filePath: string;
}

const initialState: ProfileState = {
  initalized: false,
  uiPanelVisibility: {},
  hasStartedBefore: false,
  markNodes: [],
  name: undefined,
  author: undefined,
  description: undefined,
  license: undefined,
  url: undefined,
  version: undefined,
  filePath: ''
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileState>) => {
      state = action.payload;
      state.initalized = true;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { setProfileData } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
