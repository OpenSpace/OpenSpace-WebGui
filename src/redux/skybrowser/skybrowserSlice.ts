import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SkyBrowser, SkyBrowserTopic } from 'openspace-api-js/generated';

import { SkyBrowserImage } from '@/panels/SkyBrowserPanel/types';

export interface SkyBrowserState {
  isInitialized: boolean;
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
  browsers: Record<string, SkyBrowser>;
  browserIds: string[];
  browserNames: string[];
  browserColors: [number, number, number][];
  imageList: SkyBrowserImage[] | undefined;
  activeImage: string;
}

const initialState: SkyBrowserState = {
  isInitialized: false,
  cameraInSolarSystem: true, // Setting this to true as OpenSpace usually starts on Earth
  selectedBrowserId: '',
  imageList: undefined,
  browsers: {},
  activeImage: '',
  browserColors: [],
  browserIds: [],
  browserNames: []
};

export const skyBrowserSlice = createSlice({
  name: 'skybrowser',
  initialState,
  reducers: {
    subscriptionIsSetup: (state) => {
      state.isInitialized = true;
      return state;
    },
    updateSkyBrowser: (state, action: PayloadAction<SkyBrowserTopic['data']>) => {
      state.cameraInSolarSystem = action.payload.cameraInSolarSystem;
      state.selectedBrowserId = action.payload.selectedBrowserId;

      if (action.payload.browsers && state.selectedBrowserId in action.payload.browsers) {
        state.browsers = action.payload.browsers;
        // Derived state for easier access
        state.browserIds = Object.keys(action.payload.browsers) ?? [];
        state.browserColors = state.browserIds.map(
          (id) => action.payload.browsers[id].color
        );
        state.browserNames = state.browserIds.map(
          (id) => action.payload.browsers[id].name
        );
      } else {
        // If the update is invalid, reset the state
        state.selectedBrowserId = '';
        state.browsers = {};
        state.browserIds = [];
        state.browserNames = [];
        state.browserColors = [];
      }

      return state;
    },
    resetSkyBrowser: () => {
      return initialState;
    },
    setImageCollectionData: (state, action: PayloadAction<SkyBrowserImage[]>) => {
      state.imageList = action.payload;
      return state;
    },
    setActiveImage: (state, action: PayloadAction<string>) => {
      state.activeImage = action.payload;
      return state;
    }
  }
});

export const {
  updateSkyBrowser,
  setImageCollectionData,
  setActiveImage,
  subscriptionIsSetup,
  resetSkyBrowser
} = skyBrowserSlice.actions;
export const skyBrowserReducer = skyBrowserSlice.reducer;
