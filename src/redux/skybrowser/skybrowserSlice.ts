import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SkyBrowserImage {
  cartesianDirection: number[];
  collection: string;
  credits: string;
  creditsUrl: string;
  dec: number;
  fov: number;
  hasCelestialCoords: boolean;
  identifier: string;
  key: string;
  name: string;
  ra: number;
  thumbnail: string;
  url: string;
}

export interface SkyBrowserBrowser {
  borderRadius: number;
  cartesianDirection: number[];
  color: number[];
  dec: number;
  displayCopies: object;
  fov: number;
  id: string;
  isFacingCamera: boolean;
  isUsingRae: boolean;
  name: string;
  opacities: number[];
  ra: number;
  ratio: number;
  roll: number;
  scale: number;
  selectedImages: number[];
  targetId: string;
}

interface SkyBrowserUpdate
  extends Pick<SkyBrowserState, 'selectedBrowserId' | 'cameraInSolarSystem'> {
  browsers: { [id: string]: SkyBrowserBrowser };
}

export interface SkyBrowserState {
  isInitialized: boolean;
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
  selectedBrowser: SkyBrowserBrowser | null;
  browserIds: string[];
  browserNames: string[];
  browserColors: number[][];
  imageList: SkyBrowserImage[];
  activeImage: string;
}

const initialState: SkyBrowserState = {
  isInitialized: false,
  cameraInSolarSystem: false,
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
      state.selectedBrowser = action.payload.browsers[state.selectedBrowserId];
      if (state.selectedBrowser?.selectedImages !== undefined) {
        // For some reason the indices are sent as strings... convert them to numbers
        state.selectedBrowser.selectedImages = state.selectedBrowser.selectedImages.map(
          (id) => (typeof id === 'string' ? parseInt(id) : id)
        );
      }
      state.browserIds = Object.keys(action.payload.browsers) ?? [];
      // Get all colors
      state.browserColors = state.browserIds.map(
        (id) => action.payload.browsers[id].color
      );
      state.browserNames = state.browserIds.map((id) => action.payload.browsers[id].name);

      return state;
    },
    setImageCollectionData: (state, action: PayloadAction<SkyBrowserImage[]>) => {
      state.imageList = action.payload;
      return state;
    },
    onCloseConnection: (state) => {
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
  onCloseConnection,
  setActiveImage,
  subscriptionIsSetup
} = skyBrowserSlice.actions;
export const skyBrowserReducer = skyBrowserSlice.reducer;
