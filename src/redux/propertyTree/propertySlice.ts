import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { AnyProperty } from '@/types/Property/property';

import { RootState } from '../store';

/**
 * Entity adapter for managing Property entities in Redux state.
 *
 * An entity adapter is a Redux Toolkit utility that provides a standardized way to manage
 * normalized collections of items in state. It generates reducers and selectors for common
 * CRUD operations (Create, Read, Update, Delete) on a collection of entities.
 *
 * This adapter:
 * - Uses the `uri` property of Property objects as the unique identifier
 * - Maintains the "all IDs" array in sorted order by `uri` using locale-aware string comparison
 *
 * @see {@link https://redux-toolkit.js.org/api/createEntityAdapter} for more information on entity adapters
 */
export const propertyAdapter = createEntityAdapter({
  selectId: (p: AnyProperty) => p.uri,
  // Keep the "all IDs" array sorted based on uri
  sortComparer: (a, b) => a.uri.localeCompare(b.uri)
});

const properties = createSlice({
  name: 'properties',
  initialState: propertyAdapter.getInitialState(),
  reducers: {
    upsertMany: propertyAdapter.upsertMany,
    upsertOne: propertyAdapter.upsertOne,
    removeOne: propertyAdapter.removeOne,
    removeMany: propertyAdapter.removeMany,
    reset: propertyAdapter.removeAll,
    updateOne: propertyAdapter.updateOne,
    updateMany: propertyAdapter.updateMany
  }
});

export const {
  upsertMany,
  upsertOne,
  removeOne,
  removeMany,
  reset,
  updateOne,
  updateMany
} = properties.actions;

export const propertyReducer = properties.reducer;

export const propertySelectors = propertyAdapter.getSelectors(
  (state: RootState) => state.properties
);
