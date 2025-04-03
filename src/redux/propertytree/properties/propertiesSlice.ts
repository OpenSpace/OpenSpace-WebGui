import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AdditionalData } from '@/components/Property/types';
import { PropertyVisibilityNumber } from '@/types/enums';
import { Properties, PropertyOverview, PropertyValue, Uri } from '@/types/types';

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
        state.propertyOverview[uri] = {
          name: property?.description.name ?? '',
          visibility: property?.description.metaData.Visibility
            ? PropertyVisibilityNumber[property?.description.metaData.Visibility]
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
    },
    updatePropertyAdditionalData: (
      state,
      action: PayloadAction<{ uri: Uri; additionalData: AdditionalData }>
    ) => {
      const { uri, additionalData } = action.payload;

      // TODO: check this return vs the old code
      if (state.properties[uri]) {
        state.properties[uri].description.additionalData = additionalData;
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
  updatePropertyAdditionalData,
  updatePropertyValue
} = propertiesSlice.actions;

export const propertiesReducer = propertiesSlice.reducer;
