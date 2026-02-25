import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update
} from '@reduxjs/toolkit';

import { PropertyOwner, Uri } from '@/types/types';

import { RootState } from '../store';

/**
 * Entity adapter for managing PropertyOwner entities in Redux state.
 *
 * An entity adapter is a Redux Toolkit utility that provides a standardized way to manage
 * normalized collections of items in state. It generates reducers and selectors for common
 * CRUD operations (Create, Read, Update, Delete) on a collection of entities.
 *
 * This adapter:
 * - Uses the `uri` property of PropertyOwner objects as the unique identifier
 * - Maintains the "all IDs" array in sorted order by `uri` using locale-aware string comparison
 *
 * @see {@link https://redux-toolkit.js.org/api/createEntityAdapter} for more information on entity adapters
 */
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
      const urisToRemove = new Set<string>();
      const parentUpdates = new Map<string, string[]>();

      // Collect all URIs to remove (including nested subowners)
      action.payload.uris.forEach((uri) => {
        urisToRemove.add(uri);

        // Find all nested subowners (flattened children)
        const allUris = Object.keys(state.entities);
        const related = allUris.filter((value) => value.startsWith(`${uri}.`));
        related.forEach((subOwnerUri) => urisToRemove.add(subOwnerUri));

        // Prepare parent link removal
        const periodPos = uri.lastIndexOf('.');
        const parentUri = uri.substring(0, periodPos);

        if (state.entities[parentUri]) {
          const currentSubowners = state.entities[parentUri].subowners;
          const updatedSubowners = currentSubowners.filter((subUri) => subUri !== uri);
          parentUpdates.set(parentUri, updatedSubowners);
        }
      });

      // Remove all property owners at once
      propertyOwnerAdapter.removeMany(state, Array.from(urisToRemove));

      // Update parent links
      const updates: Update<PropertyOwner, string>[] = Array.from(
        parentUpdates.entries()
      ).map(([uri, subowners]) => ({
        id: uri,
        changes: { subowners }
      }));

      propertyOwnerAdapter.updateMany(state, updates);
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
