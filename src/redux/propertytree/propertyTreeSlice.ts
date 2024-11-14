import { combineSlices, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Properties,
  Property,
  PropertyOwner,
  PropertyOwners,
  PropertyValue
} from '@/types/types';

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

export const properties = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperties: (state, action: PayloadAction<{ properties: Property[] }>) => {
      action.payload.properties.forEach((p) => {
        state.properties[p.uri] = {
          description: p.description,
          value: p.value,
          uri: p.uri // TODO remove this uri. (anden88 2024-10-17) This was left by Ylva,
          // presumably we can just use the same uri e.g.,
          //state.properties[p.uri] = { ... state.properties[p.uri], descip: p.descrip...}
        };
      });

      return state;
    },
    removeProperties: (state, action: PayloadAction<{ uris: string[] }>) => {
      action.payload.uris.forEach((uri) => {
        delete state.properties[uri];
      });
      return state;
    },
    clearPropertyTree: () => {
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
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  addProperties,
  removeProperties,
  clearPropertyTree,
  setPropertyValue,
  updatePropertyValue
} = properties.actions;

// actions:
// addPropertyOwners
// addProperties
// removePropertyOwners
// removeProperties
// updatePropertyValue
// setPropertyValue
// clearPropertyTree

export interface PropertyOwnersState {
  isInitialized: boolean;
  propertyOwners: PropertyOwners;
}

const initialStatePropertyOwners: PropertyOwnersState = {
  isInitialized: false,
  propertyOwners: {}
};

export const propertyOwners = createSlice({
  name: 'propertyOwners',
  initialState: initialStatePropertyOwners,
  reducers: {
    addPropertyOwners: (
      state,
      action: PayloadAction<{ propertyOwners: PropertyOwner[] }>
    ) => {
      const inputOwners = action.payload.propertyOwners;
      // const newState = { ...state };
      inputOwners.forEach((owner) => {
        state.propertyOwners[owner.uri] = {
          identifier: owner.identifier,
          name: owner.name,
          properties: owner.properties,
          subowners: owner.subowners,
          tags: owner.tags || [],
          uri: owner.uri, // TODO: Remove this
          description: owner.description
        };

        // Ensure the parents of the uri have the links to the new entry
        // Get parent uri
        const periodPos = owner.uri.lastIndexOf('.');
        const parentUri = owner.uri.substring(0, periodPos);

        // If that parent exists and the link doesn't exist, add the link to the parent
        const parentExists = parentUri && state.propertyOwners[parentUri];
        if (
          parentExists &&
          !state.propertyOwners[parentUri]!.subowners.includes(owner.uri)
        ) {
          state.propertyOwners[parentUri]!.subowners.push(owner.uri);
        }
      });
      return state;
    },
    clearPropertyTree: () => {
      return {
        isInitialized: false,
        propertyOwners: {}
      };
    },
    removePropertyOwners: (state, action: PayloadAction<{ uris: string[] }>) => {
      // const newState = { ...state };

      action.payload.uris.forEach((uri) => {
        // Delete this particular property owner
        delete state.propertyOwners[uri];

        // Delete the parent's link to the property owner
        const periodPos = uri.lastIndexOf('.');
        const parentUri = uri.substring(0, periodPos);
        const index = state.propertyOwners[parentUri]?.subowners.indexOf(uri) ?? -1;
        // If found, remove
        if (index > -1) {
          // 2nd parameter means remove one item only
          state.propertyOwners[parentUri]!.subowners.splice(index, 1);
        }

        // Delete subowners that have been flattened
        const related = Object.keys(state).filter((value) => value.includes(`${uri}.`));
        related.forEach((subOwnerUri) => delete state.propertyOwners[subOwnerUri]);
      });
      return state;
    }
  }
});

export const { addPropertyOwners, removePropertyOwners } = propertyOwners.actions;
export const propertyTreeReducer = combineSlices({
  props: properties.reducer,
  owners: propertyOwners.reducer
});
