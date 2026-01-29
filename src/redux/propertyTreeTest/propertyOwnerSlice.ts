import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PropertyOwner, Uri } from '@/types/types';

import { RootState } from '../store';

// Property owners
export const propertyOwnerAdapter = createEntityAdapter({
  selectId: (o: PropertyOwner) => o.uri,
  // Keep the "all IDs" array sorted based on uri
  sortComparer: (a, b) => a.uri.localeCompare(b.uri)
});

const propertyOwners = createSlice({
  name: 'propertyOwners',
  initialState: propertyOwnerAdapter.getInitialState(),
  reducers: {
    reset: propertyOwnerAdapter.removeAll,
    updateOne: propertyOwnerAdapter.updateOne,
    setInitialState: propertyOwnerAdapter.upsertMany,
    addPropertyOwner: (state, action: PayloadAction<PropertyOwner>) => {
      const owner = action.payload;

      propertyOwnerAdapter.upsertOne(state, owner);
      // Ensure the parents of the uri have the links to the new entry
      // Get parent uri
      const periodPos = owner.uri.lastIndexOf('.');
      const parentUri = owner.uri.substring(0, periodPos);

      // If that parent exists and the link doesn't exist, add the link to the parent
      const parentExists = parentUri in state.entities;
      if (parentExists && !state.entities[parentUri].subowners.includes(owner.uri)) {
        state.entities[parentUri].subowners.push(owner.uri);
      }

      return state;
    },
    removePropertyOwners: (state, action: PayloadAction<{ uris: Uri[] }>) => {
      action.payload.uris.forEach((uri) => {
        // Delete this particular property owner
        delete state.entities[uri];

        // Delete the parent's link to the property owner
        const periodPos = uri.lastIndexOf('.');
        const parentUri = uri.substring(0, periodPos);
        const index = state.entities[parentUri]?.subowners.indexOf(uri) ?? -1;
        // If found, remove parent link
        if (index > -1) {
          state.entities[parentUri]!.subowners.splice(index, 1);
        }

        // Delete subowners that have been flattened
        const related = Object.keys(state).filter((value) => value.includes(`${uri}.`));
        related.forEach((subOwnerUri) => delete state.entities[subOwnerUri]);
      });
      return state;
    }
  }
});

export const {
  addPropertyOwner,
  setInitialState,
  removePropertyOwners,
  reset,
  updateOne
} = propertyOwners.actions;
export const propertyOwnerReducer = propertyOwners.reducer;

export const propertyOwnerSelectors = propertyOwnerAdapter.getSelectors(
  (state: RootState) => state.propertyOwners
);
