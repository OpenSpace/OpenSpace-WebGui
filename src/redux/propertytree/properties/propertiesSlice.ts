import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Properties, PropertyValue } from '@/types/types';
import { addUriToPropertyTree } from '../propertyTreeMiddleware';

export interface PropertiesState {
  isInitialized: boolean;
  properties: Properties;
}

const initialState: PropertiesState = {
  isInitialized: false,
  properties: {}
};

// function updateProperty(
//   state,
//   uri: string,
//   value: PropertyValue
// ) {
//   if (state.properties[uri]) {
//     state.properties[uri].value = value;
//   }
// }

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperties: (state, action: PayloadAction<{ properties: Properties }>) => {
      state.properties = { ...state.properties, ...action.payload.properties };
      return state;
    },
    removeProperties: (state, action: PayloadAction<{ uris: string[] }>) => {
      action.payload.uris.forEach((uri) => {
        delete state.properties[uri];
      });
      return state;
    },
    clearProperties: () => {
      return {
        isInitialized: false,
        properties: {}
      };
    },
    setPropertyValue: (
      state,
      action: PayloadAction<{ uri: string; value: PropertyValue }>
    ) => {
      const { uri, value } = action.payload;

      // TODO: this should match the updatePropertyValue
      if (state.properties[uri]) {
        state.properties[uri].value = value;
      }
      return state;
    },
    updatePropertyValue: (
      state,
      action: PayloadAction<{ uri: string; value: PropertyValue }>
    ) => {
      const { uri, value } = action.payload;

      // TODO: check this return vs the old code
      if (state.properties[uri]) {
        state.properties[uri].value = value;
      }
      return state;

      // const newPropertyState = { ...state.properties[action.payload.uri] };
      // newPropertyState.value = action.payload.value;
      // return {
      //   ...state,
      //   [action.payload.uri]: newPropertyState
      // };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addUriToPropertyTree.fulfilled, (state, action) => {
      if (action.payload?.properties) {
        state.properties = { ...state.properties, ...action.payload.properties };
      }
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  addProperties,
  removeProperties,
  clearProperties,
  setPropertyValue,
  updatePropertyValue
} = propertiesSlice.actions;

export const propertiesReducer = propertiesSlice.reducer;
