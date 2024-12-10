import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssetMetaData {
  author: string;
  description: string;
  identifiers?: string[];
  license: string;
  name: string;
  path: string;
  url: string;
  version: string;
}

export interface DocumentationState {
  isInitialized: boolean;
  assetsMetaData: AssetMetaData[];
}

const initialState: DocumentationState = {
  isInitialized: false,
  assetsMetaData: []
};

export const documentationSlice = createSlice({
  name: 'documentation',
  initialState,
  reducers: {
    initializeDocumentation: (_, action: PayloadAction<AssetMetaData[]>) => {
      return {
        isInitialized: true,
        assetsMetaData: action.payload
      };
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeDocumentation } = documentationSlice.actions;
export const documentationReducer = documentationSlice.reducer;
