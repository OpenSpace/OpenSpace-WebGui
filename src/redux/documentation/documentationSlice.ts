import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LicenseEntry } from 'openspace-api-js/types';

export interface DocumentationState {
  isInitialized: boolean;
  assetsMetaData: LicenseEntry[];
}

const initialState: DocumentationState = {
  isInitialized: false,
  assetsMetaData: []
};

export const documentationSlice = createSlice({
  name: 'documentation',
  initialState,
  reducers: {
    initializeDocumentation: (state, action: PayloadAction<LicenseEntry[]>) => {
      state.isInitialized = true;
      state.assetsMetaData = action.payload;
      return state;
    }
  }
});

export const { initializeDocumentation } = documentationSlice.actions;
export const documentationReducer = documentationSlice.reducer;
