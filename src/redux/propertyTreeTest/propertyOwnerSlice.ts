import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update
} from '@reduxjs/toolkit';

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
    addPropertyOwners: (state, action: PayloadAction<PropertyOwner[]>) => {
      // First, upsert all owners at once
      propertyOwnerAdapter.upsertMany(state, action.payload);

      // Update links in the state to reflect new subowners in parents
      const parentUpdates = new Map();

      for (const owner of action.payload) {
        const periodPos = owner.uri.lastIndexOf('.');
        const parentUri = owner.uri.substring(0, periodPos);

        if (state.entities[parentUri]) {
          if (!parentUpdates.has(parentUri)) {
            parentUpdates.set(parentUri, new Set(state.entities[parentUri].subowners));
          }
          parentUpdates.get(parentUri).add(owner.uri);
        }
      }

      // Use updateMany with the adapter
      const updates: Update<PropertyOwner, string>[] = Array.from(
        parentUpdates.entries()
      ).map(([uri, subowners]) => ({
        id: uri,
        changes: { subowners: Array.from(subowners) }
      }));

      propertyOwnerAdapter.updateMany(state, updates);

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
  addPropertyOwners,
  setInitialState,
  removePropertyOwners,
  reset,
  updateOne
} = propertyOwners.actions;
export const propertyOwnerReducer = propertyOwners.reducer;

export const propertyOwnerSelectors = propertyOwnerAdapter.getSelectors(
  (state: RootState) => state.propertyOwners
);
