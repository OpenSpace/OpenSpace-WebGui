import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  SkyBrowserBrowser,
  SkyBrowserImage,
  SkyBrowserUpdate
} from '@/types/skybrowsertypes';

export interface SkyBrowserState {
  isInitialized: boolean;
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
  selectedBrowser: SkyBrowserBrowser | null;
  browserIds: string[];
  browserNames: string[];
  browserColors: [number, number, number][];
  imageList: SkyBrowserImage[];
  activeImage: string;
}

const initialState: SkyBrowserState = {
  isInitialized: false,
  cameraInSolarSystem: true, // Setting this to true as OpenSpace usually starts on Earth
  selectedBrowserId: '',
  imageList: [],
  activeImage: '',
  browserColors: [],
  selectedBrowser: null,
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
    updateSkyBrowser: (state, action: PayloadAction<SkyBrowserUpdate>) => {
      state.cameraInSolarSystem = action.payload.cameraInSolarSystem;
      state.selectedBrowserId = action.payload.selectedBrowserId;

      // Derived state
      if (action.payload.browsers && state.selectedBrowserId in action.payload.browsers) {
        state.selectedBrowser = action.payload.browsers[state.selectedBrowserId];
        // For some reason the indices are sent as strings... convert them to numbers
        state.selectedBrowser.selectedImages = state.selectedBrowser.selectedImages.map(
          (id) => (typeof id === 'string' ? parseInt(id) : id)
        );
        state.browserIds = Object.keys(action.payload.browsers) ?? [];
        // Get all colors
        state.browserColors = state.browserIds.map(
          (id) => action.payload.browsers[id].color
        );
        state.browserNames = state.browserIds.map(
          (id) => action.payload.browsers[id].name
        );
      } else {
        state.selectedBrowserId = '';
        state.selectedBrowser = null;
        state.browserIds = [];
        state.browserNames = [];
        state.browserColors = [];
      }

      return state;
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

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  updateSkyBrowser,
  setImageCollectionData,
  setActiveImage,
  subscriptionIsSetup
} = skyBrowserSlice.actions;
export const skyBrowserReducer = skyBrowserSlice.reducer;
