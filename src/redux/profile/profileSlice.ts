import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileTopic } from 'openspace-api-js/types';

type ProfileData = ProfileTopic['data'];

export interface ProfileState extends ProfileData {
  initalized: boolean;
}

const initialState: ProfileState = {
  initalized: false,
  addons: [],
  uiPanelVisibility: {},
  hasStartedBefore: undefined,
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
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      return {
        ...state,
        ...action.payload,
        initalized: true
      };
    }
  }
});

export const { setProfileData } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
