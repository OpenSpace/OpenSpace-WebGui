import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SkyBrowserState {
  browsers: any; // TODO type this
  cameraInSolarSystem: boolean;
  selectedBrowserId: string;
}

const initialState: SkyBrowserState = {
  browsers: {},
  cameraInSolarSystem: false,
  selectedBrowserId: ''
};

export const skyBrowserSlice = createSlice({
  name: 'skybrowser',
  initialState,
  reducers: {
    updateSkyBrowser: (state, action: PayloadAction<SkyBrowserState>) => {
      state.browsers = action.payload.browsers;
      state.cameraInSolarSystem = action.payload.cameraInSolarSystem;
      state.selectedBrowserId = action.payload.selectedBrowserId;
      return state;
    },
    onOpenConnection: (state) => {
      return state;
    },
    onCloseConnection: (state) => {
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateSkyBrowser, onOpenConnection, onCloseConnection } =
  skyBrowserSlice.actions;
export const skyBrowserReducer = skyBrowserSlice.reducer;
