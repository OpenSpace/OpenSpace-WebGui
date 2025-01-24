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

export interface SkyBrowserState {
  isInitialized: boolean;
  browsers: { [id: string]: SkyBrowserBrowser };
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
  imageList: SkyBrowserImage[];
  activeImage: string;
}

const initialState: SkyBrowserState = {
  isInitialized: false,
  browsers: {},
  cameraInSolarSystem: false,
  selectedBrowserId: '',
  imageList: [],
  activeImage: ''
};

export const skyBrowserSlice = createSlice({
  name: 'skybrowser',
  initialState,
  reducers: {
    subscriptionIsSetup: (state) => {
      state.isInitialized = true;
      return state;
    },
    updateSkyBrowser: (state, action: PayloadAction<SkyBrowserState>) => {
      state.browsers = action.payload.browsers;
      state.cameraInSolarSystem = action.payload.cameraInSolarSystem;
      state.selectedBrowserId = action.payload.selectedBrowserId;
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
  subscriptionIsSetup,
  setActiveImage
} = skyBrowserSlice.actions;
export const skyBrowserReducer = skyBrowserSlice.reducer;
