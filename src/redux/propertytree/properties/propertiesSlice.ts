import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Properties, PropertyValue, Uri } from '@/types/types';

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
//   uri: Uri,
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
    addProperties: (state, action: PayloadAction<Properties>) => {
      for (const [uri, property] of Object.entries(action.payload)) {
        state.properties[uri] = property;
      }
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
      action: PayloadAction<{ uri: Uri; value: PropertyValue }>
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
      action: PayloadAction<{ uri: Uri; value: PropertyValue }>
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
