import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PropertyOwners, Uri } from '@/types/types';

// actions:
// addPropertyOwners
// addProperties
// removePropertyOwners
// removeProperties
// updatePropertyValue
// setPropertyValue
// clearPropertyTree

export interface PropertyOwnersState {
  propertyOwners: PropertyOwners;
}

const initialStatePropertyOwners: PropertyOwnersState = {
  propertyOwners: {}
};

export const propertyOwnersSlice = createSlice({
  name: 'propertyOwners',
  initialState: initialStatePropertyOwners,
  reducers: {
    addPropertyOwners: (state, action: PayloadAction<PropertyOwners>) => {
      for (const [uri, owner] of Object.entries(action.payload)) {
        if (!owner) {
          continue;
        }
        state.propertyOwners[uri] = owner;
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
      }

      return state;
    },
    clearPropertyOwners: () => {
      return {
        propertyOwners: {}
      };
    },
    removePropertyOwners: (state, action: PayloadAction<{ uris: Uri[] }>) => {
      action.payload.uris.forEach((uri) => {
        // Delete this particular property owner
        delete state.propertyOwners[uri];

        // Delete the parent's link to the property owner
        const periodPos = uri.lastIndexOf('.');
        const parentUri = uri.substring(0, periodPos);
        const index = state.propertyOwners[parentUri]?.subowners.indexOf(uri) ?? -1;
        // If found, remove parent link
        if (index > -1) {
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

export const { addPropertyOwners, removePropertyOwners, clearPropertyOwners } =
  propertyOwnersSlice.actions;
export const propertyOwnersReducer = propertyOwnersSlice.reducer;
