import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PropertyVisibilityNumber } from '@/types/enums';
import { AnyProperty } from '@/types/Property/property';
import { Properties, PropertyOverview, Uri } from '@/types/types';

export interface PropertiesState {
  isInitialized: boolean;
  properties: Properties;
  propertyOverview: PropertyOverview;
}

const initialState: PropertiesState = {
  isInitialized: false,
  properties: {},
  // This is an overview of all properties at our disposal
  // that doesn't update when the values of properties update
  propertyOverview: {}
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperties: (state, action: PayloadAction<Properties>) => {
      for (const [uri, property] of Object.entries(action.payload)) {
        state.properties[uri] = property;
        state.propertyOverview[uri] = {
          name: property?.metaData.guiName ?? '',
          visibility: property?.metaData.visibility
            ? PropertyVisibilityNumber[property?.metaData.visibility]
            : 0
        };
      }
      return state;
    },
    removeProperties: (state, action: PayloadAction<{ uris: string[] }>) => {
      action.payload.uris.forEach((uri) => {
        delete state.properties[uri];
        delete state.propertyOverview[uri];
      });
      return state;
    },
    clearProperties: () => {
      return {
        isInitialized: false,
        properties: {},
        propertyOverview: {}
      };
    },
    setPropertyValue: (
      state,
      action: PayloadAction<{ uri: Uri; value: AnyProperty['value'] }>
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
      action: PayloadAction<{ uri: Uri; value: AnyProperty['value'] }>
    ) => {
      const { uri, value } = action.payload;

      if (state.properties[uri]) {
        state.properties[uri].value = value;
      }
      return state;
    },
    updatePropertyMetaData: (
      state,
      action: PayloadAction<{ uri: Uri; metaData: AnyProperty['metaData'] }>
    ) => {
      const { uri, metaData } = action.payload;

      if (state.properties[uri]) {
        state.properties[uri].metaData = metaData;
      }
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  addProperties,
  removeProperties,
  clearProperties,
  setPropertyValue,
  updatePropertyMetaData,
  updatePropertyValue
} = propertiesSlice.actions;

export const propertiesReducer = propertiesSlice.reducer;
