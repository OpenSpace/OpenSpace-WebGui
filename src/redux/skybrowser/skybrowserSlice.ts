import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SkyBrowserImage } from '@/panels/SkyBrowserPanel/types';

import { SkyBrowserBrowser } from './types';

// This is the structure of the updates we get from the skybrowser subscription
export interface SkyBrowserUpdate
  extends Pick<SkyBrowserState, 'selectedBrowserId' | 'cameraInSolarSystem'> {
  browsers: { [id: string]: SkyBrowserBrowser };
}

export interface SkyBrowserState {
  isInitialized: boolean;
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
  browsers: Record<string, SkyBrowserBrowser>;
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
    updateSkyBrowser: (state, action: PayloadAction<Partial<SkyBrowserUpdate>>) => {
      if (action.payload.cameraInSolarSystem !== undefined) {
        state.cameraInSolarSystem = action.payload.cameraInSolarSystem;
      }
      if (action.payload.selectedBrowserId !== undefined) {
        state.selectedBrowserId = action.payload.selectedBrowserId;
      }

      if (action.payload.browsers && state.selectedBrowserId in action.payload.browsers) {
        state.browsers = action.payload.browsers;
        // For some reason the indices are sent as strings... convert them to numbers
        for (const browser of Object.values(state.browsers)) {
          browser.selectedImages = browser.selectedImages.map((idx) =>
            typeof idx === 'string' ? parseInt(idx) : idx
          );
        }
        if (action.payload.browsers !== undefined) {
          // Derived state for easier access
          state.browserIds = Object.keys(action.payload.browsers) ?? [];
          state.browserColors = state.browserIds.map(
            (id) => action.payload.browsers?.[id].color ?? [255, 255, 255]
          );
          state.browserNames = state.browserIds.map(
            (id) => action.payload.browsers?.[id].name ?? 'Unnamed Browser'
          );
        }
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
