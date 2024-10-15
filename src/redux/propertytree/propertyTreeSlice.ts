import { createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { Property, Properties, PropertyOwners, PropertyOwner } from 'src/types/types';

export interface PropertiesState {
  isInitialized: boolean;
  properties: Properties;
}

const initialState: PropertiesState = {
  isInitialized: false,
  properties: {}
};

export const properties = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperties: (state, action: PayloadAction<{ properties: Property[] }>) => {
      const newState = { ...state };

      action.payload.properties.forEach((p) => {
        newState.properties[p.uri] = {
          description: p.description,
          value: p.value,
          uri: p.uri // TODO: remove this uri
        };
      });

      return newState;
    },
    removeProperties: (state, action: PayloadAction<{ uris: string[] }>) => {
      const newState = { ...state };
      action.payload.uris.forEach((uri) => {
        delete newState.properties[uri];
      });
      return newState;
    },
    clearPropertyTree: () => {
      return {
        isInitialized: false,
        properties: {}
      };
    },
    updatePropertyValue: (state, action: PayloadAction<Property>) => {
      const newPropertyState = { ...state.properties[action.payload.uri] };
      newPropertyState.value = action.payload.value;
      return {
        ...state,
        [action.payload.uri]: newPropertyState
      };
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { addProperties, removeProperties, clearPropertyTree, updatePropertyValue } =
  properties.actions;

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
      const newState = { ...state };
      inputOwners.forEach((owner) => {
        newState.propertyOwners[owner.uri] = {
          identifier: owner.identifier,
          name: owner.name,
          properties: owner.properties,
          subowners: owner.subowners,
          tags: owner.tags || [],
          uri: owner.uri // TODO: Remove this
        };

        // Ensure the parents of the uri have the links to the new entry
        // Get parent uri
        const periodPos = owner.uri.lastIndexOf('.');
        const parentUri = owner.uri.substring(0, periodPos);

        // If that parent exists and the link doesn't exist, add the link to the parent
        const parentExists = parentUri && newState.propertyOwners[parentUri];
        if (
          parentExists &&
          !newState.propertyOwners[parentUri].subowners.includes(owner.uri)
        ) {
          newState.propertyOwners[parentUri].subowners.push(owner.uri);
        }
      });
      return newState;
    },
    clearPropertyTree: () => {
      return {
        isInitialized: false,
        propertyOwners: {}
      };
    },
    removePropertyOwners: (state, action: PayloadAction<{ uris: string[] }>) => {
      const newState = { ...state };

      action.payload.uris.forEach((uri) => {
        // Delete this particular property owner
        delete newState.propertyOwners[uri];

        // Delete the parent's link to the property owner
        const periodPos = uri.lastIndexOf('.');
        const parentUri = uri.substring(0, periodPos);
        const index = newState.propertyOwners[parentUri].subowners.indexOf(uri);
        // If found, remove
        if (index > -1) {
          // 2nd parameter means remove one item only
          newState.propertyOwners[parentUri].subowners.splice(index, 1);
        }

        // Delete subowners that have been flattened
        const related = Object.keys(newState).filter((value) =>
          value.includes(`${uri}.`)
        );
        related.forEach((subOwnerUri) => delete newState.propertyOwners[subOwnerUri]);
      });
      return newState;
    }
  }
});

const propertyTree = combineReducers({
  properties,
  propertyOwners
});

export default propertyTree;

export const { addPropertyOwners, removePropertyOwners } = propertyOwners.actions;
